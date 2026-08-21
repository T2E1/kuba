/**
 * Top-level page layout container (`<kb-main>`) that centers its slotted
 * content in a column with a max width, consistent gap, and padding.
 * Carries the `main` landmark role.
 *
 * @example
 * ```html
 * <kb-main>
 *   <h1>Page title</h1>
 *   <p>Page content.</p>
 * </kb-main>
 * ```
 */
export default class KUBAMainElement extends HTMLElement {
  /** Accessible name for the landmark. Reflects the `alt` attribute. */
  alt: string
  readonly internals: ElementInternals
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-main': KUBAMainElement
  }
}
