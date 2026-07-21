# Stage 1: build de React (Vite)
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package*.json ./
# python3/make/g++: better-sqlite3 (mòdul natiu) es compila també aquí perquè npm ci instal·la totes les deps.
RUN apk add --no-cache python3 make g++ && npm ci
COPY . .
RUN npm run build

# Stage 2: runtime — un sol procés Node serveix la SPA, l'API (Stripe) i l'admin
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
# python3/make/g++: calen per compilar better-sqlite3 (mòdul natiu) a Alpine.
RUN apk add --no-cache python3 make g++ \
    && npm ci --omit=dev \
    && apk del python3 make g++
COPY server.js ./
COPY api ./api
COPY admin ./admin
COPY src/utils/shopConfig.js ./src/utils/shopConfig.js
COPY src/data/products.json ./src/data/products.json
COPY --from=frontend /app/dist ./dist

EXPOSE 8890
CMD ["node", "server.js"]
