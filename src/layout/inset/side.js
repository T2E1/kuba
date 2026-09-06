// The edge keywords `kb-inset` accepts. Each one keys the `margin` and
// `borderRadius` maps in `style.js`; a value outside this set never reaches
// the setter, so the property keeps its last valid value (`all` until one is
// set) instead of falling through the map lookup.
export const SIDES = Object.freeze({
  ALL: 'all',
  TOP: 'top',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right',
  X: 'x',
  Y: 'y',
})
