// The semantic color tokens shared across `packages/pixel/tokens/color.css`
// — `kb-icon` now validates its `color` attribute against its own duplicate
// of this set (not an import of this file, see its `color.js`), and
// `kb-text` resolves its `color` attribute against the same set without
// validating it yet.
export const COLORS = Object.freeze({
  MASTER: 'master',
  PRIMARY: 'primary',
  COMPLETE: 'complete',
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
  INFO: 'info',
  MENU: 'menu',
})
