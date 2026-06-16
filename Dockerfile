# --- Build du portail Solayia (Next.js standalone) ---
# Image multi-étapes : deps -> build -> runtime minimal.
# Base Debian slim : la plus fiable pour Prisma (OpenSSL présent).

FROM node:22-slim AS base
WORKDIR /app

# --- Dépendances ---
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# --- Build ---
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# --- Runtime ---
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

# Sortie standalone de Next.js (serveur + dépendances tracées)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Client Prisma généré + moteur natif (le tracing de Next l'omet parfois).
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Le conteneur ne fait que servir l'app. Les migrations sont une étape
# explicite (`npm run db:deploy`), voir docs/DEPLOYMENT.md.
CMD ["node", "server.js"]
