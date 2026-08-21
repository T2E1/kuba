/**
 * Custom element (`<kb-helper>`) for supplementary/helper text associated with
 * a form field or other control, such as hint or error messaging.
 *
 * When placed as a child of a component that exposes a `helper` slot, the
 * element automatically assigns itself `slot="helper"` on connect, so no
 * manual `slot` attribute is required.
 *
 * @example
 * ```html
 * <kb-helper>This field is required.</kb-helper>
 * ```
 */
export default class KUBAHelperElement extends HTMLElement {}

declare global {
  interface HTMLElementTagNameMap {
    'kb-helper': KUBAHelperElement
  }
}
