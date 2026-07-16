export default class Render extends HTMLElement {
  readonly textContent: string
  readonly internals: ElementInternals
  render(data: unknown | unknown[]): this
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-render': Render
  }
}
