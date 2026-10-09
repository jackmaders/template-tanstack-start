# Project-specific architecture notes

For feature structure, component patterns, state and API boundaries, error handling, or React testing strategy, follow the [Bulletproof React Patterns skill](.agents/skills/bulletproof-react-patterns/SKILL.md).

## TanStack Start

- Keep file routes in `src/routes`, router configuration in `src/router.tsx`, and the client entry point in `src/client.tsx`.
- Treat `src/routeTree.gen.ts` as generated output; let TanStack regenerate it after route changes.
- Use TanStack Router/Start loaders and server functions for route data and server behavior.

## Existing stack

- Use dependencies already listed in `package.json`; add a library when a feature requires it.
- Keep shadcn/ui components in `src/components/ui`. Keep the `cn` helper at `src/lib/utils.ts`, which is the path configured in `components.json`.
- Use the configured package scripts and follow the existing Biome, Vitest, and Playwright setup for quality checks and tests.
