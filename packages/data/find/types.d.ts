/**
 * `<k-find>` custom element. Finds the first record in the `value` collection exposed
 * by its parent element (e.g. `<k-dataset>`) whose `key` field matches `value`, then
 * dispatches a `find` event on the parent with the matching record.
 *
 * @example
 * ```html
 * <k-dataset upsert="id">
 *   <k-find key="id" value="1"></k-find>
 * </k-dataset>
 * <script>
 *   const dataset = document.querySelector('k-dataset')
 *   dataset.addEventListener('find', (event) => console.log(event.detail))
 * </script>
 * ```
 */
export default class KUBAFindElement extends HTMLElement {
  /** Name of the record field to compare against `value`. Reflects the `key` attribute. */
  key: string

  /**
   * Value each record's `key` field is compared against (triggers search on set).
   * Reflects the `value` attribute.
   */
  value: string
}

declare global {
  interface HTMLElementTagNameMap {
    'k-find': KUBAFindElement
  }
}
