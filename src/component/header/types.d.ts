/**
 * Custom element `<kb-header>` — a page header container with `leading`
 * (defaulting to `<kb-logo>`) and `trailing` slots. Carries the `banner`
 * landmark role.
 *
 * @example
 * ```html
 * <kb-header>
 *   <nav slot="trailing">...</nav>
 * </kb-header>
 * ```
 */
export default class KUBAHeaderElement extends HTMLElement {
  /** Accessible name for the landmark, for pages with more than one. Reflects the `alt` attribute. */
  alt: string
  readonly internals: ElementInternals
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-header': KUBAHeaderElement
  }
}
