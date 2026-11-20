FROM oven/bun:1.4-alpine AS builder
WORKDIR /app

COPY package.json bun.lock* template.config.json tsconfig.base.json CHANGELOG.md ./
COPY apps/web ./apps/web
COPY libs ./libs

RUN bun install
RUN bun run build

FROM nginx:1.27-alpine
COPY --from=builder /app/dist/apps/web /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://127.0.0.1:80/ >/dev/null || exit 1
