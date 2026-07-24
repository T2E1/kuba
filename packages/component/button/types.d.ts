/**
 * Semantic color token accepted by the `color` attribute of
 * {@link KUBAButtonElement}. Resolved as a bare `--color-{value}` CSS
 * custom property (see `packages/pixel/tokens/color.css`) — shade suffixes
 * like `-dark`/`-light` are not valid here, only the base token names.
 */
type KUBAButtonColorAttribute =
  | 'master'
  | 'primary'
  | 'complete'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'menu'

/**
 * Visual style accepted by the `variant` attribute of
 * {@link KUBAButtonElement}, each backed by a `:host(:state(...))` rule in
 * `style.js`. `'solid'` has no matching state — it is the unstyled default.
 */
type KUBAButtonVariantAttribute = 'solid' | 'naked' | 'ghost' | 'link' | 'icon'

/**
 * How `sink` is applied on {@link KUBAButtonElement}, within its `on`
 * attribute.
 */
type KUBAButtonOnAttributeSink = 'method' | 'attribute' | 'setter'

/**
 * Shape of the `on` attribute of {@link KUBAButtonElement} — an arc string
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
type KUBAButtonOnAttribute =
  `${string}/${string}:${KUBAButtonOnAttributeSink}/${string}${'' | `|${string}`}`

/**
 * Shape of the `width` attribute of {@link KUBAButtonElement}. Normalized
 * by the `resizing` filter: numeric `px`/`%` values pass through, `'hug'`
 * becomes `'auto'`, `'fill'` becomes `'100%'`, and anything else defaults
 * to `'auto'`.
 */
type KUBAButtonWidthAttribute =
  | `${number}px`
  | `${number}%`
  | 'hug'
  | 'fill'
  | 'auto'

/**
 * Custom element `<kb-button>` — a form-associated button that renders a
 * native `<button>` in its shadow DOM and forwards clicks to it.
 *
 * @example
 * ```html
 * <kb-button color="primary" variant="solid" type="submit">
 *   Save
 * </kb-button>
 * ```
 */
export default class KUBAButtonElement extends HTMLElement {
  /**
   * Semantic color applied to the button (reflects the `color` attribute).
   * Resolved against the `--color-{value}` CSS custom property.
   * @default 'primary'
   */
  color: KUBAButtonColorAttribute | (string & {})

  /**
   * The element's `ElementInternals`, attached on construction.
   */
  readonly internals: ElementInternals

  /**
   * Whether the button is hidden (reflects the `hidden` attribute). The
   * attribute value `"false"` or `"0"` (or the attribute being absent)
   * reads as `false`; any other value — including `""`, as in
   * `<kb-button hidden>` — reads as `true`. Setting the property to `false`
   * removes the attribute; a truthy value adds the `hidden` custom element
   * state (`:host(:state(hidden))`).
   * @default false
   */
  hidden: boolean

  /**
   * Arc string wiring an event from another element to this button, in the
   * form `source/event:type/sink` (see {@link KUBAButtonOnAttribute}).
   * Inherited from the `Echo` mixin. Reflects the `on` attribute.
   * @default undefined
   * @example
   * ```ts
   * element.on = '#panel/change:method/refresh' // ok
   * ```
   */
  on: KUBAButtonOnAttribute | (string & {})

  /**
   * Native button behavior (reflects the `type` attribute): `'submit'`
   * requests submission of the owning form, `'reset'` resets it.
   * @default 'submit'
   */
  type: 'submit' | 'reset'

  /**
   * Arbitrary payload carried by the button (reflects the `value`
   * attribute), returned by `click()`.
   */
  value: string

  /**
   * Visual style of the button (reflects the `variant` attribute), exposed
   * to CSS as a custom element state (e.g. `:host(:state(naked))`).
   * @default 'solid'
   */
  variant: KUBAButtonVariantAttribute | (string & {})

  /**
   * Width of the button (reflects the `width` attribute), normalized by
   * the `resizing` filter (see {@link KUBAButtonWidthAttribute}). Setting
   * it schedules a style-only re-render instead of a full repaint.
   * @default 'auto'
   */
  width: KUBAButtonWidthAttribute | (string & {})

  /**
   * Programmatically triggers the button's native form action (submit or
   * reset, depending on `type`) and dispatches a `"clicked"` event.
   * @returns The button's current `value`.
   */
  click(): string
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-button': KUBAButtonElement
  }
}
