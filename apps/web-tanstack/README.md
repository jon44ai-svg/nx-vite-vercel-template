# Optional TanStack Start Frontend

This is an opt-in TanStack Start SSR starter independent from the default Vite SPA in `apps/web`.

## Enable via Startup CLI

```bash
bun run setup --enable=tanstackStart
bun install
bun run dev:tanstack
```

Or run directly:

```bash
bun install --cwd apps/web-tanstack
bun run --cwd apps/web-tanstack dev
```
