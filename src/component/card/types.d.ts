/**
 * How `sink` is applied on {@link KUBACardElement}, within its `on`
 * attribute.
 */
type KUBACardOnAttributeSink = 'method' | 'attribute' | 'setter'

/**
 * Shape of the `on` attribute of {@link KUBACardElement} — an arc string
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
type KUBACardOnAttribute =
  `${string}/${string}:${KUBACardOnAttributeSink}/${string}${'' | `|${string}`}`

/**
 * Shape of a `resizing` attribute of {@link KUBACardElement} (`height` and
 * `width`). Normalized by the `resizing` filter: numeric `px`/`%` values
 * pass through, `'hug'` becomes `'auto'`, `'fill'` becomes `'100%'`, and
 * anything else defaults to `'auto'`.
 */
type KUBACardResizingAttribute =
  | `${number}px`
  | `${number}%`
  | 'hug'
  | 'fill'
  | 'auto'

/**
 * Custom element `<kb-card>` — a flexible layout container that groups
 * slotted content in a flex box styled by `--card-*` tokens.
 *
 * @example
 * ```html
 * <kb-card direction="row">
 *   <kb-text>Content</kb-text>
 * </kb-card>
 * ```
 */
export default class KUBACardElement extends HTMLElement {
  /**
   * Flex layout direction for the card's content (reflects the
   * `direction` attribute).
   * @default 'column'
   */
  direction: 'row' | 'column'

  /**
   * Height of the card (reflects the `height` attribute), normalized by
   * the `resizing` filter (see {@link KUBACardResizingAttribute}). Setting
   * it schedules a style-only re-render instead of a full repaint.
   * Inherited from the `Height` mixin.
   * @default 'auto'
   */
  height: KUBACardResizingAttribute | (string & {})

  /**
   * The element's `ElementInternals`, lazily attached on first access.
   */
  readonly internals: ElementInternals

  /**
   * Arc string wiring an event from another element to this card, in the
   * form `source/event:type/sink` (see {@link KUBACardOnAttribute}).
   * Inherited from the `Echo` mixin. Reflects the `on` attribute.
   * @default undefined
   * @example
   * ```ts
   * element.on = '#panel/changed:method/refresh' // ok
   * ```
   */
  on: KUBACardOnAttribute | (string & {})

  /**
   * Width of the card (reflects the `width` attribute), normalized by
   * the `resizing` filter (see {@link KUBACardResizingAttribute}). Setting
   * it schedules a style-only re-render instead of a full repaint.
   * Inherited from the `Width` mixin.
   * @default 'auto'
   */
  width: KUBACardResizingAttribute | (string & {})
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-card': KUBACardElement
  }
}
