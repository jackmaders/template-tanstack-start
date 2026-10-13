# Coding Standards

## Naming

- **Server-only modules:** Name server-only modules `<name>.server.ts`; include `import "@tanstack/react-start/server-only"` in each module.
- **Server functions:** Name server-function definition modules `<name>.functions.ts`.
- **Default Unit tests:** Name other unit tests `__tests__/<module>.spec.ts` or `__tests__/<module>.spec.tsx`.
- **Worker Unit tests:** When unit tests require a worker environment, use `__tests__/<module>.workers.spec.ts`.
- **Browser tests:** Name browser tests `tests/e2e/<scenario>.test.ts`.
- **Query modules:** Name query key and query options modules `<entity>-queries.ts`.
- **Schema modules:** Name Zod schema modules `<entity>-schema.ts`.
- **Mutation hooks:** Name mutation hook modules `use-<verb>-<entity>.ts`.
- **SQL columns:** Use snake_case for SQL column names.
- **Framework conventions:** Use framework-required names; scope any necessary Biome suppression to the affected declaration.

## Routes

- **Route authentication:** When routes require authentication, place them under `src/routes/_authenticated`.
- **Cache preloading:** Populate the TanStack Query cache in route loaders with data needed at page load.

## Server Functions

- **Server operations:** Use `createServerFn` for client-invoked server operations; use `GET` for reads and `POST` for writes.
- **Thin handlers:** Limit server functions to validation and middleware wiring; handlers only forward input and context to an extracted server operation.
- **Authentication:** When server functions require authentication, attach auth middleware.
- **Input validation:** Validate server-function input with `.validator(schema)`.
- **Trusted identity:** Pass the authenticated user from middleware context to database functions; derive ownership fields from that user.

## Database

- **Referential integrity:** Declare foreign keys with explicit deletion behavior.
- **Indexes:** Declare indexes in the table callback.
- **Schema derivation:** Generate table-backed Zod schemas with Drizzle.
- **Client inputs:** Limit input schemas to fields the client must supply; omit generated and server-owned fields from create inputs.
- **Ownership:** Scope reads and writes of user-owned records by the authenticated user's ID.
- **Expected results:** If an operation expects a row but `.returning()` returns none, throw an error.

## Error Handling

- **Recovery:** When recovering or rethrowing with added context, use `try/catch`. Otherwise, throw errors from server operations.
- **Query errors:** When suspense queries fail, handle them with error boundaries. Use TanStack Query's `data` and `error` result state in client code.
- **Promise rejection:** When `mutateAsync` rejects, handle the failure with `try/catch`. Let `queryFn` and `mutationFn` failures reject.

## Components

- **Feature placement:** Put feature components in `src/features/<feature>/components`
- **Prop derivation:** Derive wrapper prop types from the wrapped component or native element. Use `React.ComponentProps` or the component's exported prop type.

## s4.codes

### SOLID

- **Single responsibility:** When operations change for independent reasons, separate them. Give each module one responsibility.
- **Stakeholder isolation:** When user groups have different requirements, separate their behavior. Changes for one group should leave the others’ behavior unchanged.

### Modules

- **Cohesion:** When module responsibilities need separate names joined by "and," split the module. Group operations that serve the same purpose.
- **Data ownership:** When a service repeatedly uses several fields from one module, move that behavior there.
- **Shared state:** When blocks in a long function share mutable variables, group related state and operations. Extract each group into a focused module.
- **Separation of concerns:** Separate workflow sequencing from the implementation of individual steps. Each should change independently.
- **YAGNI:** When a stated requirement needs an abstraction, add it. Until then, keep the design simple.
- **Useful extraction:** If extraction enables independent tests, removes duplication, names concepts, or isolates independently changing behavior, split the module. Otherwise, keep the module intact.

### Function Design

- **Public interface:** When exposing helpers would couple callers to changing implementation details, keep those helpers private. Expose operations callers need.
- **Intent:** Name functions for their purpose or result rather than their implementation mechanics.
- **Scope:** Give widely used variables descriptive names. Give related private helpers names that distinguish their specific operations.

### Unit Tests

- **Test-first:** When implementing new behavior, first write a failing test stating the expected result.
- **Readable setup:** Make test preconditions explicit and keep setup simple. Routine behavior changes should affect only the relevant test data and expectations.
- **Behavior:** Assert externally observable results so implementation changes that preserve behavior leave tests passing.
- **Arrange–Act–Assert:** Separate test setup, the action under test, and assertions into distinct sections.
- **Focused tests:** Test one behavior per test; split independent claims so each failure identifies the behavior that broke.
- **Determinism:** Keep unit tests fast and runnable in any order; isolate mutable state and control external inputs such as time, randomness, and network responses.

### Boundaries

- **Adapters:** Isolate vendor SDK calls behind an application-owned adapter. Keep vendor API changes inside that adapter.
- **Dependency inversion:** When concrete dependencies would couple consumers to unrelated implementation details, use dependency interfaces. Define those interfaces around the operations consumers need.

### Error Handling

- **Guard clauses:** Handle failures with early exits or separate error handling. Keep the success path readable as sequential steps without nested failure checks.
- **Failure paths:** Test expected exceptions, including the required recovery or propagation behavior.
- **Error translation:** When callers need application-owned error types, translate vendor exceptions at the adapter boundary.
- **Control flow:** Represent expected alternatives with conditions, explicit results, or default behavior; reserve exceptions for failures.
- **Absence:** When empty values preserve the API's meaning, use them to avoid repeated null checks. For example, return an empty collection. When absence is a distinct result callers need to handle, use null.

### Objects and Data

- **Encapsulation:** When getters or setters couple callers to internal storage, replace them with operations. Preserve the freedom to change how data is stored.
- **Extensibility:** Choose which extension the design supports: new types or new operations. Support adding types without changing operations, or adding operations without changing types.
- **Law of Demeter:** Ask collaborators for operations directly. Avoid chaining through objects they return; ordinary access to plain data is fine.
- **Data and behavior:** When business behavior must change independently, separate it from raw data. Callers should be able to use the data without depending on that behavior.

### Formatting

- **Top-down order:** Place the entry point before its implementation helpers. Show readers the workflow before its details.
- **Visual grouping:** When adjacent blocks express different concepts, separate them with blank lines.
- **Local scope:** Declare local variables near their first use, inside the smallest block needing them.

### Comments

- **Accuracy:** Keep comments consistent with the behavior of the code they describe.
- **Rationale:** When a business constraint's purpose is unclear from code, explain it. Include why removing it could change product behavior.
- **Warnings:** When safe use depends on understanding risks or costs, document them. Place warnings at the point of use.
- **API documentation:** Document public API behavior, inputs, outputs, and relevant side effects.
- **Redundancy:** When comments merely restate adjacent code, remove them. Keep comments that add information beyond the code.
- **Context:** Include conditions or reasons needed to interpret a comment's claim about an outcome.
- **Dead code:** Delete commented-out executable code; use version history to recover it when needed.
- **Structure:** When functions need closing-brace comments to explain their structure, simplify or extract them.
- **TODOs:** State each TODO’s required action and the condition that marks it resolved.
- **Self-documenting code:** When clear names or extracted helpers can replace comments explaining complicated mechanics, prefer them.

### Functions

- **Decomposition:** Extract focused steps from long functions. Make the main body read as a sequence of named operations.
- **Single responsibility:** When responsibilities change independently, need separate tests, or fail for unrelated reasons, separate them.
- **Abstraction level:** Keep orchestration and the implementation details of its steps in separate functions.
- **Dispatch:** When functions repeat switches on the same type, centralize dispatch. Adding a variant should not require matching case updates across multiple functions.
- **Parameters:** When positional arguments are hard to understand or test, use named parameter objects. Make argument roles and valid combinations explicit.
- **Boolean modes:** Replace boolean mode arguments with separate operations or named options. Make the selected behavior clear at the call site.
- **Named arguments:** Name unrelated argument pairs explicitly. Make each value's role clear without relying on position.
- **Side effects:** Make side effects explicit in the function's name or contract; keep checks separate from unrelated state changes.
- **Predicates:** Name condition checks so callers understand what true and false mean.
- **Error propagation:** When callers must handle failures, throw errors. When ignorable error codes require repeated nested checks, replace them.
- **DRY:** Keep each shared rule in one authoritative implementation to prevent conflicting copies.
- **Refactoring:** When completing a function, first simplify deep nesting and separate unrelated responsibilities. Keep each function at one level of detail.

### Meaningful Names

- **Meaning:** Name nontrivial variables for what their values represent where they are used.
- **Accuracy:** Match identifiers to the actual data shape or behavior; reserve names such as `list` for values that are lists.
- **Distinction:** Name related functions so callers can distinguish their behaviors without reading their implementations.
- **Pronounceability:** Use readable words and familiar abbreviations that reviewers can discuss without decoding.
- **Searchability:** When numbers have business meaning, use named constants. Give domain values descriptive names that can be found in a code search.
- **Type redundancy:** When prefixes only repeat the declared type, omit them. Use names that convey domain meaning.
- **Explicit meaning:** Name values by their role so readers can understand them without tracing assignments.
