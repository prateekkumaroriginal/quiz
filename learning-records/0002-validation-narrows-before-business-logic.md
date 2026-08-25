# Validation narrows before business logic

The learner identified that the server may use request fields only after the `input instanceof type.errors` guard has returned on the error path. Future lessons can rely on their understanding that ArkType runtime validation and TypeScript control-flow narrowing meet at this boundary.

## Evidence

When asked for the earliest safe use of `input.count`, the learner correctly located it after the ArkType error guard.
