declare module '@t2e1/kuba/echo' {
  // biome-ignore lint/suspicious/noExplicitAny: mixin constructor type requires any[] per TS handbook
  type Constructor<T = HTMLElement> = new (...args: any[]) => T

  /**
   * Mixin that turns a custom element into an "Echo" host, capable of
   * declaratively wiring events between unrelated elements on the page via
   * a shared, in-memory event bus.
   *
   * The mixin adds `on` to `observedAttributes` and reacts to changes on
   * that attribute by parsing its value as a whitespace-free **arc string**
   * and (re)establishing the corresponding subscription.
   *
   * Arc string grammar:
   * ```
   * source/event:type/sink[|filterName=value[|filterName=value...]]
   * ```
   * - `source` — which emitting element(s) this arc listens to. One of:
   *   - `*` — any element
   *   - `#id` — element whose `id` attribute matches
   *   - a bare name — element whose `name` attribute matches
   *   - a bare tag name — element whose tag name matches
   * - `event` — the event name to listen for on the bus (e.g. `change`).
   * - `type` — how `sink` is applied on the host, one of:
   *   - `method` — calls `this[sink](payload)`
   *   - `attribute` — calls `this.setAttribute(sink, payload)`
   *   - `setter` — assigns `this[sink] = payload`
   * - `sink` — the method name, attribute name, or property name to target.
   * - `filters` (optional) — a `|`-separated list of `name=value` pairs.
   *   Each `name` is resolved to a transform function and applied, in
   *   declaration order, to the event's detail payload before it reaches
   *   `sink`.
   *
   * @example
   * ```html
   * <!-- Whenever any element with id="panel" dispatches a "change" event,
   *      call `refresh(payload)` on this host. -->
   * <my-widget on="#panel/change:method/refresh"></my-widget>
   * ```
   *
   * @param Base - The custom element class (or mixin chain) to extend.
   * @returns A subclass of `Base` with arc-based event wiring behavior.
   */
  function Echo<T extends Constructor>(Base: T): T

  export default Echo

  /**
   * Method/accessor decorator that re-dispatches the decorated setter's new
   * value, or the decorated method's return value, as a bubbling, composed
   * `CustomEvent` named `eventName` once the host is connected to the DOM.
   *
   * Intended to make a property or method observable through Echo's arc
   * wiring without manually calling `dispatchEvent` in the implementation.
   *
   * @param eventName - The event type to dispatch after the setter/method runs.
   * @returns A method decorator to apply to a class setter or method.
   */
  export function dispatchEvent(eventName: string): MethodDecorator

  /** Name of the observed attribute that carries an element's arc wiring string. */
  export const on: 'on'

  /**
   * Well-known symbol key reserved for a host's "connected" lifecycle hook.
   * Not invoked automatically by {@link Echo} — available for other mixins/
   * hosts that want a shared, collision-free hook name.
   */
  export const echoConnectedCallback: unique symbol

  /**
   * Well-known symbol key reserved for a host's "disconnected" lifecycle hook.
   * Not invoked automatically by {@link Echo} — available for other mixins/
   * hosts that want a shared, collision-free hook name.
   */
  export const echoDisconnectedCallback: unique symbol
}
