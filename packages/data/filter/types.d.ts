export default class Filter extends HTMLElement {
  key: string
  value: string
}

declare global {
  interface HTMLElementTagNameMap {
    'k-filter': Filter
  }
}
