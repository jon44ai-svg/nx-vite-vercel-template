# Nx + Vite + Vercel SPA Template

A clean, modern monorepo template utilizing **Nx** for task orchestration, **Vite** for local development and build pipelines, and **Vercel** for hosting.

## Features

- 🏎️ **Vite**: Ultra-fast hot module replacement (HMR) and optimized rollup production bundles.
- 📦 **Nx**: Workspace modularity. Allows you to scale with additional apps or shared libs seamlessly.
- ⚡ **Bun**: Default runtime and package manager.
- 🚀 **Vercel Routing**: Built-in `vercel.json` with rewrites pre-configured to ensure React Router / SPA client-side routes work perfectly on production.

## Project Structure

```
├── apps/
│   └── web/
│       ├── src/
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── index.html
│       ├── project.json       # Nx project configuration
│       ├── tsconfig.json
│       └── vite.config.ts     # Vite configuration
├── nx.json                    # Nx workspace configuration
├── package.json               # Dependencies and scripts
├── tsconfig.base.json         # Shared TypeScript options
└── vercel.json                # Vercel deployment configuration
```

## Getting Started

### 1. Install Dependencies
```bash
bun install
```

### 2. Start Local Dev Server
```bash
bun run dev
```
Open [http://localhost:4200](http://localhost:4200) in your browser.

### 3. Build for Production
```bash
bun run build
```

This builds the bundle inside the `dist/apps/web/` directory.

### 4. Deploy to Vercel

Simply link this project to Vercel. The `vercel.json` configuration will automatically tell Vercel to:
- Run `bun install` for package installation
- Run `bun run build` for building the project
- Deploy from the output directory `dist/apps/web`
- Route all requests through `index.html` to support client-side SPAs.
