# Mission: End-to-end type-safe Quiz SDK

## Why
Build a TypeScript SDK for a quiz HTTP API. A consumer should provide options such as category, question count, and difficulty, then receive validated, precisely typed questions without duplicating the API contract.

## Success looks like
- Design a small quiz API contract with typed inputs, outputs, and errors.
- Derive static TypeScript types from runtime-validatable schemas instead of maintaining duplicate definitions.
- Preserve the contract across the server, JSON boundary, SDK, and consuming application.
- Prove with tests that invalid input, malformed responses, and breaking contract changes are caught.
- Build a publish-ready npm package with a clean public API and generated declarations.

## Constraints
- Use TypeScript and an HTTP JSON API.
- Learn through small, working slices rather than building the entire system at once.
- Keep the quiz domain small enough that package and type-system design remain the focus.

## Out of scope
- A quiz frontend, authentication, billing, and production-scale question management.
- SDKs for languages other than TypeScript.
