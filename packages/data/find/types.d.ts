export default class Find extends HTMLElement {
  key: string
  value: string
}

declare global {
  interface HTMLElementTagNameMap {
    'k-find': Find
  }
}
