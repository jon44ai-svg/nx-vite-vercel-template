# Changelog

All notable changes to this template are documented in this file and rendered directly in the frontend Changelog view.

## [0.2.0] - 2026-11-20

### Added

- Modular startup CLI (`bun run setup`) with `template.config.json` and `.template/features.json`.
- Shared libraries: `@nx-vite-vercel/shared-types`, `@nx-vite-vercel/dal`, and mobile-friendly `@nx-vite-vercel/ui`.
- Storybook workshop for `@nx-vite-vercel/ui` with autodocs stories.
- `oxlint` and `oxfmt` workspace linting and formatting.
- Mobile-friendly Admin Panel and in-app Changelog viewer in `apps/web`.
- Optional TanStack Start starter (`apps/web-tanstack`) and Expo mobile starter (`apps/mobile-expo`).
- Optional NestJS (TypeORM + Pino + Swagger) and Python FastAPI (`uv` + SQLAlchemy + structlog + OpenAPI) backends with parity password + JWT auth and admin endpoints.
- Profiled `docker-compose.yml`, service Dockerfiles, Mise tasks, and persistent project memory docs.

## [0.1.0] - 2026-11-20

### Added

- Initial Nx + Vite + React + Vercel SPA monorepo scaffold with Bun.
- Vitest unit tests, Puppeteer E2E smoke test, optional PWA support, React Doctor, and template freshness audit script.
