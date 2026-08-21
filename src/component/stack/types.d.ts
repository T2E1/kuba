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
   * CSS `align-items` value applied to the host (reflects the `align`
   * attribute).
   * @default 'start'
   */
  align: string

  /**
   * CSS `flex-direction` value applied to the host (reflects the
   * `direction` attribute).
   * @default 'row'
   */
  direction: 'row' | 'column'

  /**
   * The element's `ElementInternals`, lazily attached on first access.
   */
  readonly internals: ElementInternals

  /**
   * CSS `justify-content` value applied to the host (reflects the
   * `justify` attribute).
   * @default 'flex-start'
   */
  justify: string

  /**
   * Gap between children (reflects the `spacing` attribute), resolved
   * against the `--spacing_inset-{value}` CSS custom property.
   * @default 'xs'
   */
  spacing: string
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-stack': KUBAStackElement
  }
}
