declare module '@t2e1/kuba/directive' {
  /**
   * Method decorator: runs the decorated method after `adoptedCallback`
   * fires, i.e. when the custom element is moved into a new document
   * (e.g. via `document.adoptNode`).
   *
   * @example
   * ```ts
   * class MyElement extends HTMLElement {
   *   @adopted
   *   onAdopted() {
   *     console.log('moved to a new document')
   *   }
   * }
   * ```
   */
  export const adopted: MethodDecorator

  /**
   * Method decorator: runs the decorated method after `connectedCallback`
   * fires, i.e. when the custom element is inserted into the DOM.
   *
   * @example
   * ```ts
   * class MyElement extends HTMLElement {
   *   @connected
   *   onConnected() {
   *     console.log('inserted into the DOM')
   *   }
   * }
   * ```
   */
  export const connected: MethodDecorator

  /**
   * Method decorator: runs the decorated method after `disconnectedCallback`
   * fires, i.e. when the custom element is removed from the DOM.
   *
   * @example
   * ```ts
   * class MyElement extends HTMLElement {
   *   @disconnected
   *   onDisconnected() {
   *     console.log('removed from the DOM')
   *   }
   * }
   * ```
   */
  export const disconnected: MethodDecorator

  /**
   * Method decorator: runs the decorated method after
   * `formAssociatedCallback` fires, i.e. when the custom element becomes
   * associated with a form. Requires the class to declare
   * `static formAssociated = true`.
   *
   * @example
   * ```ts
   * class MyElement extends HTMLElement {
   *   static formAssociated = true
   *
   *   @formAssociated
   *   onFormAssociated(form: HTMLFormElement | null) {
   *     console.log('associated with form', form)
   *   }
   * }
   * ```
   */
  export const formAssociated: MethodDecorator

  /**
   * Method decorator: runs the decorated method after `formDisabledCallback`
   * fires, i.e. when the enclosing `fieldset`'s disabled state changes.
   * Requires the class to declare `static formAssociated = true`.
   *
   * @example
   * ```ts
   * class MyElement extends HTMLElement {
   *   static formAssociated = true
   *
   *   @formDisabled
   *   onFormDisabled(disabled: boolean) {
   *     console.log('disabled state changed to', disabled)
   *   }
   * }
   * ```
   */
  export const formDisabled: MethodDecorator

  /**
   * Method decorator: runs the decorated method after `formResetCallback`
   * fires, i.e. when the owning form is reset. Requires the class to
   * declare `static formAssociated = true`.
   *
   * @example
   * ```ts
   * class MyElement extends HTMLElement {
   *   static formAssociated = true
   *
   *   @formReset
   *   onFormReset() {
   *     console.log('form was reset')
   *   }
   * }
   * ```
   */
  export const formReset: MethodDecorator

  /**
   * Method decorator: runs the decorated method after
   * `formStateRestoreCallback` fires, i.e. when the browser restores
   * previously saved form state (e.g. after navigation or a crash
   * recovery). Requires the class to declare
   * `static formAssociated = true`.
   *
   * @example
   * ```ts
   * class MyElement extends HTMLElement {
   *   static formAssociated = true
   *
   *   @formStateRestore
   *   onFormStateRestore(state: unknown, reason: 'restore' | 'autocomplete') {
   *     console.log('restoring state', state, reason)
   *   }
   * }
   * ```
   */
  export const formStateRestore: MethodDecorator

  /**
   * Class decorator: registers the decorated class in the custom elements
   * registry under `name`. Safe to apply more than once with the same
   * `name` — an existing registration is left untouched.
   *
   * @param name - Tag name to register (must contain a hyphen, per the
   * Custom Elements spec).
   * @param options - Passed through to `customElements.define`, e.g.
   * `{ extends: 'button' }` for customized built-in elements.
   *
   * @example
   * ```ts
   * @define('my-element')
   * class MyElement extends HTMLElement {}
   * ```
   */
  export function define(
    name: string,
    options?: ElementDefinitionOptions,
  ): ClassDecorator

  /**
   * Property decorator: keeps the decorated property in sync with the
   * value of `attribute`. Adds `attribute` to `observedAttributes` and,
   * on every `attributeChangedCallback` for that attribute, assigns the raw
   * string value — piped through `filters` in order, left to right —
   * to the property.
   *
   * @param attribute - Name of the observed HTML attribute.
   * @param filters - Functions applied in sequence to convert the raw
   * string attribute value (e.g. `booleanAttribute`, `resizing`) before
   * assignment. With no filters, the raw string is assigned as-is.
   *
   * @example
   * ```ts
   * class MyElement extends HTMLElement {
   *   @attributeChanged('disabled', booleanAttribute)
   *   disabled: boolean
   * }
   * ```
   */
  export function attributeChanged(
    attribute: string,
    ...filters: Array<(value: string) => unknown>
  ): MethodDecorator

  /**
   * `attributeChanged` filter: converts an HTML boolean-attribute string
   * into a `boolean`, following standard boolean-attribute semantics —
   * `null` (attribute absent), `"false"` and `"0"` are `false`; any other
   * value (including `""`, as in `<el disabled>`) is `true`.
   *
   * @param value - Raw attribute value, or `null` when the attribute is
   * absent.
   * @returns The resolved boolean value.
   */
  export function booleanAttribute(value: string | null): boolean

  /**
   * `attributeChanged` filter: normalizes a sizing keyword/value into a
   * CSS length. `"hug"` becomes `"auto"`, `"fill"` becomes `"100%"`,
   * numeric px/% values (e.g. `"200px"`, `"50%"`) pass through unchanged,
   * and any other value defaults to `"auto"`.
   *
   * @param value - Raw attribute value.
   * @returns A valid CSS length string.
   */
  export function resizing(value: string): string

  /**
   * Low-level helper that wraps a custom element lifecycle callback (named
   * by `event`, e.g. `"connectedCallback"`) in a proxy so that
   * `target[method]` runs immediately after it, without overwriting any
   * pre-existing implementation. Powers `connected`, `disconnected`,
   * `adopted`, `formAssociated`, `formDisabled`, `formReset` and
   * `formStateRestore`; exposed for building custom lifecycle decorators.
   *
   * @param method - Name of the method to invoke after the lifecycle
   * callback runs.
   *
   * @example
   * ```ts
   * execute('onConnected').on(MyElement.prototype).after('connectedCallback')
   * ```
   */
  export function execute(method: string): {
    on(target: object): {
      after(event: string): void
    }
  }
}
