/**
 * How `sink` is applied on {@link KUBAProgressElement}, within its `on`
 * attribute.
 */
type KUBAProgressOnAttributeSink = 'method' | 'attribute' | 'setter'

/**
 * Shape of the `on` attribute of {@link KUBAProgressElement} — an arc string
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
type KUBAProgressOnAttribute =
  `${string}/${string}:${KUBAProgressOnAttributeSink}/${string}${'' | `|${string}`}`

/**
 * Custom element `<kb-progress>` — a linear progress bar carrying the
 * `progressbar` role, with `value` mirrored onto the ARIA value range.
 *
 * @example
 * ```html
 * <kb-progress value="60" alt="Upload"></kb-progress>
 * ```
 */
export default class KUBAProgressElement extends HTMLElement {
  /**
   * Accessible name describing what is progressing (reflects the `alt`
   * attribute).
   * @default ''
   */
  alt: string

  /**
   * Arc string wiring an event from another element to this progress bar,
   * in the form `source/event:type/sink` (see
   * {@link KUBAProgressOnAttribute}). Inherited from the `Echo` mixin.
   * Reflects the `on` attribute.
   * @default undefined
   * @example
   * ```ts
   * element.on = '#panel/changed:method/refresh' // ok
   * ```
   */
  on: KUBAProgressOnAttribute | (string & {})

  /**
   * Fill percentage of the progress bar, `0`-`100` (reflects the `value`
   * attribute). Stored as a string since it is applied directly as a CSS
   * `%` value, and published as `aria-valuenow`. Both an attribute value and
   * a direct property assignment are parsed as a number and re-serialized
   * before being accepted: a value with no numeric prefix is ignored and the
   * property keeps its last valid one; a value with a numeric prefix
   * followed by other text keeps only what was parsed, never the trailing
   * text.
   * @default '0'
   */
  value: string
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-progress': KUBAProgressElement
  }
}
