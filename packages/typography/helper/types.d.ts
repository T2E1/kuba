export default class Helper extends HTMLElement {}

declare global {
  interface HTMLElementTagNameMap {
    'kb-helper': Helper
  }
}
