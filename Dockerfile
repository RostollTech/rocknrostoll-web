# Stage 1: build de React (Vite)
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: runtime — un sol procés Node serveix la SPA i l'API (Stripe)
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY server.js ./
COPY api ./api
COPY src/utils/shopConfig.js ./src/utils/shopConfig.js
COPY --from=frontend /app/dist ./dist

EXPOSE 8890
CMD ["node", "server.js"]
