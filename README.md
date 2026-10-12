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
bun run test:perf   # Run Lighthouse CI
```

On native Linux, Lighthouse may need to be pointed at Playwright's Chromium. Install the browser if needed, then resolve its executable path automatically for the run:

```bash
export CHROME_PATH="$(node -p 'require("@playwright/test").chromium.executablePath()')"
```

On WSL, the LHCI config sets a Linux temporary profile path through `collect.settings.chromeFlags`. This lets Lighthouse continue using the Linux browser selected by `CHROME_PATH`.

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

Posts form a shared board: reading is public, while creating and deleting posts require a server-verified session. Any signed-in user can delete any post; there is no per-user ownership policy.

Tool configuration lives in root `.config/`. Unit tests live in `__tests__` folders; reusable fixtures and test helpers belong in `src/testing`. Browser tests live in root `browser-tests/`.

Biome's `noRestrictedImports` rules enforce the import direction:

- Shared modules (including `src/db`) cannot import features or application composition.
- Features cannot import routes, the router, the client entry point, or the generated route tree.
- Use `@/` for parent-directory imports. Same-directory `./` imports remain allowed.

These rules apply automatically to new features and shared modules without feature-specific configuration. Features should not import other features; compose them in routes or extract shared code instead. This cross-feature convention is not enforced by `noRestrictedImports`, which matches import strings and cannot compare the source and destination feature names.

## Test structure

Biome's `require-test-aaa` plugin requires separate `// Act` and `// Assert` comments in each inline `test` or `it` callback. `// Arrange` is optional; when included, it must come first. Combined `// Act/Assert` sections are rejected. This applies to unit tests and browser tests, including parameterized tests and test modifiers.

Keep the operation under test in Act and check its result in Assert. For promise rejections, capture the promise in Act and use `await expect(result).rejects` in Assert. The rule checks comment structure; reviewing whether each section contains the right behavior remains necessary.

## CI/CD

GitHub Actions runs quality checks on pull requests, pushes to `main`, and manual dispatches. The pipeline checks formatting, types, unused production code, unit and Worker integration tests with 100% coverage, generated Cloudflare types and database migrations, the production build, and a Wrangler deployment dry run. It also validates workflow syntax with actionlint and enforces conventional commit messages and whitespace checks for PR commits. It also runs Chromium, Firefox, and WebKit tests against the built Worker and audits it with Lighthouse. Build artifacts, coverage reports, and failure reports are uploaded to the workflow run. Lighthouse collects three runs and uses the configured pessimistic score aggregation: performance must score at least 0.90, while accessibility, best practices, and SEO must score 1.0. The independent quality checks all run even when another fails. Configure branch protection to require the final **PR Checks** status; it fails when any required job fails or is skipped. Pull requests may add at most one SQL migration.

Production deployment follows the reference template's manual release flow: run **Deploy Production** from the Actions tab on `main`. It applies remote D1 migrations, deploys the Worker, then runs browser tests and Lighthouse against the production URL. Post-deployment check failures do not roll back the release.

Before deploying:

1. Replace `YOUR_D1_DATABASE_ID` and configure the Worker name, database name, and `BETTER_AUTH_URL` in `.config/wrangler.json`.
2. Create a GitHub environment named `production`. Add `CLOUDFLARE_API_TOKEN` (with Worker deployment and D1 migration access) and `CLOUDFLARE_ACCOUNT_ID` as environment secrets.
3. Set the `production` environment variable `PRODUCTION_URL` to the full HTTPS application URL. Match it to `BETTER_AUTH_URL`.
4. Configure the Worker's `BETTER_AUTH_SECRET` in Cloudflare before the first release.

CI uses a local-only authentication secret and local D1 databases; it does not need Cloudflare credentials. Automatic deployment on pushes to `main` is commented out in `.github/workflows/deploy.yml`, matching the reference template.

### Test workflows locally

Install [act](https://nektosact.com/installation/) and start Docker, then run the non-deploying PR workflow with its local artifact server enabled:

```bash
act push -W .github/workflows/pull-request-checks.yml \
  --artifact-server-path /tmp/template-ci-artifacts
```

To include the PR commit and migration-count checks, provide an event payload with the base and head SHAs (requires `jq`):

```bash
jq -n \
  --arg base "$(git merge-base origin/main HEAD)" \
  --arg head "$(git rev-parse HEAD)" \
  '{pull_request: {number: 1, base: {ref: "main", sha: $base}, head: {ref: "act-ci", sha: $head}}}' \
  > /tmp/template-ci-pr.json
act pull_request -W .github/workflows/pull-request-checks.yml \
  --eventpath /tmp/template-ci-pr.json \
  --artifact-server-path /tmp/template-ci-artifacts
```

The artifact server is necessary because browser and Lighthouse jobs download the build from the build job. Use a clean checkout when verifying dependency completeness. For an existing Linux host with Bun, Node, Git, `jq`, and browser system dependencies installed, act also supports `-P ubuntu-latest=-self-hosted`; this executes directly on the host. Select one browser at a time with `--matrix browser:chromium` (then `firefox` and `webkit`) to avoid local preview port collisions. Add `--env PLAYWRIGHT_SKIP_SYSTEM_DEPS=true` only when browser system dependencies are already installed; GitHub runners install them by default. Use `--no-cache-server` if you do not want act to archive the host caches. Cache behavior and GitHub environment protections still need verification on GitHub Actions.


Action releases were checked against GitHub's live release API on 2026-10-12. All workflow and composite-action references use exact release tags: [checkout v7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1), [cache v6.1.0](https://github.com/actions/cache/releases/tag/v6.1.0), [upload-artifact v7.0.2](https://github.com/actions/upload-artifact/releases/tag/v7.0.2), [download-artifact v8.0.2](https://github.com/actions/download-artifact/releases/tag/v8.0.2), and [setup-bun v2.2.0](https://github.com/oven-sh/setup-bun/releases/tag/v2.2.0).

The full workflow was previously exercised with act using older artifact actions. act 0.2.89's local artifact server rejected the `mime_type` metadata sent by upload-artifact v7 during testing. The updated artifact actions require another full run on GitHub Actions; local checks without artifacts can still be run with `act pull_request -j code-quality -W .github/workflows/pull-request-checks.yml`. The earlier local artifact results do not verify these newer action versions.
