# Nx + Vite + Vercel Modular Template

A modular, mobile-friendly monorepo template powered by **Bun**, **Nx**, **Vite**, **React 19**, **Storybook**, **Oxlint/Oxfmt**, **Mise**, and opt-in full-stack modules.

## Quick Start

```bash
bun install
bun run setup       # Interactive CLI to toggle optional frontends, backends, PWA, Storybook, auth, admin
bun run dev         # Start Vite web app at http://localhost:4200
```

Non-interactive presets:

```bash
bun run setup --preset=web-only
bun run setup --preset=nest
bun run setup --preset=python
bun run setup --enable=apiNest,storybook,pwa
```

## Workspace Structure

```text
├── apps/
│   ├── web/              # Default Vite + React SPA (mobile-friendly, optional PWA, Admin & Changelog UI)
│   ├── web-tanstack/     # Optional TanStack Start SSR frontend
│   ├── mobile-expo/      # Optional Expo / React Native frontend
│   ├── api-nest/         # Optional NestJS + TypeORM + Pino + JWT + Swagger API
│   └── api-python/       # Optional FastAPI + uv + SQLAlchemy + structlog + JWT + OpenAPI API
├── libs/
│   ├── shared-types/     # Shared API, auth, changelog, and feature flag types
│   ├── dal/              # Injectable HTTP client, API DAL, and CHANGELOG parser
│   └── ui/               # Mobile-friendly custom UI components + Storybook stories
├── .storybook/           # Storybook (Vite + React) configuration
├── tools/
│   ├── template-cli/     # Modular startup CLI (`bun run setup`)
│   ├── e2e/              # Puppeteer headless smoke test
│   └── verify-template.ts # Bun audit + deprecated dependency verifier
├── docs/                 # Persistent project memory (features, requests, bugs, hiccups, API docs)
├── CHANGELOG.md          # Release notes rendered directly in the frontend
├── docker-compose.yml    # Profiled Docker Compose (`--profile nest`, `--profile python`)
├── mise.toml             # Toolchain versions and verification tasks
└── template.config.json  # Active modular feature configuration
```

## Common Commands

| Command                                         | Description                                         |
| ----------------------------------------------- | --------------------------------------------------- |
| `bun run dev`                                   | Start Vite web dev server (`http://localhost:4200`) |
| `bun run build`                                 | Build production web bundle (`dist/apps/web`)       |
| `bun run lint`                                  | Lint workspace with `oxlint`                        |
| `bun run format` / `bun run format:check`       | Format or verify formatting with `oxfmt`            |
| `bun run typecheck`                             | Typecheck `apps/web` and shared libs                |
| `bun run test`                                  | Run Vitest unit tests                               |
| `bun run test:e2e`                              | Run Puppeteer browser smoke test                    |
| `bun run storybook` / `bun run build-storybook` | Run or build Storybook for `libs/ui`                |
| `bun run doctor`                                | Scan React app health with React Doctor             |
| `bun run verify:template`                       | Run `bun audit` and deprecated dependency check     |
| `mise run verify`                               | Run the full verification suite via Mise            |

## Optional Backends & Docker

Both backends expose the exact same REST + JWT + Admin contract documented in [`docs/api.md`](docs/api.md):

- **NestJS (`:3000`)**: `bun run setup --enable=apiNest && bun install && bun run dev:nest` (Swagger at `/docs`)
- **Python FastAPI (`:8000`)**: `cd apps/api-python && uv sync && uv run uvicorn app.main:app --reload --port 8000` (OpenAPI at `/docs`)
- **Docker Compose**:
  - Web only: `docker compose up --build`
  - Web + NestJS: `docker compose --profile nest up --build`
  - Web + Python: `docker compose --profile python up --build`
