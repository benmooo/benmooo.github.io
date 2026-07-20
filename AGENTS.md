## 🧠 Core Philosophy

You are assisting a developer who prefers **functional programming principles**.

Always prioritize:

- Pure functions
- Immutability
- Declarative style over imperative style
- Composition over inheritance
- Simplicity and clarity over cleverness

## 1. Write Pure Functions

- Same input → same output
- No side effects
- No external state

## 2. Keep Data Immutable

- Always return new data
- Use spread / map / filter instead of mutation

## 3. Build with Composition

- Small functions
- Combine instead of nesting logic

## 4. Prefer Declarative Pipelines

- Use map / filter / reduce
- Think: data → transform → result

## 5. Pass Data Explicitly

- No hidden dependencies
- No globals

## 6. Isolate Side Effects

- Core = pure
- I/O = edges

## 7. Keep Functions Small

- One responsibility per function

## 8. Use Clear Types

- Prefer simple, explicit types

## 9. Types: Zod Schema First, TypeScript Type Second

- **Always** define your data model with a Zod schema first.
- **Infer** the TypeScript type using `z.infer<typeof YourSchema>`.
- **Export both** — the Zod schema (for runtime validation) and the inferred TS type (for compile-time type safety).

## 🧱 Architecture Rule: Functional Core, Imperative Shell

- Keep the main flow focused on intent and orchestration; name policies, thresholds, branching decisions, and side-effect details first, then move them into constants or well-named helpers.

## 🧭 Default Decision Rule

When unsure:

1. Pick the pure option
2. Pick the simpler data flow
3. Prefer composition over branching


## Project Status: EARLY STAGE

**You are an agent working on a greenfield / early-stage project.**

### Core Principle: Aggressive Evolution

This project has not launched. Stability is NOT a priority. Speed, learning, and getting the architecture right for the long term ARE priorities.

### You are encouraged to:

1.  **Question everything.** If the current architecture feels clunky, propose a change.
2.  **Refactor ruthlessly.** Do not hesitate to rename files, move modules, or restructure components.
3.  **Change the database schema without guilt.** Need to rename a column? Change a data type? Normalize or denormalize? Just do it. You do not need to write complex migrations or backward-compatibility layers.
4.  **Delete code aggressively.** If a feature is half-baked or following the wrong pattern, delete it and rebuild it better.
5.  **Break the API.** Frontend, backend, or internal service APIs can change. There are no external users depending on stability yet.

### Rules (or rather, "Anti-rules"):

- **Do NOT** spend time writing complex database migration scripts to preserve old data.. Wiping and reseeding is preferred.
- **Do NOT** worry about breaking existing tests unless they test core behavior (update or delete them as needed).
- **Do NOT** try to keep the linter 100% happy during a major refactor. Use `TODO` and `FIXME` liberally.

### What you should do instead:

- **Document changes** in an `ARCHITECTURE.md` or `CHANGELOG.md` at a high level (so the team knows what changed).
- **Flag major decisions** with a comment like `// AGGRESSIVE REFACTOR: ...` so humans understand the rationale.

Remember: **It is far worse to ship a fossilized, awkward architecture than to spend 15 minutes changing a database column today.**
