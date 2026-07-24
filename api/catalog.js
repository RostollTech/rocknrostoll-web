import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

// Font única de veritat per al catàleg de productes/preus, compartida per
// checkout.js (Stripe) i server.js (vendes físiques): evita que es
// desincronitzin com va passar quan el catàleg vivia duplicat en dos llocs.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const CATALOG = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/products.json'), 'utf-8'));
export const CATALOG_BY_NAME = new Map(CATALOG.map(p => [p.name, p]));

export function getUnitPrice(name) {
    const product = CATALOG_BY_NAME.get(name);
    const price = product ? parseFloat(String(product.price).replace(',', '.')) : NaN;
    return Number.isFinite(price) ? price : null;
}

// Productes com "Pack Lo de Sempre" no tenen estoc propi: són la unió d'altres
// productes reals (bundleOf). La talla que arriba del carret és les talles de
// cada peça unides amb "+" (mateix ordre que bundleOf a products.json), p.ex.
// "M+L". Aquesta funció "desplega" una línia de comanda en les línies d'estoc
// reals que cal reservar/descomptar.
export function expandToStockLines(item) {
    const product = CATALOG_BY_NAME.get(item.name);
    if (!product?.bundleOf) {
        return [{ name: item.name, size: item.size, quantity: item.quantity }];
    }
    const sizes = String(item.size || '').split('+');
    return product.bundleOf.map((component, i) => ({
        name: component.product,
        size: sizes[i] || '',
        quantity: item.quantity,
    }));
}

// Text llegible quan la talla és composta (pack): "Màniga Curta M / Màniga Llarga L".
export function describeSize(item) {
    const product = CATALOG_BY_NAME.get(item.name);
    if (!product?.bundleOf || !item.size) return item.size;
    const sizes = String(item.size).split('+');
    return product.bundleOf.map((component, i) => `${component.label} ${sizes[i] || '?'}`).join(' / ');
}
