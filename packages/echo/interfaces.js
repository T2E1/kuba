// Symbol.for (not Symbol()) so that every package/bundle that imports this
// module resolves to the *same* well-known symbol, even if duplicated across
// bundles — required for cross-package method lookup (e.g. `this[connectArc]`).
export const connectArc = Symbol.for('connectArc')
export const disconnectArc = Symbol.for('disconnectArc')

// Name of the observed attribute that carries the arc wiring string.
export const on = 'on'
