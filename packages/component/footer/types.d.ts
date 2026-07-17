/**
 * Custom element `<kb-footer>` — a page footer container with `leading`
 * and `trailing` slots, defaulting to a copyright notice in `leading`.
 *
 * @example
 * ```html
 * <kb-footer>
 *   <span slot="trailing">Privacy Policy</span>
 * </kb-footer>
 * ```
 */
export default class KUBAFooterElement extends HTMLElement {}

declare global {
  interface HTMLElementTagNameMap {
    'kb-footer': KUBAFooterElement
  }

  namespace JSX {
    interface IntrinsicElements {
      'kb-footer': KUBAIntrinsicElementProps<KUBAFooterElement>
    }
  }
}
