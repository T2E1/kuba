/**
 * Flex direction accepted by the `direction` attribute of
 * {@link KUBAInsetElement}. Interpolated straight into the `flex-direction`
 * declaration in `style.js` (not routed through a custom property), so the
 * closed set is what keeps an unknown value from injecting CSS. See
 * `src/layout/inset/direction.js`.
 */
type KUBAInsetDirectionAttribute = 'row' | 'column'

/**
 * Edge keyword accepted by the `side` attribute of {@link KUBAInsetElement}.
 * Each value keys the `margin` and `border-radius` maps in `style.js`: it
 * selects which edges get the negative margin and which corners stay
 * rounded. A value outside this set is ignored and the property keeps its
 * last valid value (`'all'` until one is set). See `src/layout/inset/side.js`.
 */
type KUBAInsetSideAttribute =
  | 'all'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'x'
  | 'y'

/**
 * Shape of the `width` and `height` attributes of {@link KUBAInsetElement},
 * inherited from the `Width`/`Height` mixins. Normalized by the `resizing`
 * filter: numeric `px`/`%` values pass through, `'hug'` becomes `'auto'`,
 * `'fill'` becomes `'100%'`, and anything else defaults to `'auto'`.
 */
type KUBAInsetSizeAttribute =
  | `${number}px`
  | `${number}%`
  | 'hug'
  | 'fill'
  | 'auto'

/**
 * How `sink` is applied on {@link KUBAInsetElement}, within its `on`
 * attribute.
 */
type KUBAInsetOnAttributeSink = 'method' | 'attribute' | 'setter'

/**
 * Shape of the `on` attribute of {@link KUBAInsetElement} — an arc string
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
type KUBAInsetOnAttribute =
  `${string}/${string}:${KUBAInsetOnAttributeSink}/${string}${'' | `|${string}`}`

/**
 * Layout primitive (`<kb-inset>`) that flexes its slotted content and
 * applies a negative margin/border-radius "inset" on one or more sides, so
 * child content can bleed to the edges of a padded ancestor. `direction` and
 * `side` are each validated against a closed keyword set: a value outside it
 * is ignored and the property keeps its last valid value.
 *
 * The host is presentational (`role="none"`) and dispatches no events.
 *
 * @example
 * ```html
 * <kb-inset direction="row" side="bottom">
 *   <img src="/banner.png" alt="" />
 * </kb-inset>
 * ```
 */
export default class KUBAInsetElement extends HTMLElement {
  /**
   * Accessible name published as `internals.ariaLabel`. Reflects the `alt`
   * attribute. Inherited from the `Identity` mixin. An inset is
   * presentational, so this is rarely meaningful — content inside keeps its
   * own semantics.
   * @default ''
   */
  alt: string

  /**
   * Flex direction of the slotted content (reflects the `direction`
   * attribute). Setting it schedules a style-only re-render.
   * @default 'column'
   */
  direction: KUBAInsetDirectionAttribute

  /**
   * Host height (reflects the `height` attribute), normalized by the
   * `resizing` filter (see {@link KUBAInsetSizeAttribute}). Inherited from
   * the `Height` mixin.
   * @default 'auto'
   */
  height: KUBAInsetSizeAttribute | (string & {})

  /**
   * Whether the element is hidden (reflects the `hidden` attribute), which
   * also toggles the `:host(:state(hidden))` custom state and `display:
   * none`. Inherited from the `Hidden` mixin.
   * @default false
   */
  hidden: boolean

  /**
   * Arc string wiring an event from another element to this inset, in the
   * form `source/event:type/sink` (see {@link KUBAInsetOnAttribute}).
   * Inherited from the `Echo` mixin. Reflects the `on` attribute.
   * @default undefined
   * @example
   * ```ts
   * element.on = '#toggle/changed:setter/hidden' // ok
   * ```
   */
  on: KUBAInsetOnAttribute | (string & {})

  /**
   * Which side(s) receive the negative margin/border-radius inset (reflects
   * the `side` attribute; see {@link KUBAInsetSideAttribute}). Setting it
   * schedules a style-only re-render.
   * @default 'all'
   */
  side: KUBAInsetSideAttribute

  /**
   * Host width (reflects the `width` attribute), normalized by the
   * `resizing` filter (see {@link KUBAInsetSizeAttribute}). Inherited from
   * the `Width` mixin.
   * @default 'auto'
   */
  width: KUBAInsetSizeAttribute | (string & {})
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-inset': KUBAInsetElement
  }
}
