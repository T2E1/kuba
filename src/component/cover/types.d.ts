/**
 * How `sink` is applied on {@link KUBACoverElement}, within its `on`
 * attribute.
 */
type KUBACoverOnAttributeSink = 'method' | 'attribute' | 'setter'

/**
 * Shape of the `on` attribute of {@link KUBACoverElement} — an arc string
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
type KUBACoverOnAttribute =
  `${string}/${string}:${KUBACoverOnAttributeSink}/${string}${'' | `|${string}`}`

/**
 * Custom element `<kb-cover>` — renders a cropped, aspect-ratio-constrained
 * cover image.
 *
 * @example
 * ```html
 * <kb-cover src="/banner.jpg" alt="Product banner" orientation="landscape"></kb-cover>
 * ```
 */
export default class KUBACoverElement extends HTMLElement {
  /**
   * Alternative text for the underlying `<img>` (reflects the `alt`
   * attribute).
   * @default ''
   */
  alt: string

  /**
   * Arc string wiring an event from another element to this cover, in the
   * form `source/event:type/sink` (see {@link KUBACoverOnAttribute}).
   * Inherited from the `Echo` mixin. Reflects the `on` attribute.
   * @default undefined
   * @example
   * ```ts
   * element.on = '#gallery/selected:setter/src' // ok
   * ```
   */
  on: KUBACoverOnAttribute | (string & {})

  /**
   * Aspect ratio applied to the host: `'landscape'` renders 16/9,
   * `'portrait'` renders 4/5 (reflects the `orientation` attribute).
   * @default 'landscape'
   */
  orientation: 'landscape' | 'portrait'

  /**
   * Image URL rendered by the underlying `<img>` (reflects the `src`
   * attribute).
   * @default ''
   */
  src: string
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-cover': KUBACoverElement
  }
}
