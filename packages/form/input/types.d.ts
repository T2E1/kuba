/**
 * Form-associated text input custom element (`<kb-input>`).
 *
 * Wraps a native `<input>` in its shadow DOM, forwarding standard input
 * attributes/properties to it and reflecting its validity into the host via
 * the Constraint Validation API (`ElementInternals`), so `<kb-input>`
 * behaves like a native form control from the owning `<form>`'s
 * perspective.
 *
 * @example
 * ```html
 * <form>
 *   <kb-input name="email" type="email" required placeholder="you@example.com">
 *     <span slot="label">Email</span>
 *     <span slot="helper">We'll never share it.</span>
 *   </kb-input>
 * </form>
 * ```
 */
export default class KUBAInputElement extends HTMLElement {
  /** Aborted when the element is disconnected; used to unregister the `formdata` listener registered on the owning form. */
  readonly controller: AbortController
  /**
   * Whether the input is disabled and excluded from form submission.
   * @default false
   * Reflects the `disabled` attribute.
   */
  disabled: boolean
  /** The form this element is associated with, or `null` if none. */
  readonly form: HTMLFormElement | null
  /** The element `id`, forwarded to the inner native `<input>`. Falls back to `name` if unset. */
  id: string
  /** The `inputmode` hint, forwarded to the inner native `<input>`. */
  inputMode: string
  /** The `ElementInternals` instance backing form association and validity reporting. */
  readonly internals: ElementInternals
  /** The maximum value, forwarded to the inner native `<input>`'s `max` attribute. */
  max: string
  /** The maximum text length, forwarded to the inner native `<input>`'s `maxlength` attribute. */
  maxLength: string
  /** The minimum value, forwarded to the inner native `<input>`'s `min` attribute. */
  min: string
  /** The minimum text length, forwarded to the inner native `<input>`'s `minlength` attribute. */
  minLength: string
  /**
   * The field name used when this element's value is included in the
   * owning form's `FormData`.
   * @default ''
   * Reflects the `name` attribute.
   */
  name: string
  /** A regular expression the value must match, forwarded to the inner native `<input>`'s `pattern` attribute. */
  pattern: string
  /** Placeholder text, forwarded to the inner native `<input>`. */
  placeholder: string
  /** Whether the value can be changed by the user. Reflects the `readonly` attribute. */
  readonly: boolean
  /**
   * Whether a value is required for the element to be valid.
   * @default false
   * Reflects the `required` attribute.
   */
  required: boolean
  /** The stepping interval for numeric/date inputs, forwarded to the inner native `<input>`. */
  step: string
  /** The input type (e.g. `text`, `email`, `number`), forwarded to the inner native `<input>`. */
  type: string
  /** Human-readable message describing why the element is currently invalid, or an empty string if valid. */
  readonly validationMessage: string
  /** The current validity state, per the Constraint Validation API. */
  readonly validity: ValidityState
  /** The current text value. Setting it updates the inner `<input>`, re-runs validation, and dispatches a `change` event. */
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
    'kb-input': KUBAInputElement
  }

  namespace JSX {
    interface IntrinsicElements {
      'kb-input': KUBAIntrinsicElementProps<KUBAInputElement>
    }
  }
}
