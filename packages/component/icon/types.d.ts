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
   * Icon color (reflects the `color` attribute), resolved against the
   * `--color-{value}` CSS custom property.
   * @default 'currentColor' (when the attribute is unset)
   */
  color: string

  /**
   * Icon size keyword (reflects the `size` attribute), resolved against
   * the `--font-size-{value}` CSS custom property.
   * @default 'md'
   */
  size: string

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
