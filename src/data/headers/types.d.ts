/**
 * How `sink` is applied on {@link KUBAHeadersElement}, within its `on`
 * attribute.
 */
type KUBAHeadersOnAttributeSink = 'method' | 'attribute' | 'setter'

/**
 * Shape of the `on` attribute of {@link KUBAHeadersElement} — an arc string
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
type KUBAHeadersOnAttribute =
  `${string}/${string}:${KUBAHeadersOnAttributeSink}/${string}${'' | `|${string}`}`

/**
 * Headless (never rendered) child element that sets one HTTP header
 * key/value pair on its parent `<kb-fetch>`, once the parent has upgraded.
 * Since a `<kb-fetch>` needs one header entry per name, nest one
 * `<kb-headers>` per header.
 *
 * @remarks
 * Only meaningful as a direct child of `<kb-fetch>` (or another element
 * exposing the same `setHeader` contract) — the wiring targets
 * `parentElement`, so nesting it under a plain HTML element or using it
 * standalone has no effect. This is a usage contract, not something
 * TypeScript can enforce: parent/child element nesting has no compile-time
 * representation in plain HTML markup.
 *
 * @example
 * ```html
 * <kb-fetch url="/api/users">
 *   <kb-headers key="Authorization" value="Bearer abc123"></kb-headers>
 * </kb-fetch>
 * ```
 */
export default class KUBAHeadersElement extends HTMLElement {
  /**
   * Name of the HTTP header to set on the parent (e.g. `"Authorization"`).
   * Reflects the `key` attribute.
   * @default ''
   */
  key: string

  /**
   * Value of the HTTP header identified by `key`. Reflects the `value`
   * attribute.
   * @default ''
   */
  value: string

  /**
   * Arc string wiring an event from another element to this host, in the
   * form `source/event:type/sink` (see {@link KUBAHeadersOnAttribute}).
   * Inherited from the `Echo` mixin. Reflects the `on` attribute.
   *
   * @example
   * ```ts
   * element.on = '#source/changed:setter/value' // ok
   * ```
   */
  on: KUBAHeadersOnAttribute | (string & {})
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-headers': KUBAHeadersElement
  }
}
