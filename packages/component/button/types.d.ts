export default class Button extends HTMLElement {
  color: string
  type: 'submit' | 'reset'
  variant: string
  click(): string
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-button': Button
  }
}
