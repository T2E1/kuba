/**
 * Semantic color family accepted by the `color` attribute of
 * {@link KUBAIconElement}. Resolved as a bare `--color-{value}` CSS custom
 * property (see `packages/pixel/tokens/color.css`) — shade suffixes like
 * `-dark`/`-light` are not valid here, only the base token names. Duplicated
 * from `KUBAButtonColorAttribute` on purpose — see `src/component/icon/color.js`.
 */
type KUBAIconColorAttribute =
  | 'master'
  | 'primary'
  | 'complete'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'menu'

/**
 * Size keyword accepted by the `size` attribute of {@link KUBAIconElement}.
 * Resolved as `--font-size-{value}` (see `packages/pixel/tokens/fontSize.css`).
 */
type KUBAIconSizeAttribute =
  | 'xxxs'
  | 'xxs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl'
  | 'xxxl'
  | 'display'
  | 'giant'

/**
 * How `sink` is applied on {@link KUBAIconElement}, within its `on`
 * attribute.
 */
type KUBAIconOnAttributeSink = 'method' | 'attribute' | 'setter'

/**
 * Shape of the `on` attribute of {@link KUBAIconElement} — an arc string
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
type KUBAIconOnAttribute =
  `${string}/${string}:${KUBAIconOnAttributeSink}/${string}${'' | `|${string}`}`

/**
 * Custom element `<kb-icon>` — renders a Material Symbols ligature glyph.
 *
 * @example
 * ```html
 * <kb-icon use="home" size="lg" color="primary"></kb-icon>
 * ```
 */
export default class KUBAIconElement extends HTMLElement {
  /**
   * Accessible name for the glyph (reflects the `alt` attribute). Left unset,
   * the icon is hidden from assistive technology, which is right whenever the
   * surrounding control already carries the meaning.
   * @default ''
   */
  alt: string

  /**
   * Icon color family (reflects the `color` attribute). Unlike `size`, the
   * fallback isn't stored — the property reads `undefined` until `color` is
   * set, and `style.js` resolves that to `currentColor` rather than a fixed
   * palette entry, so the icon inherits from its surrounding text by
   * default.
   * @default undefined
   */
  color: KUBAIconColorAttribute | undefined

  /**
   * Arc string wiring an event from another element to this icon, in the
   * form `source/event:type/sink` (see {@link KUBAIconOnAttribute}).
   * Inherited from the `Echo` mixin. Reflects the `on` attribute.
   * @default undefined
   * @example
   * ```ts
   * element.on = '#panel/changed:method/refresh' // ok
   * ```
   */
  on: KUBAIconOnAttribute | (string & {})

  /**
   * Icon size keyword (reflects the `size` attribute), resolved against
   * the `--font-size-{value}` CSS custom property.
   * @default 'md'
   */
  size: KUBAIconSizeAttribute

  /**
   * Material Symbols ligature name to render (reflects the `use`
   * attribute), e.g. `"home"` or `"search"`.
   * @default ''
   */
  use: string
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-icon': KUBAIconElement
  }
}
