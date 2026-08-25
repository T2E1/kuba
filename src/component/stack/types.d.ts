/**
 * Cross-axis alignment keyword accepted by the `align` attribute of
 * {@link KUBAStackElement}, applied as `align-items`. `start`/`end` are the
 * preferred spelling; `flex-start`/`flex-end` are accepted legacy aliases.
 * An unknown value is ignored and the property keeps its last valid one.
 */
type KUBAStackAlignAttribute =
  | 'normal'
  | 'start'
  | 'end'
  | 'center'
  | 'stretch'
  | 'baseline'
  | 'flex-start'
  | 'flex-end'
  | 'self-start'
  | 'self-end'

/**
 * Flex direction keyword accepted by the `direction` attribute of
 * {@link KUBAStackElement}, applied as `flex-direction`. An unknown value is
 * ignored and the property keeps its last valid one.
 */
type KUBAStackDirectionAttribute = 'row' | 'column'

/**
 * Main-axis distribution keyword accepted by the `justify` attribute of
 * {@link KUBAStackElement}, applied as `justify-content`. `start`/`end` are
 * the preferred spelling; `flex-start`/`flex-end` are accepted legacy aliases.
 * An unknown value is ignored and the property keeps its last valid one.
 */
type KUBAStackJustifyAttribute =
  | 'normal'
  | 'start'
  | 'end'
  | 'center'
  | 'stretch'
  | 'left'
  | 'right'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | 'flex-start'
  | 'flex-end'

/**
 * How `sink` is applied on {@link KUBAStackElement}, within its `on`
 * attribute.
 */
type KUBAStackOnAttributeSink = 'method' | 'attribute' | 'setter'

/**
 * Shape of the `on` attribute of {@link KUBAStackElement} — an arc string
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
type KUBAStackOnAttribute =
  `${string}/${string}:${KUBAStackOnAttributeSink}/${string}${'' | `|${string}`}`

/**
 * Shape of a `resizing` attribute of {@link KUBAStackElement} (`height` and
 * `width`). Normalized by the `resizing` filter: numeric `px`/`%` values
 * pass through, `'hug'` becomes `'auto'`, `'fill'` becomes `'100%'`, and
 * anything else defaults to `'auto'`.
 */
type KUBAStackResizingAttribute =
  | `${number}px`
  | `${number}%`
  | 'hug'
  | 'fill'
  | 'auto'

/**
 * Inset scale step accepted by the `spacing` attribute of
 * {@link KUBAStackElement}. Resolved as `--spacing_inset-{value}` (see
 * `packages/pixel/tokens/spacing.css`). An unknown value is ignored and the
 * property keeps its last valid one.
 */
type KUBAStackSpacingAttribute =
  | 'quarck'
  | 'nano'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'huge'
  | 'giant'

/**
 * Custom element `<kb-stack>` — a flex layout container for arranging
 * slotted children with configurable direction, alignment and spacing.
 *
 * @example
 * ```html
 * <kb-stack direction="column" align="center" justify="space-between" spacing="md">
 *   <kb-button>A</kb-button>
 *   <kb-button>B</kb-button>
 * </kb-stack>
 * ```
 */
export default class KUBAStackElement extends HTMLElement {
  /**
   * Cross-axis alignment of the flex items (reflects the `align`
   * attribute), applied as `align-items`.
   * @default 'start'
   */
  align: KUBAStackAlignAttribute

  /**
   * Flex direction of the stack (reflects the `direction` attribute),
   * applied as `flex-direction`.
   * @default 'row'
   */
  direction: KUBAStackDirectionAttribute

  /**
   * Height of the stack (reflects the `height` attribute), normalized by
   * the `resizing` filter (see {@link KUBAStackResizingAttribute}). Setting
   * it schedules a style-only re-render instead of a full repaint.
   * Inherited from the `Height` mixin.
   * @default 'auto'
   */
  height: KUBAStackResizingAttribute | (string & {})

  /**
   * Whether the stack is hidden (reflects the `hidden` attribute). The
   * attribute value `"false"` or `"0"` (or the attribute being absent)
   * reads as `false`; any other value — including `""`, as in
   * `<kb-stack hidden>` — reads as `true`. Setting the property to `false`
   * removes the attribute; a truthy value adds the `hidden` custom element
   * state, mixin `Hidden`, mirrored in `:state(hidden)`.
   * @default false
   */
  hidden: boolean

  /**
   * Main-axis distribution of the flex items (reflects the `justify`
   * attribute), applied as `justify-content`.
   * @default 'start'
   */
  justify: KUBAStackJustifyAttribute

  /**
   * Arc string wiring an event from another element to this stack, in the
   * form `source/event:type/sink` (see {@link KUBAStackOnAttribute}).
   * Inherited from the `Echo` mixin. Reflects the `on` attribute.
   * @default undefined
   * @example
   * ```ts
   * element.on = '#panel/changed:method/refresh' // ok
   * ```
   */
  on: KUBAStackOnAttribute | (string & {})

  /**
   * Gap between children (reflects the `spacing` attribute), resolved
   * against the `--spacing_inset-{value}` CSS custom property.
   * @default 'xs'
   */
  spacing: KUBAStackSpacingAttribute

  /**
   * Width of the stack (reflects the `width` attribute), normalized by
   * the `resizing` filter (see {@link KUBAStackResizingAttribute}). Setting
   * it schedules a style-only re-render instead of a full repaint.
   * Inherited from the `Width` mixin.
   * @default 'auto'
   */
  width: KUBAStackResizingAttribute | (string & {})
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-stack': KUBAStackElement
  }
}
