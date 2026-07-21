// Un sol procés: serveix la SPA (dist/), l'API de Stripe i el panell d'admin, tot en un contenidor.
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import express from 'express';
import checkout from './api/checkout.js';
import webhook from './api/webhook.js';
import { getAllStock, setStock, listOrders, sellPhysical } from './api/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
const adminDir = path.join(__dirname, 'admin');

const app = express();

app.get('/health', (_req, res) => res.json({ ok: true }));

// Ha d'anar abans d'express.json(): Stripe necessita el body en cru per verificar la signatura.
app.post('/api/webhook', express.raw({ type: 'application/json' }), (req, res) => webhook(req, res));

app.use(express.json());

app.all('/api/checkout', (req, res) => checkout(req, res));

function timingSafeStringEqual(a, b) {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
}

function adminAuth(req, res, next) {
    const user = process.env.ADMIN_USER;
    const pass = process.env.ADMIN_PASSWORD;
    if (!user || !pass) {
        return res.status(503).send('Panell d\'admin no configurat (falten ADMIN_USER/ADMIN_PASSWORD)');
    }

    const header = req.headers.authorization || '';
    const [scheme, encoded] = header.split(' ');
    if (scheme === 'Basic' && encoded) {
        const decoded = Buffer.from(encoded, 'base64').toString();
        const sepIndex = decoded.indexOf(':');
        const reqUser = decoded.substring(0, sepIndex);
        const reqPass = decoded.substring(sepIndex + 1);
        if (timingSafeStringEqual(reqUser, user) && timingSafeStringEqual(reqPass, pass)) {
            return next();
        }
    }

    res.set('WWW-Authenticate', 'Basic realm="Admin"');
    return res.status(401).send('Autenticació requerida');
}

// La ruta de l'admin és configurable (ADMIN_PATH) perquè no quedi fixada
// al codi/repo — posa-hi una cadena aleatòria al .env, no "admin".
const adminPath = '/' + (process.env.ADMIN_PATH || 'admin').replace(/^\/+/, '');

app.use(adminPath, adminAuth);

app.get(`${adminPath}/api/data`, (_req, res) => {
    res.json({ stock: getAllStock(), orders: listOrders() });
});

app.post(`${adminPath}/api/stock`, (req, res) => {
    const { name, size, quantity } = req.body || {};
    if (!name || !Number.isInteger(quantity) || quantity < 0) {
        return res.status(400).json({ error: 'Dades no vàlides' });
    }
    setStock(name, size || '', quantity);
    res.json({ ok: true });
});

app.post(`${adminPath}/api/sell`, (req, res) => {
    const { name, size, quantity, note } = req.body || {};
    if (!name || !Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ error: 'Dades no vàlides' });
    }
    try {
        sellPhysical([{ name, size: size || '', quantity }], note);
        res.json({ ok: true });
    } catch (err) {
        res.status(409).json({ error: err.message });
    }
});

app.use(adminPath, express.static(adminDir));

app.use(express.static(distDir));

// Fallback per react-router (equivalent al "rewrites" de vercel.json)
// Express 5 no accepta '*' sol com a path, per això s'usa un middleware final.
app.use((_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
});

const port = process.env.PORT || 8890;
app.listen(port, () => {
    console.log(`rocknrostoll-web escoltant al port ${port}`);
});
