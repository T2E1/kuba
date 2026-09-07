/**
 * How `sink` is applied on {@link KUBAValidityElement}, within its `on`
 * attribute.
 */
type KUBAValidityOnAttributeSink = 'method' | 'attribute' | 'setter'

/**
 * Shape of the `on` attribute of {@link KUBAValidityElement} — an arc string
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
type KUBAValidityOnAttribute =
  `${string}/${string}:${KUBAValidityOnAttributeSink}/${string}${'' | `|${string}`}`

/**
 * Conditional validation message custom element (`<kb-validity>`).
 *
 * Slotted as `slot="validity"` inside a form-associated element such as
 * `<kb-input>` or `<kb-textarea>`, it becomes visible
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
  /**
   * Arc string wiring an event from another element to this element, in the
   * form `source/event:type/sink`, optionally followed by `|filter=value`
   * pairs. Inherited from the `Echo` mixin. Reflects the `on` attribute.
   * @default undefined
   */
  on: KUBAValidityOnAttribute | (string & {})

  /**
   * The name of the `ValidityState` key to watch on the parent element
   * (e.g. `'valueMissing'`, `'patternMismatch'`, `'tooShort'`). Read from
   * the `state` attribute on change; the setter only stores it and never
   * writes back to the attribute. `undefined` until the attribute is set.
   * @default undefined
   */
  state: string | undefined

  /** Aborts the internal `AbortController` (unregistering the listeners bound on the parent element), then returns the element for chaining. */
  remove(): this
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-validity': KUBAValidityElement
  }
}
