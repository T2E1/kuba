export default class Redirect extends HTMLElement {
  href: string
  route: string
  go(params?: Record<string, string>): this
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-redirect': Redirect
  }
}
