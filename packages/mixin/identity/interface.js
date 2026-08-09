// Symbol.for (global registry) so the element declaring its role and the
// mixin reading it resolve to the same key even when bundled separately —
// the contract shape `connectArc` and `setHeader` already use.
export const role = Symbol.for('role')

/** Method key for the `@connected` hook that publishes the role on `internals` (see `identity.ts`). */
export const identifiable = Symbol('identifiable')
