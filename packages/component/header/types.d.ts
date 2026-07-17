/**
 * Custom element `<kb-header>` — a page header container with `leading`
 * (defaulting to `<kb-logo>`) and `trailing` slots.
 *
 * @example
 * ```html
 * <kb-header>
 *   <nav slot="trailing">...</nav>
 * </kb-header>
 * ```
 */
export default class KUBAHeaderElement extends HTMLElement {}

declare global {
  interface HTMLElementTagNameMap {
    'kb-header': KUBAHeaderElement
  }

  namespace JSX {
    interface IntrinsicElements {
      'kb-header': KUBAIntrinsicElementProps<KUBAHeaderElement>
    }
  }
}
