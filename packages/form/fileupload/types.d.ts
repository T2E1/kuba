/**
 * Form-associated file upload custom element (`<kb-fileupload>`).
 *
 * Presents a drop/click target for selecting a single image file, previews
 * it, and participates in the owning form's submission via the Constraint
 * Validation API (`ElementInternals`). When `required` is set and no file
 * has been selected, the element reports as invalid.
 *
 * @example
 * ```html
 * <form>
 *   <kb-fileupload name="avatar" required>
 *     <span slot="label">Upload a photo</span>
 *     <span slot="helper">PNG or JPG, up to 5MB</span>
 *   </kb-fileupload>
 * </form>
 * ```
 */
export default class KUBAFileUploadElement extends HTMLElement {
  /** Aborted when the element is disconnected; used to unregister the `formdata` listener registered on the owning form. */
  readonly controller: AbortController
  /**
   * The selected file encoded as a base64 data URL. Setting this value
   * updates the preview, re-runs validation, and dispatches a `change`
   * event.
   * @default ''
   */
  file: string
  /** The form this element is associated with, or `null` if none. */
  readonly form: HTMLFormElement | null
  /** The `ElementInternals` instance backing form association and validity reporting. */
  readonly internals: ElementInternals
  /**
   * The field name used when this element's value is included in the
   * owning form's `FormData`.
   * @default ''
   * Reflects the `name` attribute.
   */
  name: string
  /**
   * Whether a file must be selected for the element to be valid.
   * @default false
   * Reflects the `required` attribute.
   */
  required: boolean
  /** Human-readable message describing why the element is currently invalid, or an empty string if valid. */
  readonly validationMessage: string
  /** The current validity state, per the Constraint Validation API. */
  readonly validity: ValidityState
  /** Whether this element is a candidate for constraint validation. */
  readonly willValidate: boolean
  /**
   * Checks validity and fires an `invalid` event if the element is
   * currently invalid.
   * @returns `true` if the element satisfies its constraints, `false` otherwise.
   */
  checkValidity(): boolean
  /**
   * Checks validity and, if invalid, reports the problem to the user via
   * the browser's native validation UI.
   * @returns `true` if the element satisfies its constraints, `false` otherwise.
   */
  reportValidity(): boolean
  /** Clears the selected file and any `invalid` state, and dispatches a `reset` event. */
  reset(): this
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-fileupload': KUBAFileUploadElement
  }

  namespace JSX {
    interface IntrinsicElements {
      'kb-fileupload': KUBAIntrinsicElementProps<KUBAFileUploadElement>
    }
  }
}
