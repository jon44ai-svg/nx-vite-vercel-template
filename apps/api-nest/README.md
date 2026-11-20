# Optional NestJS API

Opt-in NestJS backend featuring:

- Environment validation (`@nestjs/config` + `zod`)
- Structured JSON logging (`nestjs-pino` + `pino-http`)
- Persistence (`TypeORM` + `better-sqlite3`)
- Password + JWT authentication (`bcryptjs` + `@nestjs/jwt`)
- Role-protected Admin endpoints (`/admin/stats`, `/admin/users`)
- OpenAPI / Swagger UI at `/docs`

## Quick Start

```bash
bun run setup --enable=apiNest
bun install
cp apps/api-nest/.env.example apps/api-nest/.env
bun run dev:nest
```

Open [http://localhost:3000/docs](http://localhost:3000/docs) for interactive API documentation.
