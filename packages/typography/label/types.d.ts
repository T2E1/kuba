export default class Label extends HTMLElement {}

declare global {
  interface HTMLElementTagNameMap {
    'kb-label': Label
  }
}
