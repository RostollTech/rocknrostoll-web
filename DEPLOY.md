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
nano .env   # posa-hi la STRIPE_SECRET_KEY real (la que tenies a Vercel)
```

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

## Actualitzar en el futur

```bash
cd ~/rocknrostoll-web
git pull
docker compose up -d --build
```
