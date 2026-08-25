/**
 * Custom element `<kb-header>` — a page header container with `leading`
 * and `trailing` slots, neither with default content. Carries the `banner`
 * landmark role.
 *
 * @example
 * ```html
 * <kb-header alt="Site header">
 *   <kb-logo slot="leading"></kb-logo>
 *   <nav slot="trailing">...</nav>
 * </kb-header>
 * ```
 */
export default class KUBAHeaderElement extends HTMLElement {
  /**
   * Accessible name for the landmark, for pages with more than one
   * (reflects the `alt` attribute). Written as `aria-label` on the host via
   * `ElementInternals`. Inherited from the `Identity` mixin. The property
   * reads `''` until `alt` actually changes — with no `alt` set, the
   * accessible name stays whatever the landmark's content gives it, not `''`.
   * @default ''
   */
  alt: string
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-header': KUBAHeaderElement
  }
}
