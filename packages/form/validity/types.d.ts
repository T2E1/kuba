/**
 * Conditional validation message custom element (`<kb-validity>`).
 *
 * Slotted as `slot="validity"` inside a form-associated element such as
 * `<kb-input>`, `<kb-textarea>`, or `<kb-fileupload>`, it becomes visible
 * only when the specific `ValidityState` flag named by `state` is `true` on
 * its parent (e.g. shows only for a `valueMissing` error, not for any other
 * validity failure).
 *
 * @example
 * ```html
 * <kb-input name="email" type="email" required>
 *   <kb-validity slot="validity" state="valueMissing">
 *     This field is required.
 *   </kb-validity>
 *   <kb-validity slot="validity" state="typeMismatch">
 *     Enter a valid email address.
 *   </kb-validity>
 * </kb-input>
 * ```
 */
export default class KUBAValidityElement extends HTMLElement {
  /** Aborted when the element is disconnected; used to unregister listeners registered on the parent element. */
  readonly controller: AbortController
  /** The `ElementInternals` instance backing this element's `:state(invalid)` reflection. */
  readonly internals: ElementInternals
  /**
   * The name of the `ValidityState` key to watch on the parent element
   * (e.g. `'valueMissing'`, `'patternMismatch'`, `'tooShort'`).
   * Reflects the `state` attribute.
   */
  state: string
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-validity': KUBAValidityElement
  }
}
