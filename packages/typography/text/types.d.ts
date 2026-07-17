/**
 * Custom element (`<kb-text>`) for general body/inline text, with styling
 * driven entirely by its reflected attributes (color, size, weight, etc.)
 * mapped onto the design system's CSS custom properties.
 *
 * @example
 * ```html
 * <kb-text color="master-dark" size="md" weight="medium" align="center">
 *   Hello world
 * </kb-text>
 * ```
 */
export default class KUBAKbTextElement extends HTMLElement {
  /**
   * Text alignment. Reflects the `align` attribute.
   * @default 'left'
   */
  align: 'left' | 'center' | 'right' | 'justify'

  /**
   * Text color keyword, mapped to the `--color-{value}` custom property.
   * Reflects the `color` attribute.
   * @default 'master-dark'
   */
  color: string

  /**
   * Font family keyword, mapped to the `--font-family-{value}` custom property.
   * Reflects the `family` attribute.
   * @default 'base'
   */
  family: string

  /**
   * Line height keyword, mapped to the `--line-height-{value}` custom property.
   * Reflects the `line-height` attribute.
   * @default 'lg'
   */
  lineHeight: string

  /**
   * Font size keyword, mapped to the `--font-size-{value}` custom property.
   * Reflects the `size` attribute.
   * @default 'xxs'
   */
  size: string

  /**
   * Font weight keyword, mapped to the `--font-weight-{value}` custom property.
   * Reflects the `weight` attribute.
   * @default 'regular'
   */
  weight: string
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-text': KUBAKbTextElement
  }
}
