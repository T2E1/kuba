// The seven steps of `packages/pixel/tokens/lineHeight.css`.
// `lineHeight` resolves to `--line-height-{value}`, so the closed set is what
// keeps an unknown value from reaching the custom property and injecting CSS.
export const LINE_HEIGHTS = Object.freeze({
  DEFAULT: 'default',
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
  XXL: 'xxl',
})
