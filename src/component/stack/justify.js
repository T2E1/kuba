// The closed set of `justify-content` keywords valid on a flex container.
// `justify` is interpolated into the stylesheet text (style.js:11), so the set
// is what keeps an arbitrary value from closing the declaration and injecting
// CSS. It differs from `ALIGNMENTS` on purpose: distribution keywords
// (`space-between` and siblings) are only meaningful on the main axis, and
// `self-start`/`self-end` are only meaningful on the cross axis.
export const JUSTIFICATIONS = Object.freeze({
  NORMAL: 'normal',
  START: 'start',
  END: 'end',
  CENTER: 'center',
  STRETCH: 'stretch',
  LEFT: 'left',
  RIGHT: 'right',
  SPACE_BETWEEN: 'space-between',
  SPACE_AROUND: 'space-around',
  SPACE_EVENLY: 'space-evenly',
  FLEX_START: 'flex-start',
  FLEX_END: 'flex-end',
})
