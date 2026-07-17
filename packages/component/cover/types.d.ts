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
