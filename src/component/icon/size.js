// The eleven steps of `packages/pixel/tokens/fontSize.css`, in scale order.
// `size` resolves to `--font-size-{value}`, so the closed set is what keeps an
// unknown value from reaching the custom property and injecting CSS.
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
