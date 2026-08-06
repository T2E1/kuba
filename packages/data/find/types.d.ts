/**
 * `<kb-find>` custom element. Finds the first record in the `value` collection exposed
 * by its parent element (e.g. `<kb-dataset>`) whose `key` field matches `value`, then
 * dispatches a `found` event on the parent with the matching record.
 *
 * @example
 * ```html
 * <kb-dataset upsert="id">
 *   <kb-find key="id" value="1"></kb-find>
 * </kb-dataset>
 * <script>
 *   const dataset = document.querySelector('kb-dataset')
 *   dataset.addEventListener('found', (event) => console.log(event.detail))
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
    'kb-find': KUBAFindElement
  }
}
