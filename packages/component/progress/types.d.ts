/**
 * Custom element `<kb-progress>` — a linear progress bar carrying the
 * `progressbar` role, with `value` mirrored onto the ARIA value range.
 *
 * @example
 * ```html
 * <kb-progress value="60" alt="Upload"></kb-progress>
 * ```
 */
export default class KUBAProgressElement extends HTMLElement {
  /**
   * Fill percentage of the progress bar, `0`-`100` (reflects the `value`
   * attribute). Stored as a string since it is applied directly as a CSS
   * `%` value, and published as `aria-valuenow`.
   * @default '0'
   */
  value: string
  /** Accessible name describing what is progressing. Reflects the `alt` attribute. */
  alt: string
  readonly internals: ElementInternals
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-progress': KUBAProgressElement
  }
}
