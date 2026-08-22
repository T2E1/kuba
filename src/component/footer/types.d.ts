/**
 * Custom element `<kb-footer>` — a page footer container with `leading`
 * and `trailing` slots, neither with default content.
 * Carries the `contentinfo` landmark role.
 *
 * @example
 * ```html
 * <kb-footer alt="Site footer">
 *   <span slot="leading">© 2026 Your Company</span>
 *   <span slot="trailing">Privacy Policy</span>
 * </kb-footer>
 * ```
 */
export default class KUBAFooterElement extends HTMLElement {
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
    'kb-footer': KUBAFooterElement
  }
}
