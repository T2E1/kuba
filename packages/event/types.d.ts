declare module '@t2e1/kuba/event' {
  /**
   * Transformation applied to an event before it reaches a decorated
   * method. Receives the raw (or previously filtered) event and returns
   * whatever value should be forwarded to the method — typically the
   * event itself, or a derived value such as `event.target.value`.
   */
  export type EventFilter = (event: Event) => unknown

  type EventBinder = (
    selector: string,
    ...filters: EventFilter[]
  ) => MethodDecorator

  /**
   * Proxy-backed map of event types to decorator factories. Accessing any
   * property (e.g. `on.click`) yields an {@link EventBinder} for that DOM
   * event type — there is no fixed list of keys, any event name works.
   */
  const on: Record<string, EventBinder>

  export default on

  /**
   * Creates a `CustomEvent` that bubbles and is cancelable by default,
   * suitable for dispatching across shadow DOM boundaries.
   *
   * @param type - The event type/name.
   * @param detail - Arbitrary payload exposed as `event.detail`.
   * @returns The constructed event, ready to be dispatched.
   * @example
   * element.dispatchEvent(customEvent('item-selected', { id: 42 }))
   */
  export function customEvent(type: string, detail?: unknown): CustomEvent

  /**
   * Reads the `dataset` of the element that received the event.
   *
   * @param event - The DOM event.
   * @returns The `data-*` attributes of `event.target`.
   * @example
   * // <button data-id="7">...</button>
   * dataset(event) // => { id: '7' }
   */
  export function dataset(event: Event): DOMStringMap

  /**
   * Reads the `detail` payload of a `CustomEvent`.
   *
   * @param event - A custom event, typically created via {@link customEvent}.
   * @returns The value passed as `detail` when the event was created.
   */
  export function detail(event: CustomEvent): unknown

  /**
   * Reads the selected files from an `<input type="file">` change event.
   *
   * @param event - The DOM event fired by a file input.
   * @returns The `FileList` from `event.target`, or `null` if none.
   */
  export function files(event: Event): FileList | null

  /**
   * Extracts a form's submitted values as a plain object, including the
   * name/value pair of the submit button that triggered the event.
   *
   * @param event - The `submit` event of a `<form>`.
   * @returns A plain object mapping field names to their submitted values.
   * @example
   * // <form><input name="email"><button name="action" value="save">Save</button></form>
   * formData(event) // => { email: '...', action: 'save' }
   */
  export function formData(
    event: SubmitEvent,
  ): Record<string, FormDataEntryValue>

  /**
   * Calls `event.preventDefault()` and returns the same event, so it can
   * be composed with other {@link EventFilter}s.
   *
   * @param event - The DOM event.
   * @returns The same event, for chaining.
   */
  export function prevent(event: Event): Event

  /**
   * Calls `event.stopPropagation()` and returns the same event, so it can
   * be composed with other {@link EventFilter}s.
   *
   * @param event - The DOM event.
   * @returns The same event, for chaining.
   */
  export function stop(event: Event): Event

  /**
   * Reads the current value of the element that received the event.
   *
   * @param event - The DOM event.
   * @returns The `value` property of `event.target`.
   */
  export function value(event: Event): string
}
