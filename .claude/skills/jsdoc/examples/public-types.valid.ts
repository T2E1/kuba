// ✅ Contrato público completo — é a única fonte de verdade do consumidor.

export default class Button extends HTMLElement {
  /**
   * Semantic color of the button, reflected on the `color` attribute and
   * used by the active theme to resolve a palette.
   *
   * @default 'primary'
   * @example
   * ```html
   * <kb-button color="danger">Delete</kb-button>
   * ```
   */
  color: 'primary' | 'danger' | 'success' | 'warning'

  /**
   * Arbitrary payload carried as the `detail` of the `clicked` event.
   * Not rendered — use the element's text content for the label.
   *
   * @default ''
   */
  value: string

  /**
   * Activates the button programmatically.
   *
   * @fires clicked - Bubbling `CustomEvent` whose `detail` is {@link value}.
   */
  click(): void
}
