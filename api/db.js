import path from 'node:path';
import fs from 'node:fs';
import Database from 'better-sqlite3';

const dataDir = process.env.DATA_DIR || '.';
fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'shop.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS stock (
    product_name TEXT PRIMARY KEY,
    quantity INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stripe_session_id TEXT UNIQUE NOT NULL,
    customer_name TEXT,
    customer_email TEXT,
    items TEXT NOT NULL,
    donation_cents INTEGER NOT NULL DEFAULT 0,
    total_cents INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS reservations (
    stripe_session_id TEXT PRIMARY KEY,
    items TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'reserved',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export function ensureProduct(name) {
    db.prepare('INSERT OR IGNORE INTO stock (product_name, quantity) VALUES (?, 0)').run(name);
}

export function getStock(name) {
    const row = db.prepare('SELECT quantity FROM stock WHERE product_name = ?').get(name);
    return row ? row.quantity : 0;
}

export function getAllStock() {
    return db.prepare('SELECT product_name, quantity FROM stock ORDER BY product_name').all();
}

export function setStock(name, quantity) {
    db.prepare(`
        INSERT INTO stock (product_name, quantity) VALUES (?, ?)
        ON CONFLICT(product_name) DO UPDATE SET quantity = excluded.quantity
    `).run(name, quantity);
}

// Decrements stock atomically without going below zero.
export function decrementStock(name, amount) {
    const result = db.prepare(
        'UPDATE stock SET quantity = quantity - ? WHERE product_name = ? AND quantity >= ?'
    ).run(amount, name, amount);
    if (result.changes === 0) {
        db.prepare('UPDATE stock SET quantity = 0 WHERE product_name = ?').run(name);
    }
}

// Reserves stock for every product atomically (all or nothing): decrements each
// quantity only if enough is available, otherwise throws and rolls everything back.
// totals: { productName: totalQuantity }
export function reserveStock(totals) {
    const decrement = db.prepare(
        'UPDATE stock SET quantity = quantity - ? WHERE product_name = ? AND quantity >= ?'
    );
    const tx = db.transaction(t => {
        for (const [name, qty] of Object.entries(t)) {
            const result = decrement.run(qty, name, qty);
            if (result.changes === 0) {
                const available = getStock(name);
                throw new Error(`No queda prou estoc de "${name}" (disponibles: ${available})`);
            }
        }
    });
    tx(totals);
}

// Gives reserved stock back (used when Stripe session creation fails).
export function restoreStock(totals) {
    const increment = db.prepare('UPDATE stock SET quantity = quantity + ? WHERE product_name = ?');
    const tx = db.transaction(t => {
        for (const [name, qty] of Object.entries(t)) increment.run(qty, name);
    });
    tx(totals);
}

// items: [{ name, size, quantity }]
export function createReservation(sessionId, items) {
    db.prepare(
        "INSERT OR IGNORE INTO reservations (stripe_session_id, items, status) VALUES (?, ?, 'reserved')"
    ).run(sessionId, JSON.stringify(items));
}

// Marks a reservation as completed (payment confirmed). Returns true only the
// first time, so webhook retries can't act twice.
export function completeReservation(sessionId) {
    const result = db.prepare(
        "UPDATE reservations SET status = 'completed' WHERE stripe_session_id = ? AND status = 'reserved'"
    ).run(sessionId);
    return result.changes > 0;
}

// Gives the stock of an abandoned (expired) session back. Idempotent: only the
// first call restores; retries find status != 'reserved' and do nothing.
export function releaseReservation(sessionId) {
    const tx = db.transaction(id => {
        const row = db.prepare(
            "SELECT items FROM reservations WHERE stripe_session_id = ? AND status = 'reserved'"
        ).get(id);
        if (!row) return false;
        const increment = db.prepare('UPDATE stock SET quantity = quantity + ? WHERE product_name = ?');
        JSON.parse(row.items).forEach(i => increment.run(i.quantity, i.name));
        db.prepare("UPDATE reservations SET status = 'restored' WHERE stripe_session_id = ?").run(id);
        return true;
    });
    return tx(sessionId);
}

// Returns true if the order was newly inserted, false if it already existed
// (Stripe retries webhook deliveries, so this must be idempotent).
export function recordOrder({ stripeSessionId, customerName, customerEmail, items, donationCents, totalCents }) {
    const result = db.prepare(`
        INSERT OR IGNORE INTO orders (stripe_session_id, customer_name, customer_email, items, donation_cents, total_cents)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(stripeSessionId, customerName || '', customerEmail || '', JSON.stringify(items), donationCents, totalCents);
    return result.changes > 0;
}

export function listOrders() {
    return db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all()
        .map(o => ({ ...o, items: JSON.parse(o.items) }));
}

export default db;
