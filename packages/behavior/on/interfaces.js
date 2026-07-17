/**
 * Global registry symbol — must resolve to the same value as the
 * `connectArc` key defined in the `@echo` package, since it's called on
 * the parent element, which is built independently with `Echo`.
 */
export const connectArc = Symbol.for('connectArc')

/** Module-private key; no cross-module identity needed for this one. */
export const setter = Symbol('setter')
