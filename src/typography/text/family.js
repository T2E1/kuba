// The two font families of `packages/pixel/tokens/fontFamily.css`.
// `family` resolves to `--font-family-{value}`, so the closed set is what
// keeps an unknown value from reaching the custom property and injecting CSS.
export const FAMILIES = Object.freeze({
  BASE: 'base',
  HIGHLIGHT: 'highlight',
})
