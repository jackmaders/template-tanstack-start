# Project guidance

## Configuration

Do not edit configuration, dependency, or workflow files without explicit permission. If a task requires changes to these files, present the diff and wait for the user to approve the exact proposed change. This includes, but is not limited to, `biome.json`, `package.json`, `bun.lock`, `.config/*`, and `.github/workflows/*`.

## Documentation

Do not edit the top-level documentation files without explicit permission. If you believe an edit to these files would be beneficial, present the diff and wait for the user to approve the exact proposed change. This includes, but is not limited to, `.env.example`, `AGENTS.md`, `CODING_STANDARDS.md`, and `README.md`. When a undocumented term or concept is introduced to the codebase, add a new entry to `docs/GLOSSARY.md`.

## Skills

- For implementation or refactoring work, read [Bulletproof React Patterns](.agents/skills/bulletproof-react-patterns/SKILL.md).
- If changing authentication, read [Better Auth](.agents/skills/better-auth-best-practices/SKILL.md).
- If changing database schemas, read [Database Schema Designer](.agents/skills/database-schema-designer/SKILL.md).
- If changing shadcn components, read [shadcn](.agents/skills/shadcn/SKILL.md).
- If changing browser tests, read [Playwright](.agents/skills/playwright-best-practices/SKILL.md).
- If changing Cloudflare Worker code, read [Workers](.agents/skills/workers-best-practices/SKILL.md).
- If changing Wrangler commands or configuration, read [Wrangler](.agents/skills/wrangler/SKILL.md).

## Conventions

- Derive database types from Drizzle schemas and validation types from Zod schemas. Let TypeScript infer types wherever possible.
- Add file routes in `src/routes`; TanStack Router generates `src/routeTree.gen.ts`.
- Default to putting feature-specific code in `src/features/<feature>` and move to a shared module when another feature needs it.
- Keep unit tests in colocated `__tests__` folders and follow the existing patterns. Review at least two existing test suites before adding a new file.
- All browser test code belong in `tests/e2e`.
