/**
 * Global registry symbol — must resolve to the same value as the
 * `setHeader` key defined in the `@fetch` package, since it's called on
 * the parent element, which is built independently.
 */
export const setHeader = Symbol.for('setHeader')

/** Module-private key; no cross-module identity needed for this one. */
export const setter = Symbol('setter')
