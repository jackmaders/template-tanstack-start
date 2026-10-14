# Project Glossary

Shared terms for describing the project's code and design.

## Language

**Module**:
A unit of code with a defined responsibility and interface, such as a file, component, or class.

**Application error**:
A concrete `ApplicationError` subclass representing an expected failure with a message safe to display. Serialization adapters reconstruct its class across server functions and SSR hydration.

**Unexpected server error**:
A safe replacement for an unexpected server-function failure. The original failure is reported on the server; only a fixed generic message crosses the boundary.

**Local error claim**:
A `handleError` callback returning exactly `true` to take responsibility for presenting a failure. Absent, declining, or throwing handlers leave presentation to the generic fallback toast. Native `onError` callbacks do not claim failures. Use `errorMeta` for Query metadata so local callbacks are omitted from serialized cache snapshots.

**Client error dispatcher**:
The shared entry point for presenting client failures. It reports unexpected errors, invokes a local handler, and shows a generic toast when unclaimed. It deduplicates repeated delivery of the same rejection and emits no toasts during SSR. Query caches dispatch terminal failures automatically; direct callers must explicitly dispatch caught failures.

## CI/CD

**Composite action**:
A reusable GitHub Action that combines multiple workflow steps behind a shared set of inputs and outputs.

**PR-Agent**:
An automated reviewer that analyzes pull request changes and posts code review feedback.
