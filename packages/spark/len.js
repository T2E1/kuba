// Counts own enumerable keys; null/undefined is treated as an empty object (length 0).
export const len = (x) => Object.keys(x ?? {})?.length
