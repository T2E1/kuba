// The eleven steps of `packages/pixel/tokens/fontSize.css`, in scale order.
// Duplicated from `src/component/icon/size.js` on purpose: a component
// depending on another component would point `kb-text` at the least stable
// package in `src/component/` (rule 019). `size` resolves to
// `--font-size-{value}`, so the closed set is what keeps an unknown value
// from reaching the custom property and injecting CSS.
export const SIZES = Object.freeze({
  XXXS: 'xxxs',
  XXS: 'xxs',
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
  XXL: 'xxl',
  XXXL: 'xxxl',
  DISPLAY: 'display',
  GIANT: 'giant',
})
