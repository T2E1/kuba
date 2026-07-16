export default class Dataset extends HTMLElement {
  upsert: string
  readonly value: unknown[]
  delete(key: unknown): this
  push(data: unknown): this
  reset(): this
}

declare global {
  interface HTMLElementTagNameMap {
    'k-dataset': Dataset
  }
}
