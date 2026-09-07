/**
 * Shape of the `width` attribute of {@link KUBAInputElement}. Normalized by
 * the `resizing` filter (inherited from the `Width` mixin): numeric `px`/`%`
 * values pass through, `'hug'` becomes `'auto'`, `'fill'` becomes `'100%'`,
 * and anything else defaults to `'auto'`.
 */
type KUBAInputWidthAttribute =
  | `${number}px`
  | `${number}%`
  | 'hug'
  | 'fill'
  | 'auto'

/**
 * How `sink` is applied on {@link KUBAInputElement}, within its `on`
 * attribute.
 */
type KUBAInputOnAttributeSink = 'method' | 'attribute' | 'setter'

/**
 * Shape of the `on` attribute of {@link KUBAInputElement} — an arc string
 * in the form `source/event:type/sink`, optionally followed by one or more
 * `|filter=value` pairs. Inherited from the `Echo` mixin.
 *
 * This only constrains the shape (the four `/`/`:`-separated segments and
 * the `type` segment); `source`, `event`, `sink`, and filter contents remain
 * free-form strings, since TypeScript cannot validate the full grammar (e.g.
 * arbitrary characters, filter repetition) through a template literal type.
 * The check only applies to string literals — a value assigned from a plain
 * `string` variable falls back to unchecked `string`.
 */
type KUBAInputOnAttribute =
  `${string}/${string}:${KUBAInputOnAttributeSink}/${string}${'' | `|${string}`}`

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
  /**
   * Whether the input is disabled and excluded from form submission
   * (reflects the `disabled` attribute).
   * @default false
   */
  disabled: boolean

  /** The form this element is associated with, or `null` if none. */
  readonly form: HTMLFormElement | null

  /**
   * Whether the input is hidden (reflects the `hidden` attribute).
   * Inherited from the `Hidden` mixin. Setting it to `false` also removes
   * the attribute; a truthy value toggles the `:host(:state(hidden))`
   * custom element state.
   * @default false
   */
  hidden: boolean

  /** The element `id`, forwarded to the inner native `<input>`. Falls back to `name` if unset. */
  id: string

  /** The `inputmode` hint, forwarded to the inner native `<input>`. */
  inputMode: string

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
   * owning form's `FormData` (reflects the `name` attribute).
   * @default ''
   */
  name: string

  /**
   * Arc string wiring an event from another element to this input, in the
   * form `source/event:type/sink`, optionally followed by `|filter=value`
   * pairs. Inherited from the `Echo` mixin. Reflects the `on` attribute.
   * @default undefined
   */
  on: KUBAInputOnAttribute | (string & {})

  /** A regular expression the value must match, forwarded to the inner native `<input>`'s `pattern` attribute. */
  pattern: string

  /** Placeholder text, forwarded to the inner native `<input>`. */
  placeholder: string

  /** Whether the value can be changed by the user (reflects the `readonly` attribute). */
  readonly: boolean

  /**
   * Whether a value is required for the element to be valid (reflects the
   * `required` attribute).
   * @default false
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

  /** The current text value. Setting it updates the inner `<input>`, re-runs validation, and dispatches a `changed` event. */
  value: string

  /**
   * Width of the input (reflects the `width` attribute), normalized by the
   * `resizing` filter (see {@link KUBAInputWidthAttribute}). Setting it
   * schedules a style-only re-render instead of a full repaint.
   * @default 'auto'
   */
  width: KUBAInputWidthAttribute | (string & {})

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

  /** Aborts the internal `AbortController` (unregistering the owning form's `formdata` listener), then returns the element for chaining. */
  remove(): this

  /** Clears the value and any `invalid` state, and dispatches a `reset` event. */
  reset(): this
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-input': KUBAInputElement
  }
}
