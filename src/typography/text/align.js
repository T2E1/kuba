// The four valid values of the CSS `text-align` property that `kb-text`
// exposes. Interpolated directly into `text-align` in `style.js` (not routed
// through a custom property), so the closed set is what keeps an unknown
// value from injecting CSS.
export const ALIGNS = Object.freeze({
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
  JUSTIFY: 'justify',
})
