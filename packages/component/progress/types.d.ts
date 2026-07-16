export default class Progress extends HTMLElement {
  value: string
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-progress': Progress
  }
}
