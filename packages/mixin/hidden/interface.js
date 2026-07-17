/** Method key for the `@before` hook that strips the `hidden` attribute when the value turns `false` (see `hidden.ts`). */
export const cleanup = Symbol('cleanup')
/** Method key for the `@around` hook that reflects `hidden` state onto `internals.states` (see `hidden.ts`). */
export const hideable = Symbol('hideable')
