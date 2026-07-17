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
  color: string

  /**
   * Native button behavior (reflects the `type` attribute): `'submit'`
   * requests submission of the owning form, `'reset'` resets it.
   * @default 'submit'
   */
  type: 'submit' | 'reset'

  /**
   * Visual style of the button (reflects the `variant` attribute), exposed
   * to CSS as a custom element state (e.g. `:host(:state(naked))`).
   * @default 'solid'
   */
  variant: string

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

  namespace JSX {
    interface IntrinsicElements {
      'kb-button': KUBAIntrinsicElementProps<KUBAButtonElement>
    }
  }
}
