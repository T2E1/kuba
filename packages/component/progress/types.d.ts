/**
 * Custom element `<kb-progress>` — a linear progress bar.
 *
 * @example
 * ```html
 * <kb-progress value="60"></kb-progress>
 * ```
 */
export default class KUBAProgressElement extends HTMLElement {
  /**
   * Fill percentage of the progress bar, `0`-`100` (reflects the `value`
   * attribute). Stored as a string since it is applied directly as a CSS
   * `%` value.
   * @default '0'
   */
  value: string
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-progress': KUBAProgressElement
  }

  namespace JSX {
    interface IntrinsicElements {
      'kb-progress': KUBAIntrinsicElementProps<KUBAProgressElement>
    }
  }
}
