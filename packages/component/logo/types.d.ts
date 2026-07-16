export default class Logo extends HTMLElement {}

declare global {
  interface HTMLElementTagNameMap {
    'kb-logo': Logo
  }
}
