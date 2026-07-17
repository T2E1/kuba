/**
 * Layout primitive (`<kb-inset>`) that flexes its slotted content and can
 * apply a negative margin/border-radius "inset" on one or more sides, so
 * child content can bleed to the edges of a padded ancestor.
 *
 * @example
 * ```html
 * <kb-inset direction="row" side="bottom">
 *   <img src="/banner.png" alt="" />
 * </kb-inset>
 * ```
 */
export default class KUBAInsetElement extends HTMLElement {
  /**
   * Flex direction of the slotted content.
   * Reflects the `direction` attribute.
   * @default 'column'
   */
  direction: 'row' | 'column'

  /** Lazily-attached `ElementInternals` for the custom element. */
  readonly internals: ElementInternals

  /**
   * Which side(s) receive the negative margin/border-radius inset.
   * Reflects the `side` attribute.
   * @default 'all'
   */
  side: string
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-inset': KUBAInsetElement
  }

  namespace JSX {
    interface IntrinsicElements {
      'kb-inset': KUBAIntrinsicElementProps<KUBAInsetElement>
    }
  }
}
