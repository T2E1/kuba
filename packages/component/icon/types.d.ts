export default class Icon extends HTMLElement {
  color: string
  size: string
  use: string
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-icon': Icon
  }
}
