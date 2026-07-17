/**
 * Headless (never rendered) child element that wires an event on its parent
 * declaratively, as an alternative to the parent's `on="..."` attribute.
 * Wiring happens once the parent custom element has upgraded.
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
   */
  value: string
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-on': KUBAOnElement
  }
}
