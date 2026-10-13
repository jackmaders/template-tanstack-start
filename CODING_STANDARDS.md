# Coding Standards

## Naming

- Name server-only modules `<name>.server.ts`; include `import "@tanstack/react-start/server-only"` in each module.
- Name server-function definition modules `<name>.functions.ts`.
- Name unit tests `__tests__/<module>.spec.ts` or `__tests__/<module>.spec.tsx`; use `<module>.workers.spec.ts` for tests which require a worker environment.
- Name browser tests `tests/e2e/<scenario>.test.ts`.
- Name query key and query options modules `<entity>-queries.ts`.
- Name Zod schema modules `<entity>-schema.ts`.
- Name mutation hook modules `use-<verb>-<entity>.ts`.
- Use snake_case for SQL column names.
- Use framework-required names; scope any necessary Biome suppression to the affected declaration.

## Routes

- Place routes that require authentication under `src/routes/_authenticated`.
- Populate the TanStack Query cache in route loaders for data required when the page loads.

## Server Functions

- Use `createServerFn` for client-invoked server operations; use `GET` for reads and `POST` for writes.
- Limit server functions to validation and middleware wiring; handlers only forward input and context to an extracted server operation.
- Attach auth middleware to server functions that require authentication.
- Validate server-function input with `.validator(schema)`.
- Pass the authenticated user from middleware context to database functions; derive ownership fields from that user.

## Database

- Declare foreign keys with explicit deletion behavior.
- Declare indexes in the table callback.
- Generate table-backed Zod schemas with Drizzle.
- Limit input schemas to fields the client must supply; omit generated and server-owned fields from create inputs.
- Scope reads and writes of user-owned records by the authenticated user's ID.
- Throw an error when `.returning()` produces no row for an operation that expects one.

## Error Handling

- Throw errors from server operations; use `try/catch` only for recovery or rethrowing with added context.
- Use TanStack Query's `data` and `error` result state in client code; handle suspense query failures with error boundaries.
- Let `queryFn` and `mutationFn` failures reject; handle rejected `mutateAsync` calls with `try/catch`.

## Components

- Put feature components in `src/features/<feature>/components`
- Derive wrapper prop types from the wrapped component or native element using `React.ComponentProps` or the component's exported prop type.

<!-- s4.codes start -->

## Solid

- Flag classes whose methods serve distinct responsibilities that can change independently.
- Flag classes serving groups with different change requests when a change for one group can alter behavior expected by another.

## Classes

- Flag classes whose methods perform unrelated jobs, especially when describing the class requires joining responsibilities with and.
- Flag service methods that accept several fields from one domain object and perform behavior that belongs with that object.
- Flag long functions whose blocks share local state but lack cohesive method or class boundaries around that state.
- Flag modules that mix workflow policy with low-level implementation details, forcing unrelated changes into one file.
- Flag abstractions built for speculative requirements instead of a stated change that requires the flexibility.
- Flag class splits that add no independent test seam, remove no duplication, name no concept, and isolate no changing behavior.

## Function Design

- Flag modules that expose low-level helpers when callers should depend only on stable, high-level operations.
- Flag function names that describe implementation mechanics instead of the purpose or outcome of the function.
- Flag broad-scope variables with generic names and narrow helpers whose names fail to distinguish their specific operations.

## Unit Tests

- Flag new behavior without a failing test that states the expected result before the implementation is considered complete.
- Flag tests with brittle or opaque setup that makes routine feature changes require tangled edits or encourages skipping tests.
- Flag tests that assert implementation details instead of externally observable behavior, preventing safe implementation changes.
- Flag tests where setup, action, and assertion are not clearly separated.
- Flag one test that verifies multiple independent behaviors whose failures should be diagnosed separately.
- Flag unit tests that are slow, order-dependent, share mutable state, or rely on an uncontrolled environment.

## Boundaries

- Flag vendor SDK calls scattered through application logic instead of isolated behind an application-owned adapter.
- Flag consumers coupled to a concrete dependency when a consumer-defined interface could express the behavior they need.

## Error Handling

- Flag normal success logic buried inside nested failure branches so the operation cannot be read as one clear algorithm.
- Flag failure-sensitive operations without a test for the expected exception path and its recovery behavior.
- Flag application code that catches vendor-specific exceptions directly when it needs one application-owned error contract.
- Flag exceptions used to select an expected, ordinary branch that could be represented as an explicit condition or result.
- Flag APIs that use null for ordinary absence and force repeated null checks throughout their callers.

## Objects and Data

- Flag public getters and setters that expose storage representation and make callers depend on internal field layout.
- Flag designs where adding a type requires editing every behavior handler, or adding behavior requires editing every type, without a deliberate extension axis.
- Flag method chains that navigate through objects returned by collaborators and couple logic to their internal object structure.
- Flag classes that expose raw state while also owning behavior that must vary independently, coupling callers to both representation and policy.

## Formatting

- Flag modules where low-level helpers precede and obscure the high-level workflow described by the entry point.
- Flag adjacent blocks for distinct concepts that lack blank-line separation and are difficult to scan.
- Flag variables declared well before their first use when the extra scope makes readers retain irrelevant state.

## Comments

- Flag comments that contradict the code behavior they describe.
- Flag nonobvious business constraints whose rationale is absent from code and whose removal could change product behavior.
- Flag risky, costly, or surprising code paths whose safe use depends on a warning that is missing at the use site.
- Flag public APIs without documentation of their behavior, inputs, outputs, and relevant side effects.
- Flag comments that only restate what adjacent code already says.
- Flag comments that name an outcome but omit the condition or rationale needed to interpret it.
- Flag commented-out executable code retained in source instead of deleted or recovered from version history.
- Flag oversized or deeply nested functions that need closing-brace comments to make their structure navigable.
- Flag TODO comments without a specific action and enough context to know when they are resolved.
- Flag complicated code whose comments paraphrase implementation where a clear name or extracted helper could express intent.

## Functions

- Flag functions that combine multiple operations into a long, hard-to-follow body instead of delegating focused steps.
- Flag functions with independently changeable responsibilities that require separate tests or can fail for unrelated reasons.
- Flag functions that mix high-level orchestration with low-level implementation details.
- Flag repeated switches on the same type across functions when each copy must change for every new type variant.
- Flag calls with several independent positional arguments whose order or combinations are difficult to understand and test.
- Flag boolean mode arguments whose call sites do not reveal which behavior true or false selects.
- Flag calls that pass unrelated values as anonymous positional pairs that callers can swap or misorder.
- Flag functions whose side effects exceed the behavior promised by their names.
- Flag methods whose names and return values leave callers unable to tell what condition was checked.
- Flag functions that return ignorable error codes and force callers to repeat nested failure checks.
- Flag repeated logic that encodes the same rule in multiple places and can diverge when changed.
- Flag functions left with deep nesting, mixed responsibilities, or inconsistent abstraction levels after implementation.

## Meaningful Names

- Flag nontrivial variables whose names do not reveal what their values represent at the point of use.
- Flag identifiers that describe the wrong data shape or behavior, such as a variable named list that holds a map.
- Flag sibling functions whose names do not distinguish the behaviors callers must choose between.
- Flag cryptic identifiers that reviewers must translate before they can discuss the code.
- Flag meaningful domain values encoded only as single letters or raw numbers when a descriptive, searchable name would clarify them.
- Flag type prefixes that repeat type information already available from the declaration and add no domain meaning.
- Flag identifiers whose meaning requires tracing assignments through surrounding code instead of reading the name.
