/**
 * Custom element (`<kb-render>`) that renders its shadow DOM content by
 * interpolating a template against arbitrary data, supplied via
 * `render()`.
 *
 * @example
 * ```html
 * <kb-render id="greeting" template="Hello, {name}!"></kb-render>
 * <script>
 *   document
 *     .getElementById('greeting')
 *     .render({ name: 'Ada' })
 * </script>
 * ```
 */
export default class KUBARenderElement extends HTMLElement {
  /** Current rendered content, produced by the last `render()` call. */
  readonly textContent: string

  /** The element's `ElementInternals`, created lazily on first access. */
  readonly internals: ElementInternals

  /**
   * Interpolates the element's template against `data` and updates
   * `textContent` accordingly. A single value is treated as one entry;
   * an array renders one interpolation per entry, concatenated in order.
   *
   * @param data - Value(s) whose properties fill the template's
   *   `{path.to.value}` placeholders.
   * @returns This element, for chaining.
   */
  render(data: unknown | unknown[]): this
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-render': KUBARenderElement
  }
}
