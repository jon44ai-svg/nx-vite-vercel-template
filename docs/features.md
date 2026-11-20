# Features Log

| Feature                         | Module                            | Status  | Notes                                                                                      |
| ------------------------------- | --------------------------------- | ------- | ------------------------------------------------------------------------------------------ |
| Vite + React + Vercel SPA       | `apps/web`                        | Shipped | Mobile-friendly layout using `@nx-vite-vercel/ui`                                          |
| Optional PWA                    | `apps/web`                        | Shipped | Controlled by `template.config.json` (`features.pwa`) or `ENABLE_PWA`                      |
| Startup Modular CLI             | `tools/template-cli`              | Shipped | Interactive and flag-driven (`bun run setup`)                                              |
| Shared Types, DAL, UI Libs      | `libs/*`                          | Shipped | `@nx-vite-vercel/shared-types`, `@nx-vite-vercel/dal`, `@nx-vite-vercel/ui`                |
| Storybook Workshop              | `.storybook`, `libs/ui`           | Shipped | React + Vite builder with autodocs stories                                                 |
| Admin Panel & Changelog UI      | `apps/web`                        | Shipped | JWT sign-in, users table, feature status, live `CHANGELOG.md` renderer                     |
| Vitest + Puppeteer E2E          | `vitest.config.ts`, `tools/e2e`   | Shipped | Unit tests + headless browser smoke test                                                   |
| Oxlint + Oxfmt                  | `.oxlintrc.json`, `.oxfmtrc.json` | Shipped | Fast Rust-based lint and format checks                                                     |
| Optional TanStack Start         | `apps/web-tanstack`               | Shipped | Opt-in SSR frontend starter                                                                |
| Optional Expo Mobile            | `apps/mobile-expo`                | Shipped | Opt-in React Native / Expo frontend starter                                                |
| Optional NestJS Backend         | `apps/api-nest`                   | Shipped | Zod config, Pino logging, TypeORM + SQLite, bcrypt + JWT auth, Admin, Swagger              |
| Optional Python FastAPI Backend | `apps/api-python`                 | Shipped | `uv`, Pydantic settings, structlog, SQLAlchemy + SQLite, bcrypt + JWT auth, Admin, OpenAPI |
| Docker & Compose Profiles       | `docker-compose.yml`              | Shipped | Independent `nest` and `python` service profiles + Dockerfiles                             |
| Template Freshness Audit        | `tools/verify-template.ts`        | Shipped | Runs `bun audit` + deprecated dependency checks                                            |
| React Doctor & Mise             | `mise.toml`, `package.json`       | Shipped | Automated React health scan and reproducible tasks                                         |
