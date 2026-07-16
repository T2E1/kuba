export default class Cover extends HTMLElement {
  alt: string
  orientation: 'landscape' | 'portrait'
  src: string
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-cover': Cover
  }
}
