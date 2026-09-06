// The three steps of `packages/pixel/tokens/fontWeight.css`.
// `weight` resolves to `--font-weight-{value}`, so the closed set is what
// keeps an unknown value from reaching the custom property and injecting CSS.
export const WEIGHTS = Object.freeze({
  REGULAR: 'regular',
  MEDIUM: 'medium',
  BOLD: 'bold',
})
