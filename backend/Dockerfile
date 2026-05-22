# ── Stage: production ───────────────────────────────────────
FROM node:24-alpine AS production

WORKDIR /app

# Install dependencies first (layer caching)
COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

# Copy source
COPY . .

EXPOSE 3456

CMD ["node", "server.js"]
