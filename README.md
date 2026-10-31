# Rock’n’Rostoll · Web

Web estàtica del festival Rock’n’Rostoll, feta amb **React + Vite** i desplegada a **Vercel**.

No hi ha servidor ni base de dades: tot el que es publica són fitxers estàtics generats per `vite build`.

## Posar-la en marxa en local

```bash
npm install
npm run dev      # http://localhost:5173
```

Altres ordres:

```bash
npm run build    # genera la carpeta dist/
npm run preview  # serveix dist/ per comprovar el build
```

## Desplegament

Cada `git push` a `main` dispara un desplegament automàtic a Vercel. La configuració viu a
[vercel.json](vercel.json):

- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`
- Un *rewrite* que envia qualsevol ruta a `/index.html` perquè funcionin els enllaços directes
  (`/shop`, `/about`…), ja que l'enrutament el fa React Router dins del navegador.

Les branques diferents de `main` generen una *preview* amb la seva pròpia URL, útil per revisar
canvis abans de publicar-los.

## Com actualitzar el contingut

| Què vols canviar | On |
| --- | --- |
| Data del festival i compte enrere | [src/pages/Home.jsx](src/pages/Home.jsx) (`Countdown`, `hero-meta`, JSON-LD) i [src/components/Countdown.jsx](src/components/Countdown.jsx) |
| Cartell d'artistes | [src/data/lineup.js](src/data/lineup.js) |
| Bandes de la Nit de Rock | [src/data/bands.js](src/data/bands.js) |
| Productes del marxandatge | [src/data/products.json](src/data/products.json) |
| Menú de navegació | [src/data/navigation.js](src/data/navigation.js) |
| Galeria de fotos | [src/data/gallery.js](src/data/gallery.js) |
| Imatges i fitxers públics | [public/](public/) (es copien tal qual a l'arrel del web) |

### El cartell

Mentre no hi hagi cartell confirmat, la portada mostra una secció "Cartell per anunciar". Per
tornar a mostrar els artistes cal recuperar la graella de `LineupCard` a
[src/pages/Home.jsx](src/pages/Home.jsx) amb les dades de `src/data/lineup.js`.

### La botiga

`/shop` és només un catàleg informatiu: mostra els productes i la guia de talles, sense venda.
L'interruptor és `IS_SHOP_OPEN` a [src/utils/shopConfig.js](src/utils/shopConfig.js), que controla
el rètol "No disponible" de cada producte.

> La venda online (Stripe, estoc, panell d'administració i codis de recollida) s'ha retirat del
> projecte. Si algun any la voleu recuperar, el codi és a l'historial de git (commits anteriors a
> la migració a Vercel) i caldrà reimplantar-la com a *serverless functions* de Vercel, perquè en
> un allotjament estàtic no hi ha servidor propi ni disc per a la base de dades.

## SEO

- Les metaetiquetes inicials (les que llegeixen Google i les xarxes socials) són a
  [index.html](index.html).
- Cada pàgina les sobreescriu en navegar amb el component [src/components/SEO.jsx](src/components/SEO.jsx).
- La imatge de previsualització dels enllaços és `public/img/og-rocknrostoll.jpg` (1200×630).
- Rutes indexables: [public/sitemap.xml](public/sitemap.xml) · directives: [public/robots.txt](public/robots.txt).
