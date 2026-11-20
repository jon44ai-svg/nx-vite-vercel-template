FROM oven/bun:1.4 AS runtime
WORKDIR /app/apps/api-nest

COPY apps/api-nest/package.json ./
RUN bun install

COPY apps/api-nest ./

ENV PORT=3000
ENV DATABASE_PATH=/data/api-nest.sqlite
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD bun -e "fetch('http://127.0.0.1:3000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
CMD ["bun", "run", "start"]
