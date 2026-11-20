# Environment & Tooling Hiccups

Document operational gotchas so future runs skip trial-and-error.

1. **Puppeteer headless Chrome in Linux/WSL sandboxes**: Full Chrome requires Crashpad `--database` under restricted sandboxes. Using `headless: 'shell'` with `bunx puppeteer browsers install chrome-headless-shell` avoids Crashpad failures.
2. **Nx cache directory ownership in sandboxed `/tmp`**: Nx 24 refuses `/tmp` cache dirs owned by `uid 65534` unless `NX_ALLOW_INSECURE_DIRECTORIES=true` and `NX_DAEMON=false` are set. Root web scripts invoke `vite`, `vitest`, `oxlint`, `oxfmt`, and `tsc` directly for reliable execution in both sandboxed and local environments.
3. **Python 3.13/3.14 password hashing**: Avoid `passlib` (breaks on modern Python due to removed stdlib `crypt`). `apps/api-python` uses `bcrypt` and `pyjwt` directly.
4. **Transitive audit advisories**: `workbox-build` (pulled in by `vite-plugin-pwa`) pins `glob@^11.0.1`. Keep optional stacks (`apps/mobile-expo`, `apps/api-nest`, `apps/web-tanstack`) out of root `workspaces` until enabled by `bun run setup` so unused stacks do not add audit surface to web-only installs.
5. **Mise tracked-configs warning in read-only home sandboxes**: Sandboxed shells may print a benign `mise WARN tracking config ... Permission denied` when `$HOME/.local/state/mise` is read-only. Commands still exit normally.
