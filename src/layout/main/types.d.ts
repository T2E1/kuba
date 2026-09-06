/**
 * Top-level page layout container (`<kb-main>`) that centers its slotted
 * content in a column with a max width, consistent gap, and padding, and is
 * tall enough to push a footer to the bottom of short pages. Carries the
 * `main` landmark role, published through `ElementInternals` so an
 * author-supplied `role` still wins.
 *
 * Dispatches no events.
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
  /**
   * Accessible name for the landmark, published as `internals.ariaLabel`.
   * Reflects the `alt` attribute. Inherited from the `Identity` mixin. Only
   * meaningful on a page that carries more than one `main`-like region;
   * leave it unset otherwise.
   * @default ''
   */
  alt: string
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-main': KUBAMainElement
  }
}
