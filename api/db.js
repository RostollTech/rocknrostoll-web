import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import Database from 'better-sqlite3';
import { expandToStockLines, CATALOG_BY_NAME } from './catalog.js';

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

// Migració senzilla per a bases de dades creades abans d'aquestes columnes.
try {
    db.exec('ALTER TABLE orders ADD COLUMN picked_up INTEGER NOT NULL DEFAULT 0');
} catch {
    // ja existeix
}
try {
    db.exec('ALTER TABLE orders ADD COLUMN pickup_code TEXT');
    db.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_pickup_code ON orders(pickup_code) WHERE pickup_code IS NOT NULL');
} catch {
    // ja existeix
}

// Sense caràcters ambigus (0/O, 1/I/L).
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function generatePickupCode() {
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += CODE_CHARS[crypto.randomInt(CODE_CHARS.length)];
    }
    return code;
}

// Genera un codi de recollida únic abans de crear la sessió de Stripe, perquè
// es pugui mostrar ja a la pantalla de pagament (custom_text) i no només a
// /success. recordOrder el reutilitza en lloc de generar-ne un altre.
export function reserveNewPickupCode() {
    for (let attempt = 0; attempt < 5; attempt++) {
        const candidate = generatePickupCode();
        const exists = db.prepare('SELECT 1 FROM orders WHERE pickup_code = ?').get(candidate);
        if (!exists) return candidate;
    }
    throw new Error('No s\'ha pogut generar un codi de recollida únic');
}

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
export function recordOrder({ stripeSessionId, channel, customerName, customerEmail, items, donationCents, totalCents, pickupCode: preassignedPickupCode }) {
    // Codi de recollida només per a comandes online (les físiques ja s'entreguen
    // en el mateix moment de vendre-les). Si ja es va reservar en crear la
    // sessió de Stripe (per poder-lo mostrar allà mateix) es reutilitza aquí.
    let pickupCode = preassignedPickupCode || null;
    if (!pickupCode && (channel || 'online') === 'online') {
        for (let attempt = 0; attempt < 5 && !pickupCode; attempt++) {
            const candidate = generatePickupCode();
            const exists = db.prepare('SELECT 1 FROM orders WHERE pickup_code = ?').get(candidate);
            if (!exists) pickupCode = candidate;
        }
    }

    const result = db.prepare(`
        INSERT OR IGNORE INTO orders (stripe_session_id, channel, customer_name, customer_email, items, donation_cents, total_cents, pickup_code)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(stripeSessionId, channel || 'online', customerName || '', customerEmail || '', JSON.stringify(items), donationCents, totalCents, pickupCode);
    return result.changes > 0;
}

export function listOrders() {
    return db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all()
        .map(o => ({ ...o, items: JSON.parse(o.items), picked_up: !!o.picked_up }));
}

export function setPickedUp(orderId, pickedUp) {
    db.prepare('UPDATE orders SET picked_up = ? WHERE id = ?').run(pickedUp ? 1 : 0, orderId);
}

// Per a la pàgina d'èxit del pagament: consulta l'estat d'una comanda pel
// stripe_session_id (el paràmetre que Stripe posa a la URL de redirecció).
export function getOrderBySessionId(sessionId) {
    const row = db.prepare('SELECT * FROM orders WHERE stripe_session_id = ?').get(sessionId);
    return row ? { ...row, items: JSON.parse(row.items), picked_up: !!row.picked_up } : null;
}

// Per a l'admin: consulta (sense marcar res) quina comanda té aquest codi,
// perquè el staff vegi què ha de donar abans de confirmar la recollida.
export function getOrderByPickupCode(code) {
    const row = db.prepare('SELECT * FROM orders WHERE pickup_code = ?').get((code || '').trim().toUpperCase());
    return row ? { ...row, items: JSON.parse(row.items), picked_up: !!row.picked_up } : null;
}

// Per a l'admin: marca com a recollida la comanda que tingui aquest codi.
// Retorna la comanda actualitzada, o null si el codi no existeix.
export function markPickedUpByCode(code) {
    const row = db.prepare('SELECT * FROM orders WHERE pickup_code = ?').get((code || '').trim().toUpperCase());
    if (!row) return null;
    db.prepare('UPDATE orders SET picked_up = 1 WHERE id = ?').run(row.id);
    return { ...row, items: JSON.parse(row.items), picked_up: true };
}

function isValidSize(item, size) {
    const product = CATALOG_BY_NAME.get(item.name);
    if (!product) return false;
    if (product.bundleOf) {
        const parts = String(size || '').split('+');
        return parts.length === product.bundleOf.length
            && product.bundleOf.every((component, i) => component.sizes.includes(parts[i]));
    }
    return Array.isArray(product.sizes) && product.sizes.includes(size);
}

// Canvia la talla d'una línia d'una comanda (recollida presencial: el client
// ve a buscar-ho i vol una talla diferent de la que va triar online).
// Dins la mateixa transacció: retorna l'estoc de la talla vella i en
// descompta la nova — si no n'hi ha prou de la nova, no es canvia res.
// Fer-ho en aquest ordre (retornar abans de reservar) fa que funcioni bé fins
// i tot quan un pack canvia només una peça i l'altra es queda igual (la
// mateixa línia d'estoc es retorna i es torna a reservar sense quedar curta
// pel mig). itemIndex és la posició dins l'array items de la comanda.
export function changeOrderItemSize(orderId, itemIndex, newSize) {
    const tx = db.transaction((id) => {
        const row = db.prepare('SELECT items, picked_up FROM orders WHERE id = ?').get(id);
        if (!row) throw new Error('Comanda no trobada');
        if (row.picked_up) throw new Error('Aquesta comanda ja s\'ha recollit');

        const items = JSON.parse(row.items);
        const item = items[itemIndex];
        if (!item) throw new Error('Producte no trobat a la comanda');
        if (!item.size) throw new Error('Aquest producte no té talla per canviar');
        if (item.size === newSize) return items;
        if (!isValidSize(item, newSize)) throw new Error(`Talla no vàlida per a "${item.name}"`);

        const oldLines = expandToStockLines(item);
        const newItem = { ...item, size: newSize };
        const newLines = expandToStockLines(newItem);

        restoreStock(oldLines);
        reserveOrThrow(newLines);

        items[itemIndex] = newItem;
        db.prepare('UPDATE orders SET items = ? WHERE id = ?').run(JSON.stringify(items), id);
        return items;
    });
    return tx(orderId);
}

// Registers an in-person (physical) sale: atomically checks & decrements stock
// (throws — and sells nothing — if there isn't enough) and logs it alongside the
// online orders so both channels draw from, and are visible against, one shared
// stock count. Can hold several product lines (multi-item sale) in one go.
// items: [{ name, size, quantity }] — what was actually sold (shown in the
//   admin as-is, e.g. a pack keeps its own name and composite "M+L" size).
export function sellPhysical(items, note, totalCents) {
    const stockLines = items.flatMap(expandToStockLines);
    reserveOrThrow(stockLines);
    recordOrder({
        stripeSessionId: `physical_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
        channel: 'physical',
        customerName: note || 'Venda física',
        customerEmail: '',
        items,
        donationCents: 0,
        totalCents: totalCents || 0,
    });
}

// Undoes a physical sale: restores the stock it had decremented and deletes the
// order. Only works on channel === 'physical' — online orders are tied to a
// real Stripe payment and must never be silently deleted from here. Returns
// true if something was actually deleted.
export function deletePhysicalSale(orderId) {
    const tx = db.transaction(id => {
        const row = db.prepare("SELECT items FROM orders WHERE id = ? AND channel = 'physical'").get(id);
        if (!row) return false;
        restoreStock(JSON.parse(row.items).flatMap(expandToStockLines));
        db.prepare('DELETE FROM orders WHERE id = ?').run(id);
        return true;
    });
    return tx(orderId);
}

export default db;
