// The eight semantic color families of `packages/pixel/tokens/color.css`.
// Duplicated from `src/component/button/color.js` on purpose: a component
// depending on another component would point `kb-icon` at the least stable
// package in `src/component/` (rule 019) and open the first edge of an
// `icon`/`button` cycle (rule 018). The set belongs to the token package —
// consolidating it there is the fix, and it is not this change.
// TODO(021): a third copy — `kb-text` needs the same set — is the threshold
// to move COLORS into packages/pixel and have button/icon/text import it.
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
