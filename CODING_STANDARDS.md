# Coding Standards

This document records patterns currently used in this repository. Patterns based on a small number of examples are marked as such; treat them as local precedent rather than a universal rule.

## Project structure

- Add file-based routes in `src/routes`. TanStack Router generates `src/routeTree.gen.ts`; do not edit that generated file by hand.
- Put feature-specific code under `src/features/<feature>`, grouped by role such as `api` and `components`. Move code into shared `src/components`, `src/lib`, or another shared location when multiple features need it.
- Put reusable UI primitives and form components in `src/components`.
- Keep unit tests in a colocated `__tests__` directory. Keep browser tests in `tests/e2e`.
- Keep database schema definitions in `src/db/schema` and database access in server-only modules.
- Keep shared test fixtures and test wrappers in `src/testing`.

## TypeScript and naming

- Derive database row types from Drizzle schemas, for example `typeof posts.$inferSelect`.
- Derive validation input types from Zod schemas with `z.infer<typeof schema>`.
- Prefer inferred types where possible; add explicit types at public boundaries and where they clarify a contract.
- Use named exports for components and functions. Components are generally named function declarations.
- Use camelCase for TypeScript identifiers and properties. Database column names use snake_case.
- When a framework requires a naming convention that differs from the repository convention, isolate the exception and document it with a Biome ignore comment. `src/components/forms/app-form.ts` does this for TanStack Form's registered PascalCase components.

## Routes, server functions, and data loading

- Define routes with `createFileRoute(path)({...})` and export the resulting `Route`.
- The root route owns the document shell, global styles, shared navigation, toaster, and development tools. It creates the router context type with `createRootRouteWithContext`.
- Route components should delegate feature-specific UI to components under `src/features/<feature>/components`.
- Protected pages currently use `beforeLoad` to check the session and redirect guests. The `/posts` route demonstrates this pattern; other routes are static.
- Use `createServerFn` for server functions. Use `GET` for reads and `POST` for writes, as the posts feature does.
- Attach auth middleware to protected server functions. Validate mutation input with `.validator(schema)` before handling it.
- Pass the authenticated user from middleware context into server-side data functions. Derive ownership fields such as `userId` on the server rather than trusting client input.
- Keep database operations in server-side modules, separate from server-function declarations. Current data functions accept an optional database argument defaulting to `getDb()`, which allows tests to inject or mock the database.
- Reuse TanStack Query options and keys between route loaders and feature hooks. In the posts feature, route loading uses the same query options that mutations invalidate after success.
- The router creates a QueryClient per router instance, configures a global mutation error toast, enables intent preloading and scroll restoration, and installs SSR query integration.
- Current examples rely on suspense for the posts query and global mutation error handling. There is no consistent route-level pending or error component pattern yet.

## Authentication

- Keep Better Auth server setup in `src/lib/auth/auth.server.ts`, marked server-only. The current setup reads Worker environment bindings, uses the Drizzle SQLite adapter, and installs the TanStack Start cookie plugin.
- Keep client auth exports in `src/lib/auth/auth-client.ts`; the current module exposes the specific sign-in, sign-up, session, and sign-out operations used by the app.
- Use a server function to read the session from request headers. `ensureSession` throws when no session exists.
- Use function middleware to protect server functions and pass the session through function context.
- Protect page navigation separately in route `beforeLoad` when the page should redirect guests.
- Convert auth API errors into `FormSubmissionError` for form submission handling. Use a fallback message when the returned error has no message.
- Account input validation currently uses standalone Zod schemas rather than deriving them from database tables. Signup validates email, a trimmed nonempty name, and an 8–128 character password; login requires a nonempty password.

## Database and validation

- Define tables with Drizzle in `src/db/schema`. The current schema uses camelCase TypeScript properties mapped to snake_case SQL columns.
- Declare foreign keys and their deletion behavior in the schema. Current user-owned rows cascade on user deletion.
- Declare indexes in the table callback. Define Drizzle relations where application queries need them; auth relations are currently defined centrally in `src/db/schema/auth.ts`.
- Keep database initialization centralized in `src/db/db.server.ts`. It is server-only and uses the Worker D1 binding by default, while allowing an explicit binding for tests.
- Use Drizzle-generated Zod schemas where validation follows a database table. For create inputs, omit generated or server-owned fields; for narrower operations, pick only the required fields.
- Keep current schema definitions as the source of truth for the present database shape. The SQL files under `drizzle/` record incremental migration history.
- Put queries and writes in feature server modules. Scope user-owned reads and writes by the authenticated user's ID.
- Check results from `.returning()` when the operation expects a row, and throw an error when no row was returned.
- Current list queries order posts by descending ID and apply a limit. This is demonstrated by the posts feature and is not yet a repository-wide pagination convention.

## React components and styling

- Build feature UI in `src/features/<feature>/components`; keep reusable primitives in `src/components/ui`.
- UI primitives generally wrap Base UI or native elements, preserve their underlying props, add a `data-slot`, and combine styles with `cn()`.
- Derive wrapper prop types from the underlying primitive or native element using `React.ComponentProps` or the primitive's exported prop type.
- Export related compound components from one module when consumers compose them together, as with Card, Dialog, and shared form components.
- Use Tailwind utility classes in `className`. Keep shared theme tokens and global base styles in `src/styles.css`.
- Use CSS custom properties for design tokens and map them into Tailwind theme tokens. The current stylesheet defines light and dark palettes; the root document currently applies the `dark` class.
- Use class-variance-authority for components with named variants or sizes, as in Button and Field. Expose supported variants through component props and, where useful, corresponding data attributes.
- Use TanStack Router `Link` for internal navigation.

## Forms and UI state

- Use the shared TanStack Form setup through `useAppForm` for application forms.
- Define form `defaultValues`, submit handling, validation, and revalidation behavior at the feature form. Current account and post forms use Zod validators and commonly revalidate on change.
- Render fields through the form's typed field context and shared field components such as `TextField`.
- Associate labels and inputs with matching IDs. Connect validation feedback with `aria-describedby` and `aria-invalid`.
- Use the shared `Form` wrapper to handle submission and map failures into form-level feedback.
- Use `SubmitButton` to reflect invalid and submitting states. It disables submission when the form cannot submit, marks pending work with `aria-busy`, and displays pending copy.
- Give users clear feedback for empty lists and failed submissions. Current form errors appear inline; unhandled mutation errors use the router's global toast.
- Disable actions while their mutation is pending. Use suspense where the feature's data-loading pattern requires it.
- Use semantic HTML landmarks, headings, lists, and form elements. Provide accessible names for controls, including dialog close buttons and navigation controls.
- Include visible focus and invalid-state styling in reusable controls. Mark decorative icons as hidden from assistive technology.

## Testing

- Put unit tests in colocated `__tests__` directories and name them `*.spec.ts` or `*.spec.tsx`.
- Put browser tests in `tests/e2e` and name them `*.test.ts`.
- Use the configured Vitest and Playwright setups rather than creating one-off test infrastructure.
- Structure behavior tests around Arrange, Act, and Assert when it makes the test clearer. Many current tests mark these sections with comments.
- For component tests, prefer accessible queries such as roles and labels. Use `userEvent.setup()` for user interactions.
- Declare module mocks with `vi.mock` at module scope. Configure mock behavior within each test with `vi.mocked(...)`.
- Put reusable typed fixtures in `src/testing/fixtures`. Fixture factories may accept partial overrides; keep shared session and user values in the session fixture.
- Use test wrappers for router and QueryClient context when exercising hooks or routed components.
- Use deferred promises when testing pending UI behavior.
- Name Worker-specific tests `*.workers.spec.ts`; the Worker test project runs them separately.
- In E2E tests, use the shared extended Playwright `test` fixture. Its `app.goto()` helper waits for hydration.
- Use accessible role, label, and text locators in browser tests. Use the account page object for account workflows; other current E2E tests use locators inline.
- Use the `signedInAccount` fixture for authenticated browser scenarios. It signs up before the test and signs out during fixture teardown.
- E2E account data is generated per test. Current setup does not show direct database cleanup.

## Scope notes

- This file describes current repository practice, not a claim that every pattern is used by every feature.
- Route auth and query-loader integration are demonstrated by `/posts`; other routes do not currently exercise them.
- Several conventions, including compound component APIs and server-injected databases, are based on a small starter application. Revisit them as additional features establish broader patterns.
