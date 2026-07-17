/**
 * Custom element (`<kb-label>`) for the label text of a form field or control.
 *
 * When placed as a child of a component that exposes a `label` slot, the
 * element automatically assigns itself `slot="label"` on connect, so no
 * manual `slot` attribute is required.
 *
 * @example
 * ```html
 * <kb-label>Full name</kb-label>
 * ```
 */
export default class KUBALabelElement extends HTMLElement {}

declare global {
  interface HTMLElementTagNameMap {
    'kb-label': KUBALabelElement
  }
}
