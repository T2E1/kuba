/**
 * Text alignment accepted by the `align` attribute of {@link KUBATextElement}.
 * Interpolated straight into the `text-align` declaration in `style.js` (not
 * routed through a custom property), so the closed set is what keeps an
 * unknown value from injecting CSS. See `src/typography/text/align.js`.
 */
type KUBATextAlignAttribute = 'left' | 'center' | 'right' | 'justify'

/**
 * Color keyword accepted by the `color` attribute of {@link KUBATextElement}.
 * Resolved as a bare `--color-{value}` CSS custom property (see
 * `packages/pixel/tokens/color.css`), including the tint/shade variants —
 * unlike `kb-icon`/`kb-button`, which only take the base family name. A value
 * outside this set is ignored and the property keeps its last valid value.
 */
type KUBATextColorAttribute =
  | 'master-darkest'
  | 'master-darker'
  | 'master-dark'
  | 'master'
  | 'master-light'
  | 'master-lighter'
  | 'master-lightest'
  | 'primary-darker'
  | 'primary-dark'
  | 'primary'
  | 'primary-light'
  | 'primary-lighter'
  | 'complete-darker'
  | 'complete-dark'
  | 'complete'
  | 'complete-light'
  | 'complete-lighter'
  | 'success-darker'
  | 'success-dark'
  | 'success'
  | 'success-light'
  | 'success-lighter'
  | 'warning-darker'
  | 'warning-dark'
  | 'warning'
  | 'warning-light'
  | 'warning-lighter'
  | 'danger-darker'
  | 'danger-dark'
  | 'danger'
  | 'danger-light'
  | 'danger-lighter'
  | 'info-darker'
  | 'info-dark'
  | 'info'
  | 'info-light'
  | 'info-lighter'
  | 'menu-dark'
  | 'menu'
  | 'menu-light'
  | 'pure-white'
  | 'pure-black'

/**
 * Font family keyword accepted by the `family` attribute of
 * {@link KUBATextElement}. Resolved as `--font-family-{value}` (see
 * `packages/pixel/tokens/fontFamily.css`).
 */
type KUBATextFamilyAttribute = 'base' | 'highlight'

/**
 * Line height keyword accepted by the `line-height` attribute of
 * {@link KUBATextElement}. Resolved as `--line-height-{value}` (see
 * `packages/pixel/tokens/lineHeight.css`).
 */
type KUBATextLineHeightAttribute =
  | 'default'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl'

/**
 * Font size keyword accepted by the `size` attribute of
 * {@link KUBATextElement}. Resolved as `--font-size-{value}` (see
 * `packages/pixel/tokens/fontSize.css`), in scale order.
 */
type KUBATextSizeAttribute =
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
 * Font weight keyword accepted by the `weight` attribute of
 * {@link KUBATextElement}. Resolved as `--font-weight-{value}` (see
 * `packages/pixel/tokens/fontWeight.css`).
 */
type KUBATextWeightAttribute = 'regular' | 'medium' | 'bold'

/**
 * How `sink` is applied on {@link KUBATextElement}, within its `on`
 * attribute.
 */
type KUBATextOnAttributeSink = 'method' | 'attribute' | 'setter'

/**
 * Shape of the `on` attribute of {@link KUBATextElement} — an arc string
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
type KUBATextOnAttribute =
  `${string}/${string}:${KUBATextOnAttributeSink}/${string}${'' | `|${string}`}`

/**
 * Custom element (`<kb-text>`) for general body/inline text, with styling
 * driven entirely by its reflected attributes (color, size, weight, etc.)
 * mapped onto the design system's CSS custom properties. Every attribute is
 * validated against a closed keyword set: a value outside it is ignored and
 * the property keeps its last valid value.
 *
 * It carries no document semantics and dispatches no events.
 *
 * @example
 * ```html
 * <kb-text color="master-dark" size="md" weight="medium" align="center">
 *   Hello world
 * </kb-text>
 * ```
 */
export default class KUBATextElement extends HTMLElement {
  /**
   * Text alignment. Reflects the `align` attribute.
   * @default 'left'
   */
  align: KUBATextAlignAttribute

  /**
   * Text color keyword, mapped to the `--color-{value}` custom property.
   * Reflects the `color` attribute.
   * @default 'master-dark'
   */
  color: KUBATextColorAttribute

  /**
   * Font family keyword, mapped to the `--font-family-{value}` custom property.
   * Reflects the `family` attribute.
   * @default 'base'
   */
  family: KUBATextFamilyAttribute

  /**
   * Line height keyword, mapped to the `--line-height-{value}` custom property.
   * Reflects the `line-height` attribute.
   * @default 'lg'
   */
  lineHeight: KUBATextLineHeightAttribute

  /**
   * Arc string wiring an event from another element to this text, in the
   * form `source/event:type/sink` (see {@link KUBATextOnAttribute}).
   * Inherited from the `Echo` mixin. Reflects the `on` attribute.
   * @default undefined
   * @example
   * ```ts
   * element.on = '#counter/changed:setter/size' // ok
   * ```
   */
  on: KUBATextOnAttribute | (string & {})

  /**
   * Font size keyword, mapped to the `--font-size-{value}` custom property.
   * Reflects the `size` attribute.
   * @default 'xxs'
   */
  size: KUBATextSizeAttribute

  /**
   * Font weight keyword, mapped to the `--font-weight-{value}` custom property.
   * Reflects the `weight` attribute.
   * @default 'regular'
   */
  weight: KUBATextWeightAttribute
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-text': KUBATextElement
  }
}
