/**
 * How `sink` is applied on the parent element, within the `value` attribute
 * of {@link KUBAOnElement}.
 */
type KUBAOnValueAttributeSink = 'method' | 'attribute' | 'setter'

/**
 * Shape of the `value` attribute of {@link KUBAOnElement} — an arc string in
 * the form `source/event:type/sink`, optionally followed by one or more
 * `|filter=value` pairs.
 *
 * This only constrains the shape (the four `/`/`:`-separated segments and
 * the `type` segment); `source`, `event`, `sink`, and filter contents remain
 * free-form strings, since TypeScript cannot validate the full grammar (e.g.
 * arbitrary characters, filter repetition) through a template literal type.
 * The check only applies to string literals — a value assigned from a plain
 * `string` variable falls back to unchecked `string`.
 */
type KUBAOnValueAttribute =
  `${string}/${string}:${KUBAOnValueAttributeSink}/${string}${'' | `|${string}`}`

/**
 * Headless (never rendered) child element that wires an event on its parent
 * declaratively, as an alternative to the parent's `on="..."` attribute.
 * Wiring happens once the parent custom element has upgraded.
 *
 * @remarks
 * Only meaningful as a direct child of a kuba custom element — the wiring
 * targets `parentElement`, so nesting it under a plain HTML element or using
 * it standalone has no effect. This is a usage contract, not something
 * TypeScript can enforce: parent/child element nesting has no compile-time
 * representation in plain HTML markup.
 *
 * @example
 * ```html
 * <kb-some-component>
 *   <kb-on value="*\/click:method/handleClick"></kb-on>
 * </kb-some-component>
 * ```
 */
export default class KUBAOnElement extends HTMLElement {
  /**
   * Arc string describing the wiring, in the form
   * `source/event:type/sink` (optionally followed by `|filter=value` pairs).
   * - `source`: `*` (any), `#id`, `name`, or tag name to match the event's origin.
   * - `event`: the event type to listen for (e.g. `click`).
   * - `type`: how `sink` is applied — `method`, `attribute`, or `setter`.
   * - `sink`: the method name, attribute name, or property name on the parent.
   *
   * @example
   * ```ts
   * element.value = '*\/click:method/handleClick' // ok
   * element.value = '*\/click/handleClick'        // type error: missing `:type`
   * ```
   */
  value: KUBAOnValueAttribute | (string & {})
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-on': KUBAOnElement
  }
}
