# Stage 1: build de React (Vite)
# Node 22: better-sqlite3 >=13 requereix Node >=22 (amb Node 20 compila
# "bé" però peta amb un segfault en temps d'execució per ABI incompatible).
FROM node:22-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache python3 make g++ && npm ci
COPY . .
RUN npm run build

# Stage 2: runtime — un sol procés Node serveix la SPA, l'API (Stripe) i l'admin
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
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
