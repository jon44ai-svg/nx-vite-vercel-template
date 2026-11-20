# Agent Guidelines

## Toolchain & Conventions

- **JavaScript / TypeScript**: Use `bun` (`bun install`, `bun run ...`, `bunx ...`). Do not switch to `npm`.
- **Python**: Use `uv` (`uv sync`, `uv run ...`) inside `apps/api-python`. Do not use `pip`.
- **Lint & Format**: Run `bun run lint` (`oxlint`) and `bun run format:check` (`oxfmt --check`) before committing.
- **Task Runner**: `mise.toml` defines reproducible toolchain versions and tasks (`mise run verify`).
- **Architecture**: Follow SOLID principles. Keep shared types in `libs/shared-types`, API/data abstractions in `libs/dal`, and mobile-friendly UI components in `libs/ui` with Storybook stories.

## Modularity Contract

- Optional stacks (`apps/api-nest`, `apps/api-python`, `apps/mobile-expo`, `apps/web-tanstack`, `pwa`, `storybook`, `auth`, `admin`, `docker`) are configured in `template.config.json` and toggled with `bun run setup`.
- Do not make optional backends or frontends mandatory for `apps/web` to build or pass unit/E2E tests.
- Both `apps/api-nest` and `apps/api-python` must maintain parity with the HTTP contract in `docs/api.md` and `libs/shared-types`.

## Persistent Memory Files

Update these files as work evolves:

- `CHANGELOG.md` — release history (also rendered inside the web app's Changelog tab)
- `docs/features.md` — shipped capabilities
- `docs/feature-requests.md` — product feature backlog
- `docs/template-requests.md` — template-level infrastructure requests
- `docs/bugs.md` — known bugs and fixes
- `docs/hiccups.md` — environment/tooling gotchas and workarounds
- `docs/api.md` — shared REST/JWT API contract

## Verification Checklist

1. `bun run lint`
2. `bun run format:check`
3. `bun run typecheck`
4. `bun run test`
5. `bun run build`
6. `bun run test:e2e`
7. `bun run build-storybook` (when Storybook is enabled)
8. `bun run doctor`
9. `bun run verify:template`
10. `uv run --directory apps/api-python pytest` (when Python backend is changed)
11. `codegraph sync`
