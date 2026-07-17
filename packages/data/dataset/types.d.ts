/**
 * `<k-dataset>` custom element. Holds an in-memory collection of records, keyed by the
 * field named in the `upsert` attribute, and dispatches a `change` event whenever the
 * collection is mutated via `push`, `delete`, or `reset`.
 *
 * @example
 * ```html
 * <k-dataset upsert="id"></k-dataset>
 * <script>
 *   const dataset = document.querySelector('k-dataset')
 *   dataset.addEventListener('change', (event) => console.log(event.detail))
 *   dataset.push({ id: 1, name: 'Ada' })
 * </script>
 * ```
 */
export default class KUBADatasetElement extends HTMLElement {
  /**
   * Name of the record field used as the unique key when merging records via `push`.
   * Reflects the `upsert` attribute.
   */
  upsert: string

  /** Current collection of stored records, in insertion order. */
  readonly value: unknown[]

  /**
   * Removes the record whose upsert-key value matches `key`. Dispatches `change`.
   *
   * @param key - Value of the upsert key identifying the record to remove.
   * @returns This element, for chaining.
   */
  delete(key: unknown): this

  /**
   * Inserts or merges one or more records into the collection. Records sharing an
   * existing upsert-key value are merged into the stored record rather than duplicated.
   * Dispatches `change`.
   *
   * @param data - A single record, or an array of records, to add/merge.
   * @returns This element, for chaining.
   */
  push(data: unknown): this

  /**
   * Clears all stored records. Dispatches `change`.
   *
   * @returns This element, for chaining.
   */
  reset(): this
}

declare global {
  interface HTMLElementTagNameMap {
    'k-dataset': KUBADatasetElement
  }
}
