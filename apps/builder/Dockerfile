# ---- Stage 1: Build ----
FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm AS builder

WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@9.14.4 --activate

# Copy workspace configuration and source files
COPY . .

# Install dependencies and build the builder app along with all workspace dependencies
RUN pnpm install --frozen-lockfile
RUN pnpm --filter=@webstudio-is/builder... build

# ---- Stage 2: Runtime ----
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Enable pnpm in runner stage so pnpm start works out-of-the-box
RUN corepack enable && corepack prepare pnpm@9.14.4 --activate

# Copy built dependencies, workspace packages, and the compiled Remix app output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/builder/package.json ./apps/builder/package.json
COPY --from=builder /app/apps/builder/build ./apps/builder/build
COPY --from=builder /app/package.json ./package.json

WORKDIR /app/apps/builder

EXPOSE 3000

# Start the builder server via pnpm
CMD ["pnpm", "start"]