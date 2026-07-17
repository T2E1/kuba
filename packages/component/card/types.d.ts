/**
 * Custom element `<kb-card>` — a flexible container that lays out its
 * slotted content and can act as a single clickable unit.
 *
 * @example
 * ```html
 * <kb-card direction="row" value="42">
 *   <kb-text>Content</kb-text>
 * </kb-card>
 * ```
 */
export default class KUBACardElement extends HTMLElement {
  /**
   * Flex layout direction for the card's content (reflects the
   * `direction` attribute).
   * @default 'column'
   */
  direction: 'row' | 'column'

  /**
   * The element's `ElementInternals`, lazily attached on first access.
   */
  readonly internals: ElementInternals

  /**
   * Arbitrary payload carried by the card (reflects the `value`
   * attribute), sent as the detail of the `"clicked"` event.
   * @default ''
   */
  value: string

  /**
   * Dispatches a `"clicked"` event carrying `this.value` as detail,
   * absorbing any inner click/clicked events from descendants.
   * @returns This element, for chaining.
   */
  click(): this
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-card': KUBACardElement
  }
}
