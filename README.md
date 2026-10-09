# TanStack Start Template

A TanStack Start application template using React, TypeScript, Tailwind CSS, shadcn/ui, and Cloudflare Workers.

## Getting started

```bash
bun install
bun run dev
```

Useful commands:

```bash
bun run build       # Build for Cloudflare Workers
bun run validate    # Build, lint, type check, unused code check, and unit tests
bun run test:e2e    # Run browser tests
```

## Architecture

This repository includes the [Bulletproof React Patterns skill](.agents/skills/bulletproof-react-patterns/SKILL.md) as the general guide for feature boundaries, shared code, imports, and React architecture. Its framework-neutral structure is adapted to TanStack Start here:

```text
src/
├── client.tsx       # TanStack Start client entry point
├── router.tsx       # Shared router configuration
├── routeTree.gen.ts # Generated route tree
├── styles.css       # Global styles
├── assets/          # Assets imported and processed by the app
├── components/      # Shared components; shadcn/ui components live in ui/
├── config/          # Runtime app configuration and environment parsing
├── features/        # Domain-specific modules
├── hooks/           # Hooks shared across features
├── lib/             # Preconfigured integrations and shared library wrappers
├── routes/          # TanStack file routes and app-level composition
├── stores/          # State shared across features
├── testing/         # Shared test utilities, fixtures, and mocks
├── types/           # Types shared across features
└── utils/           # Small, framework-independent shared helpers
```

TanStack Start splits its application layer across the client entry point, router configuration, and file routes. Route files are the source for the generated route tree. See [AGENTS.md](./AGENTS.md) for conventions on route data, generated files, shared UI, and the existing toolchain.

Put URL-served static files in root `public/`, and imported assets in `src/assets/`.

Tool configuration lives in root `.config/`. Unit tests live in `__tests__` folders; reusable fixtures and test helpers belong in `src/testing`. Browser tests live in root `browser-tests/`.
