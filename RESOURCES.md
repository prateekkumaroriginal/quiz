# Type-safe Quiz SDK resources

## Knowledge

- [ArkType: Your First Type](https://arktype.io/docs/intro/your-first-type)
  Primary reference for defining schemas, extracting inferred TypeScript types, composing schemas, and validating unknown data.
- [ArkType: Setup](https://arktype.io/docs/intro/setup)
  Primary reference for required TypeScript, ESM, and compiler settings. Use when configuring the workspace.
- [ArkType: Integrations](https://arktype.io/docs/integrations)
  Primary reference for Standard Schema, JSON Schema, Hono, oRPC, and other contract-layer integrations.
- [ArkType: Configuration](https://arktype.io/docs/configuration)
  Primary reference for validation errors, undeclared object keys, exact optional properties, and JSON Schema conversion.
- [ArkType source repository](https://github.com/arktypeio/arktype)
  Canonical source and issue tracker. Use to verify current behavior, releases, and unresolved limitations.
- [TypeScript: TypeScript for the New Programmer](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch)
  Primary reference for type erasure and TypeScript's lack of runtime behavior. Use when deciding where schemas are required.
- [ArkType: Adding Constraints](https://arktype.io/docs/intro/adding-constraints)
  Primary reference for numeric ranges, integer constraints, and custom narrowing. Use when refining quiz inputs beyond basic TypeScript types.
- [pnpm workspaces](https://pnpm.io/workspaces)
  Primary reference for linking the contract, server, and SDK packages from one repository and publishing workspace dependencies safely.
- [Vitest: Getting Started](https://vitest.dev/guide/)
  Primary reference for executable TypeScript tests and the `vitest run` workflow used by the course project.
- [Hono: Request API](https://hono.dev/docs/api/request)
  Primary reference for parsing JSON and reading other request inputs in a Hono handler.
- [Hono: Testing](https://hono.dev/docs/guides/testing)
  Primary reference for exercising Hono routes with Request and Response objects through `app.request()`.
- [Hono: Validation](https://hono.dev/docs/guides/validation)
  Primary reference for where validation belongs in Hono and how content types affect validated inputs.
- [MDN: Response.json()](https://developer.mozilla.org/en-US/docs/Web/API/Response/json)
  Reference for the Fetch response parser. Its result can be any JSON-representable JavaScript value, so the SDK must validate it before returning data.
- [MDN: Response.ok](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok)
  Reference for distinguishing successful HTTP statuses from error statuses before validating the corresponding response contract.

## Wisdom (Communities)

- [ArkType GitHub Discussions](https://github.com/arktypeio/arktype/discussions)
  Maintainer and user discussions. Use for design questions and behavior not settled by the documentation.

## Gaps

- Official sources for package build tooling, package exports, and type-level contract tests will be selected when those lessons begin.
