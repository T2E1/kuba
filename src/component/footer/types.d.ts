/**
 * Custom element `<kb-footer>` — a page footer container with `leading`
 * and `trailing` slots, defaulting to a copyright notice in `leading`.
 * Carries the `contentinfo` landmark role.
 *
 * @example
 * ```html
 * <kb-footer>
 *   <span slot="trailing">Privacy Policy</span>
 * </kb-footer>
 * ```
 */
export default class KUBAFooterElement extends HTMLElement {
  /** Accessible name for the landmark, for pages with more than one. Reflects the `alt` attribute. */
  alt: string
  readonly internals: ElementInternals
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-footer': KUBAFooterElement
  }
}
