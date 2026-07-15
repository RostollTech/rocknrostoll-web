// Un sol procés: serveix la SPA (dist/) i l'API de Stripe, tot en un contenidor.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import checkout from './api/checkout.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.all('/api/checkout', (req, res) => checkout(req, res));

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
