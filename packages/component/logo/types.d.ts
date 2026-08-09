/**
 * Custom element `<kb-logo>` — renders the brand mark as an inline SVG
 * that inherits its color from `currentColor`. Hidden from assistive
 * technology unless given an `alt`.
 *
 * @example
 * ```html
 * <kb-logo alt="kuba, home"></kb-logo>
 * ```
 */
export default class KUBALogoElement extends HTMLElement {
  /**
   * Accessible name for the mark (reflects the `alt` attribute). Leave it
   * unset when a written site name sits beside the logo; set it when the mark
   * stands alone, such as the only content of a home link.
   * @default ''
   */
  alt: string
  readonly internals: ElementInternals
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-logo': KUBALogoElement
  }
}
