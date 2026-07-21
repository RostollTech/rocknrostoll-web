# Desplegament al servidor (Lenovo)

Aquest projecte és un sol contenidor Docker (com `web-truc`): un procés Node
fa `npm run build` del React i després serveix els fitxers estàtics (`dist/`)
i l'API de Stripe (`/api/checkout`) des del mateix port. No hi ha nginx dins
del contenidor.

Com és una botiga **pública** (checkout de Stripe), el domini
`rocknrostoll.cat` s'exposa **directament pel Cloudflare Tunnel**, sense
passar per l'nginx/Authelia del servidor — així ningú necessita fer login
per comprar.

## 1. Portar el codi al servidor

Des del teu Lenovo (SSH o Tailscale):

```bash
cd ~
git clone <url-del-repo> rocknrostoll-web   # o `git pull` si ja hi és
cd rocknrostoll-web
```

## 2. Variables d'entorn

```bash
cp .env.example .env
nano .env
```

Omple:
- `STRIPE_SECRET_KEY` — la clau real (la que tenies a Vercel).
- `STRIPE_WEBHOOK_SECRET` — la generes al pas 7, un cop tinguis el domini funcionant.
- `ADMIN_USER` / `ADMIN_PASSWORD` — les credencials que vulguis per entrar a `/admin`.

## 3. Build i arrencada

```bash
docker compose up -d --build
```

Comprova que respon:

```bash
curl http://localhost:8890/health
# {"ok":true}
```

El port intern/extern és `8890` (definit a `docker-compose.yml` i al
`Dockerfile`). Si aquest port ja està en ús al servidor, canvia'l als dos
llocs.

## 4. DNS de `rocknrostoll.cat`

Si el domini encara no és a Cloudflare: entra al panell del registrador
(on el vas comprar) i canvia els *nameservers* pels que et doni Cloudflare
en donar d'alta la zona `rocknrostoll.cat`.

## 5. Afegir el domini al Cloudflare Tunnel

Al servidor, al fitxer de configuració del tunnel (normalment
`~/.cloudflared/config.yml`, el tunnel es diu `lenovo-server`), afegeix una
regla d'`ingress` **abans** de la regla `catch-all` (`service: http_status:404`):

```yaml
ingress:
  - hostname: rocknrostoll.cat
    service: http://localhost:8890
  - hostname: www.rocknrostoll.cat
    service: http://localhost:8890
  # ... (la resta de regles existents, jofefo.online, etc.)
  - service: http_status:404
```

Després crea els registres DNS que apunten al tunnel:

```bash
cloudflared tunnel route dns lenovo-server rocknrostoll.cat
cloudflared tunnel route dns lenovo-server www.rocknrostoll.cat
```

I reinicia el servei del tunnel:

```bash
sudo systemctl restart cloudflared
```

## 6. Verificació

Obre `https://rocknrostoll.cat` des de fora — hauria de carregar la web
directament (sense passar per l'nginx del port 8443 ni per Authelia).

## 7. Webhook de Stripe (estoc i comandes)

L'estoc i el registre de comandes es guarden en una base de dades local
(SQLite, al volum `./data` del `docker-compose.yml`). L'estoc es **reserva**
en el moment que algú clica "Pagar" (no quan paga de veritat), perquè dues
persones no puguin comprar la mateixa última unitat alhora. Si abandona el
pagament, la sessió de Stripe caduca als 30 minuts i l'estoc es retorna
automàticament. Per això calen dos esdeveniments al webhook:

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**.
2. URL: `https://rocknrostoll.cat/api/webhook`
3. Esdeveniments a escoltar: **`checkout.session.completed`** i
   **`checkout.session.expired`** (tots dos, no només un).
4. Un cop creat, copia el **Signing secret** (`whsec_...`) i posa'l a `.env`
   com a `STRIPE_WEBHOOK_SECRET`.
5. Torna a aixecar el contenidor perquè agafi la variable nova:
   ```bash
   docker compose up -d --build
   ```

## 8. Panell d'administració

A `https://rocknrostoll.cat/admin` (usuari/contrasenya = `ADMIN_USER` /
`ADMIN_PASSWORD` de l'`.env`) pots veure i editar l'estoc de cada producte,
i consultar el llistat de comandes pagades. **Important**: quan reactivis
la botiga, entra-hi primer per posar l'estoc real de cada producte — per
defecte tots comencen a 0 i el checkout rebutjarà qualsevol compra fins que
hi hagi unitats disponibles.

## Actualitzar en el futur

Es fa sol: cada `git push` a `main` dispara el workflow de GitHub Actions
(`.github/workflows/deploy.yml`), que fa `git pull` i
`docker compose up -d --build` al servidor via SSH/Tailscale.

Manualment, si mai cal:

```bash
cd ~/rocknrostoll-web
git pull
docker compose up -d --build
```
