export default class Header extends HTMLElement {}

declare global {
  interface HTMLElementTagNameMap {
    'kb-header': Header
  }
}
