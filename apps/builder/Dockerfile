# ---- Stage 1: Build ----
FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm AS builder

WORKDIR /app

RUN npm install -g corepack@latest --force && corepack enable && corepack prepare pnpm@9.14.4 --activate

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter=@webstudio-is/builder... build

# ---- Stage 2: Runtime ----
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

RUN npm install -g corepack@latest --force && corepack enable && corepack prepare pnpm@9.14.4 --activate

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/builder/node_modules ./apps/builder/node_modules
COPY --from=builder /app/apps/builder/package.json ./apps/builder/package.json
COPY --from=builder /app/apps/builder/build ./apps/builder/build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

WORKDIR /app/apps/builder

EXPOSE 3000

CMD ["pnpm", "start"]