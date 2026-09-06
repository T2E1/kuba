// The two values of `flex-direction` that `kb-inset` exposes. Interpolated
// directly into `flex-direction` in `style.js` (not routed through a custom
// property), so the closed set is what keeps an unknown value from injecting
// CSS.
export const DIRECTIONS = Object.freeze({
  ROW: 'row',
  COLUMN: 'column',
})
