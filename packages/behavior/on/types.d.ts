export default class On extends HTMLElement {
  value: string
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-on': On
  }
}
