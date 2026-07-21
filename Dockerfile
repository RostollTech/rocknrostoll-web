# Stage 1: build de React (Vite)
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: runtime — un sol procés Node serveix la SPA, l'API (Stripe) i l'admin
# Debian (glibc) en lloc d'Alpine (musl): better-sqlite3 (mòdul natiu) peta en
# temps d'execució sota musl en alguns sistemes; Debian és el target més provat.
FROM node:20-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && npm ci --omit=dev \
    && apt-get purge -y python3 make g++ \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*
COPY server.js ./
COPY api ./api
COPY admin ./admin
COPY src/utils/shopConfig.js ./src/utils/shopConfig.js
COPY src/data/products.json ./src/data/products.json
COPY --from=frontend /app/dist ./dist

EXPOSE 8890
CMD ["node", "server.js"]
