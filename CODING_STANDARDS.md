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
- Populate the TanStack Query cache in route loaders with data needed at page load.

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
- Derive wrapper prop types from the wrapped component or native element. Use `React.ComponentProps` or the component's exported prop type.

<!-- s4.codes start -->

## SOLID

- **Single responsibility:** Give each module one responsibility; separate operations that change for independent reasons.
- **Stakeholder isolation:** Separate behavior for user groups with different requirements. Changes for one group should leave the others’ behavior unchanged.

## Modules

- **Cohesion:** Group operations that serve the same purpose; split a module when its responsibilities need separate names joined by "and."
- **Data ownership:** When a service repeatedly uses several fields from one module, move that behavior there.
- **Shared state:** Group related state and operations when blocks in a long function share mutable variables. Extract each group into a focused module.
- **Separation of concerns:** Separate workflow sequencing from the implementation of individual steps. Each should change independently.
- **YAGNI:** Add abstractions for a stated requirement that needs them; keep the design simple until that requirement exists.
- **Useful extraction:** Extract modules only to enable independent testing, remove duplication, or name concepts. Isolating independently changing behavior also justifies extraction.

## Function Design

- **Public interface:** Expose operations callers need. Keep helpers private when exposing them would couple callers to changing implementation details.
- **Intent:** Name functions for their purpose or result rather than their implementation mechanics.
- **Scope:** Give widely used variables descriptive names. Give related private helpers names that distinguish their specific operations.

## Unit Tests

- **Test-first:** Write a failing test that states the expected result before implementing new behavior.
- **Readable setup:** Make test preconditions explicit and keep setup simple. Routine behavior changes should affect only the relevant test data and expectations.
- **Behavior:** Assert externally observable results so implementation changes that preserve behavior leave tests passing.
- **Arrange–Act–Assert:** Separate test setup, the action under test, and assertions into distinct sections.
- **Focused tests:** Test one behavior per test; split independent claims so each failure identifies the behavior that broke.
- **Determinism:** Keep unit tests fast and runnable in any order; isolate mutable state and control external inputs such as time, randomness, and network responses.

## Boundaries

- **Adapters:** Isolate vendor SDK calls behind an application-owned adapter. Keep vendor API changes inside that adapter.
- **Dependency inversion:** Define dependency interfaces around the operations consumers need. Use them when concrete dependencies would couple consumers to unrelated implementation details.

## Error Handling

- **Guard clauses:** Handle failures with early exits or separate error handling. Keep the success path readable as sequential steps without nested failure checks.
- **Failure paths:** Test expected exceptions, including the required recovery or propagation behavior.
- **Error translation:** Translate vendor exceptions at the adapter boundary when callers need application-owned error types.
- **Control flow:** Represent expected alternatives with conditions, explicit results, or default behavior; reserve exceptions for failures.
- **Absence:** Use empty values only when they preserve the API's meaning. For example, return an empty collection to avoid repeated null checks. Use null when absence is a distinct result callers need to handle.

## Objects and Data

- **Encapsulation:** Expose operations that preserve the freedom to change internal storage; replace getters and setters that make callers depend on how fields are stored.
- **Extensibility:** Choose which extension the design supports: new types or new operations. Support adding types without changing operations, or adding operations without changing types.
- **Law of Demeter:** Ask collaborators for operations directly. Avoid chaining through objects they return; ordinary access to plain data is fine.
- **Data and behavior:** Separate raw data from business behavior that must change independently. Callers should be able to use the data without depending on that behavior.

## Formatting

- **Top-down order:** Place the entry point before its implementation helpers. Show readers the workflow before its details.
- **Visual grouping:** Separate adjacent blocks that express different concepts with blank lines.
- **Local scope:** Declare local variables near their first use, inside the smallest block needing them.

## Comments

- **Accuracy:** Keep comments consistent with the behavior of the code they describe.
- **Rationale:** Explain business constraints whose purpose is unclear from the code. Include why removing them could change product behavior.
- **Warnings:** Document risks or costs callers must understand to use the code safely. Place warnings at the point of use.
- **API documentation:** Document public API behavior, inputs, outputs, and relevant side effects.
- **Redundancy:** Keep comments that add information beyond the adjacent code; remove comments that merely restate it.
- **Context:** Include conditions or reasons needed to interpret a comment's claim about an outcome.
- **Dead code:** Delete commented-out executable code; use version history to recover it when needed.
- **Structure:** Simplify or extract functions that need closing-brace comments to explain their structure.
- **TODOs:** State each TODO’s required action and the condition that marks it resolved.
- **Self-documenting code:** Prefer clear names or extracted helpers when they can replace comments explaining complicated mechanics.

## Functions

- **Decomposition:** Extract focused steps from long functions. Make the main body read as a sequence of named operations.
- **Single responsibility:** Separate responsibilities that change independently, need separate tests, or fail for unrelated reasons.
- **Abstraction level:** Keep orchestration and the implementation details of its steps in separate functions.
- **Dispatch:** Centralize repeated switches on the same type. Adding a variant should not require matching case updates across multiple functions.
- **Parameters:** Use named parameter objects when positional arguments are hard to understand or test. Make argument roles and valid combinations explicit.
- **Boolean modes:** Replace boolean mode arguments with separate operations or named options. Make the selected behavior clear at the call site.
- **Named arguments:** Name unrelated argument pairs explicitly. Make each value's role clear without relying on position.
- **Side effects:** Make side effects explicit in the function's name or contract; keep checks separate from unrelated state changes.
- **Predicates:** Name condition checks so callers understand what true and false mean.
- **Error propagation:** Throw errors for failures callers must handle. Replace ignorable error codes that require repeated nested checks.
- **DRY:** Keep each shared rule in one authoritative implementation to prevent conflicting copies.
- **Refactoring:** Simplify deep nesting and separate unrelated responsibilities before completing a function. Keep each function at one level of detail.

## Meaningful Names

- **Meaning:** Name nontrivial variables for what their values represent where they are used.
- **Accuracy:** Match identifiers to the actual data shape or behavior; reserve names such as `list` for values that are lists.
- **Distinction:** Name related functions so callers can distinguish their behaviors without reading their implementations.
- **Pronounceability:** Use readable words and familiar abbreviations that reviewers can discuss without decoding.
- **Searchability:** Give domain values descriptive names that can be found in a code search; use named constants for numbers with business meaning.
- **Type redundancy:** Use names that convey domain meaning; omit prefixes that only repeat the declared type.
- **Explicit meaning:** Name values by their role so readers can understand them without tracing assignments.
