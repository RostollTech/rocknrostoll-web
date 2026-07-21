# Entorn de proves (staging)

Un segon contenidor, completament separat del de producció (carpeta,
port, base de dades i domini diferents), per provar canvis "online" de
veritat (incloent pagaments de prova amb Stripe) sense tocar
`rocknrostoll.cat`.

## 1. Crear la branca `staging`

Des del teu PC, dins del repo:

```bash
git checkout -b staging
git push -u origin staging
```

A partir d'ara, els canvis que vulguis provar es pugen a `staging`
(`git push origin staging`) en lloc de `main`. Quan estiguis content amb
el resultat, fas `git checkout main && git merge staging && git push`
per portar-ho a producció.

## 2. Clonar una còpia separada al servidor

Al servidor (Lenovo), en un directori diferent del de producció:

```bash
cd ~
git clone git@github.com:JoFeF08/rocknrostoll-web.git rocknrostoll-web-staging
cd rocknrostoll-web-staging
git checkout staging
```

## 3. `.env` de staging (clau de Stripe de TEST, port diferent)

```bash
cp .env.example .env
nano .env
```

Omple:
- `STRIPE_SECRET_KEY` → una clau de **test** (`sk_test_...`, no la real)
- `STRIPE_WEBHOOK_SECRET` → la generaràs al pas 5
- `ADMIN_USER` / `ADMIN_PASSWORD` → poden ser les mateixes o unes altres

Afegeix, al final del mateix `.env`, perquè no xoqui amb el contenidor de
producció que ja corre al mateix servidor:

```bash
echo "CONTAINER_NAME=rocknrostoll-web-staging" >> .env
echo "HOST_PORT=8891" >> .env
```

## 4. Aixecar el contenidor

```bash
docker compose up -d --build
curl http://localhost:8891/health
# {"ok":true}
```

## 5. Domini de proves i webhook

**Cloudflare Tunnel** (Zero Trust → Networks → Tunnels → `lenovo-server` →
Public Hostnames → *Add a public hostname*):
- Subdomain: `test`
- Domain: `rocknrostoll.cat`
- Service: HTTP → `localhost:8891`

**Stripe webhook** (Dashboard → Developers → Webhooks → Add endpoint):
- URL: `https://test.rocknrostoll.cat/api/webhook`
- Esdeveniments: `checkout.session.completed` **i** `checkout.session.expired`
  (tots dos — el segon és el que allibera l'estoc reservat si algú abandona
  el pagament)
- **Important**: fes servir el mode **Test** del Dashboard (interruptor a
  dalt a la dreta) perquè coincideixi amb la `STRIPE_SECRET_KEY` de test.
- Copia el signing secret (`whsec_...`) i posa'l a `.env` com a
  `STRIPE_WEBHOOK_SECRET`, després:
  ```bash
  docker compose up -d --build
  ```

## 6. Provar

Obre `https://test.rocknrostoll.cat` — funciona igual que la web real
(mateix codi), però:
- és un contenidor i una base de dades **totalment separats** del de
  producció (`rocknrostoll-web` no es toca per res),
- els pagaments són en **mode Test** de Stripe (targeta `4242 4242 4242
  4242`, no cobra res real),
- `https://test.rocknrostoll.cat/admin` té el seu propi estoc/comandes,
  independent del de `rocknrostoll.cat/admin`.

## Actualitzar l'staging

Cada `git push origin staging` desplega sol (via
`.github/workflows/deploy-staging.yml`) a
`~/rocknrostoll-web-staging` — no toca mai producció.
