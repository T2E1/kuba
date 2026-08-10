export const abort = Symbol('abort')
export const dispatch = Symbol('dispatch')

/**
 * Global registry symbol — must resolve to the same value as the
 * `setHeader` key defined in the `@headers` package, since it's called by
 * a `<kb-headers>` child, which is built independently.
 */
export const setHeader = Symbol.for('setHeader')
