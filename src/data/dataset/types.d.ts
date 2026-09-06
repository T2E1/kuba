/**
 * Shape of the `on` attribute of {@link KUBADatasetElement} — an arc string
 * in the form `source/event:type/sink`, optionally followed by one or more
 * `|filter=value` pairs. Inherited from the `Echo` mixin.
 *
 * This only constrains the shape (the four `/`/`:`-separated segments and
 * the `type` segment); `source`, `event`, `sink`, and filter contents remain
 * free-form strings, since TypeScript cannot validate the full grammar (e.g.
 * arbitrary characters, filter repetition) through a template literal type.
 * The check only applies to string literals — a value assigned from a plain
 * `string` variable falls back to unchecked `string`.
 */
type KUBADatasetOnAttributeSink = 'method' | 'attribute' | 'setter'

type KUBADatasetOnAttribute =
  `${string}/${string}:${KUBADatasetOnAttributeSink}/${string}${'' | `|${string}`}`

/**
 * `<kb-dataset>` custom element. Holds an in-memory collection of records, keyed by the
 * field named in the `upsert` attribute, and dispatches a `changed` event whenever the
 * collection is mutated via `push`, `delete`, or `reset`.
 *
 * @example
 * ```html
 * <kb-dataset upsert="id"></kb-dataset>
 * <script>
 *   const dataset = document.querySelector('kb-dataset')
 *   dataset.addEventListener('changed', (event) => console.log(event.detail))
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
   * Removes the record whose upsert-key value matches `key`. Dispatches `changed`.
   *
   * @param key - Value of the upsert key identifying the record to remove.
   * @returns This element, for chaining.
   */
  delete(key: unknown): this

  /**
   * Arc string wiring an event from another element to this element, in the
   * form `source/event:type/sink` (see {@link KUBADatasetOnAttribute}).
   * Inherited from the `Echo` mixin. Reflects the `on` attribute.
   * @default undefined
   * @example
   * ```ts
   * element.on = '#panel/changed:method/push' // ok
   * ```
   */
  on: KUBADatasetOnAttribute | (string & {})

  /**
   * Inserts or merges one or more records into the collection. Records sharing an
   * existing upsert-key value are merged into the stored record rather than duplicated.
   * Dispatches `changed`.
   *
   * @param data - A single record, or an array of records, to add/merge.
   * @returns This element, for chaining.
   */
  push(data: unknown): this

  /**
   * Clears all stored records. Dispatches `changed`.
   *
   * @returns This element, for chaining.
   */
  reset(): this
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-dataset': KUBADatasetElement
  }
}
