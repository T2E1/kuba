// The eight steps of the inset scale in `packages/pixel/tokens/spacing.css`, in
// scale order. `spacing` resolves to `--spacing_inset-{value}` (style.js:9), so
// the closed set is what keeps an unknown value from reaching the custom
// property name and injecting CSS.
// Duplicated from the token stylesheet on purpose, as in
// `src/component/icon/size.js`: `packages/pixel` publishes CSS only
// (packages/pixel/index.js:1), so there is no JS surface to import from, and
// inventing one for a single consumer would be the larger change.
// TODO(058): a ninth inset step in `packages/pixel/tokens/spacing.css` touches
// four more files with no mechanical link to this one: this enum, the
// `KUBAStackSpacingAttribute` union in types.d.ts (the .d.ts silently rejects
// what the enum would accept), and the two tables in docs/components/stack.md
// (en + es/pt-br). Same surface applies to align.js/justify.js if a CSS spec
// adds a new align-items/justify-content keyword.
export const SPACINGS = Object.freeze({
  QUARCK: 'quarck',
  NANO: 'nano',
  XS: 'xs',
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  HUGE: 'huge',
  GIANT: 'giant',
})
