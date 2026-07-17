// Symbol.for gives consumers a stable, shared identity for these lifecycle
// hook keys regardless of which bundle defines them (not yet wired into
// Host in echo.js — reserved for hosts/mixins that opt in explicitly).
export const echoConnectedCallback = Symbol.for('echoConnectedCallback')
export const echoDisconnectedCallback = Symbol.for('echoDisconnectedCallback')
