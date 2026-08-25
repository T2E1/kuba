// The closed set of `align-items` keywords valid on a flex container.
// `align` is interpolated into the stylesheet text (style.js:6), so the set is
// what keeps an arbitrary value from closing the declaration and injecting CSS.
// `start`/`end` are the preferred spelling; `flex-start`/`flex-end` are kept as
// legacy aliases because `docs/` already uses them. The two-keyword overflow
// forms (`safe center`, `unsafe end`) are deliberately out — they would expand
// the set combinatorially for no use in this design system.
export const ALIGNMENTS = Object.freeze({
  NORMAL: 'normal',
  START: 'start',
  END: 'end',
  CENTER: 'center',
  STRETCH: 'stretch',
  BASELINE: 'baseline',
  FLEX_START: 'flex-start',
  FLEX_END: 'flex-end',
  SELF_START: 'self-start',
  SELF_END: 'self-end',
})
