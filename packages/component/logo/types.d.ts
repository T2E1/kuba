/**
 * Custom element `<kb-logo>` — renders the brand mark as an inline SVG
 * that inherits its color from `currentColor`.
 *
 * @example
 * ```html
 * <kb-logo></kb-logo>
 * ```
 */
export default class KUBALogoElement extends HTMLElement {}

declare global {
  interface HTMLElementTagNameMap {
    'kb-logo': KUBALogoElement
  }
}
