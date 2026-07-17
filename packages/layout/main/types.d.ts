/**
 * Top-level page layout container (`<kb-main>`) that centers its slotted
 * content in a column with a max width, consistent gap, and padding.
 * Exposes no public API beyond the standard custom element surface.
 *
 * @example
 * ```html
 * <kb-main>
 *   <h1>Page title</h1>
 *   <p>Page content.</p>
 * </kb-main>
 * ```
 */
export default class KUBAMainElement extends HTMLElement {}

declare global {
  interface HTMLElementTagNameMap {
    'kb-main': KUBAMainElement
  }
}
