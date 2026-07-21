import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import Database from 'better-sqlite3';

const dataDir = process.env.DATA_DIR || '.';
fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'shop.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS stock (
    product_name TEXT NOT NULL,
    size TEXT NOT NULL DEFAULT '',
    quantity INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (product_name, size)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stripe_session_id TEXT UNIQUE NOT NULL,
    channel TEXT NOT NULL DEFAULT 'online',
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

const normSize = size => size || '';

export function getStock(name, size) {
    const row = db.prepare('SELECT quantity FROM stock WHERE product_name = ? AND size = ?').get(name, normSize(size));
    return row ? row.quantity : 0;
}

export function getAllStock() {
    return db.prepare('SELECT product_name, size, quantity FROM stock ORDER BY product_name, size').all();
}

export function setStock(name, size, quantity) {
    db.prepare(`
        INSERT INTO stock (product_name, size, quantity) VALUES (?, ?, ?)
        ON CONFLICT(product_name, size) DO UPDATE SET quantity = excluded.quantity
    `).run(name, normSize(size), quantity);
}

// Decrements stock atomically without going below zero (safety-net path, not the
// normal flow — see reserveStock for the atomic all-or-nothing reservation used
// by checkout).
export function decrementStock(name, size, amount) {
    const s = normSize(size);
    const result = db.prepare(
        'UPDATE stock SET quantity = quantity - ? WHERE product_name = ? AND size = ? AND quantity >= ?'
    ).run(amount, name, s, amount);
    if (result.changes === 0) {
        db.prepare(
            'INSERT INTO stock (product_name, size, quantity) VALUES (?, ?, 0) ON CONFLICT(product_name, size) DO UPDATE SET quantity = 0'
        ).run(name, s);
    }
}

// Reserves stock for every line atomically (all or nothing): decrements each
// quantity only if enough is available, otherwise throws and rolls everything back.
// items: [{ name, size, quantity }]
function reserveOrThrow(items) {
    const decrement = db.prepare(
        'UPDATE stock SET quantity = quantity - ? WHERE product_name = ? AND size = ? AND quantity >= ?'
    );
    const tx = db.transaction(list => {
        for (const item of list) {
            const s = normSize(item.size);
            const result = decrement.run(item.quantity, item.name, s, item.quantity);
            if (result.changes === 0) {
                const available = getStock(item.name, s);
                const sizeLabel = s ? ` talla ${s}` : '';
                throw new Error(`No queda prou estoc de "${item.name}"${sizeLabel} (disponibles: ${available})`);
            }
        }
    });
    tx(items);
}

export function reserveStock(items) {
    reserveOrThrow(items);
}

// Gives reserved stock back (used when Stripe session creation fails, or when a
// session expires unpaid).
export function restoreStock(items) {
    const increment = db.prepare(
        'INSERT INTO stock (product_name, size, quantity) VALUES (?, ?, ?) ON CONFLICT(product_name, size) DO UPDATE SET quantity = quantity + excluded.quantity'
    );
    const tx = db.transaction(list => {
        for (const item of list) increment.run(item.name, normSize(item.size), item.quantity);
    });
    tx(items);
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
        restoreStock(JSON.parse(row.items));
        db.prepare("UPDATE reservations SET status = 'restored' WHERE stripe_session_id = ?").run(id);
        return true;
    });
    return tx(sessionId);
}

// Returns true if the order was newly inserted, false if it already existed
// (Stripe retries webhook deliveries, so this must be idempotent).
export function recordOrder({ stripeSessionId, channel, customerName, customerEmail, items, donationCents, totalCents }) {
    const result = db.prepare(`
        INSERT OR IGNORE INTO orders (stripe_session_id, channel, customer_name, customer_email, items, donation_cents, total_cents)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(stripeSessionId, channel || 'online', customerName || '', customerEmail || '', JSON.stringify(items), donationCents, totalCents);
    return result.changes > 0;
}

export function listOrders() {
    return db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all()
        .map(o => ({ ...o, items: JSON.parse(o.items) }));
}

// Registers an in-person (physical) sale: atomically checks & decrements stock
// (throws — and sells nothing — if there isn't enough) and logs it alongside the
// online orders so both channels draw from, and are visible against, one shared
// stock count.
// items: [{ name, size, quantity }]
export function sellPhysical(items, note) {
    reserveOrThrow(items);
    recordOrder({
        stripeSessionId: `physical_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
        channel: 'physical',
        customerName: note || 'Venda física',
        customerEmail: '',
        items,
        donationCents: 0,
        totalCents: 0,
    });
}

export default db;
