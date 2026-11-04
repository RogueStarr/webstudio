# ---- Stage 1: Build ----
FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm AS builder

WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@9.14.4 --activate

# Copy workspace configuration files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/builder/package.json ./apps/builder/

# Copy the rest of the source code
COPY . .

# Install dependencies and build the monorepo packages/builder
RUN pnpm install --frozen-lockfile
RUN pnpm build

# ---- Stage 2: Runtime ----
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install essential runtime tools if needed
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

# Copy built artifacts and necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/builder ./apps/builder
COPY --from=builder /app/package.json ./package.json

WORKDIR /app/apps/builder

EXPOSE 3000

# Start the builder server
CMD ["pnpm", "start"]