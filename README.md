# TanStack Start Template

A starter template for building web applications with TanStack Start, React, TypeScript, Tailwind CSS, shadcn/ui, and Cloudflare Workers.

## Getting started

### Prerequisites

- [Bun](https://bun.sh/) v1.4 or later
- [Node.js](https://nodejs.org/) v22.12 or later

### Initial setup

```bash
cp --update=none .env.example .env
bun install
bun run db:migrate --local
```

### Run the project

```bash
bun run dev
```

## Other useful commands

- `bun run build`: Build the project.
- `bun run validate:full`: Run the CI checks locally.
- `bun run validate:fast`: Run lint, type checks, unused code checks, and unit tests.
- `bun run db:generate`: Generate database migrations from the schema.
- `bun run db:migrate --local`: Apply database migrations to the local database shared by development and preview servers.
- `bun run cf:generate`: Generate TypeScript definitions for the Cloudflare environment.
- `bun run cf:preview`: Preview the production build locally with Wrangler. Requires a successful build first.
- `bun run test`: Run the test suite.
- `bun run test:e2e`: Build and preview locally, then run the end-to-end tests in Chromium, Firefox, and WebKit.
- `bun run test:perf`: Run the Lighthouse tests.
- `bun run lint:fix`: Apply code formatting and lint rules.

> [!TIP]
> Running `bun run test:perf` in WSL will likely hit an issue with Lighthouse attempting, and failing, to use the windows Chrome install.
> To force the Linux chrome (installed with Playwright above), run the below command to populate the relevant `.env` variable.
>
> ```
> cp --update=none .env.example .env
> CHROME_PATH="$(node -p 'require("@playwright/test").chromium.executablePath()')"
> sed -i "s|^# CHROME_PATH=.*|CHROME_PATH=\"$CHROME_PATH\"|" .env
> ```
