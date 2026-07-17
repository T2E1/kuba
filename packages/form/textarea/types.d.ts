/**
 * Form-associated multi-line text input custom element (`<kb-textarea>`).
 *
 * Wraps a native `<textarea>` in its shadow DOM, forwarding standard
 * attributes/properties to it, auto-resizing its height to fit content, and
 * reflecting its validity into the host via the Constraint Validation API
 * (`ElementInternals`), so `<kb-textarea>` behaves like a native form
 * control from the owning `<form>`'s perspective.
 *
 * @example
 * ```html
 * <form>
 *   <kb-textarea name="bio" placeholder="Tell us about yourself" required>
 *     <span slot="label">Bio</span>
 *   </kb-textarea>
 * </form>
 * ```
 */
export default class KUBATextareaElement extends HTMLElement {
  /** Aborted when the element is disconnected; used to unregister the `formdata` listener registered on the owning form. */
  readonly controller: AbortController
  /**
   * Whether the textarea is disabled and excluded from form submission.
   * @default false
   * Reflects the `disabled` attribute.
   */
  disabled: boolean
  /** The form this element is associated with, or `null` if none. */
  readonly form: HTMLFormElement | null
  /** The element `id`, forwarded to the inner native `<textarea>`. Falls back to `name` if unset. */
  id: string
  /** The `ElementInternals` instance backing form association and validity reporting. */
  readonly internals: ElementInternals
  /**
   * The field name used when this element's value is included in the
   * owning form's `FormData`.
   * @default ''
   * Reflects the `name` attribute.
   */
  name: string
  /** Placeholder text, forwarded to the inner native `<textarea>`. */
  placeholder: string
  /** Whether the value can be changed by the user. Reflects the `readonly` attribute. */
  readonly: boolean
  /**
   * Whether a value is required for the element to be valid.
   * @default false
   * Reflects the `required` attribute.
   */
  required: boolean
  /** Human-readable message describing why the element is currently invalid, or an empty string if valid. */
  readonly validationMessage: string
  /** The current validity state, per the Constraint Validation API. */
  readonly validity: ValidityState
  /** The current text value. Setting it updates the inner `<textarea>`, re-runs validation, and dispatches a `change` event. */
  value: string
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
  /** Clears the value and any `invalid` state, and dispatches a `reset` event. */
  reset(): this
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-textarea': KUBATextareaElement
  }

  namespace JSX {
    interface IntrinsicElements {
      'kb-textarea': KUBAIntrinsicElementProps<KUBATextareaElement>
    }
  }
}
