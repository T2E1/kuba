declare module '@t2e1/kuba/dom' {
  /**
   * A function that renders a component's markup for a given host element.
   * Invoked by `paint` on every (re)render pass; its return value is written
   * into the element's shadow root (or the element itself when it has none).
   *
   * @param target - The host element being rendered.
   * @returns The HTML markup to render, typically produced with `html`.
   */
  export type ComponentTemplate = (target: HTMLElement) => string

  /**
   * A function that produces the stylesheet applied to a given host element.
   * Invoked by `paint` alongside the component template; its result is
   * adopted via `adoptedStyleSheets`.
   *
   * @param target - The host element being styled.
   * @returns The stylesheet to adopt, typically produced with `css`.
   */
  export type StyleTemplate = (target: HTMLElement) => CSSStyleSheet

  /**
   * Tagged template literal for building HTML markup. Interpolated array
   * values are flattened and joined (e.g. lists of child templates), rather
   * than being stringified with commas.
   *
   * @param strings - The literal string segments of the template.
   * @param values - The interpolated values, in order.
   * @returns The resulting HTML markup as a string.
   * @example
   * ```ts
   * const items = ['<li>A</li>', '<li>B</li>']
   * const markup = html`<ul>${items}</ul>`
   * // '<ul><li>A</li><li>B</li></ul>'
   * ```
   */
  export function html(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): string

  /**
   * Tagged template literal for building a stylesheet. Compiles the
   * resulting CSS text into a constructable `CSSStyleSheet`, ready to be
   * assigned to `adoptedStyleSheets`.
   *
   * @param strings - The literal string segments of the template.
   * @param values - The interpolated values, in order.
   * @returns A `CSSStyleSheet` compiled from the template's CSS text.
   * @example
   * ```ts
   * const sheet = css`:host { display: block; color: ${color}; }`
   * ```
   */
  export function css(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): CSSStyleSheet

  /**
   * Class decorator that wires a custom element up to render markup and
   * styles on connect. Patches `connectedCallback` so that, once the
   * element connects, the given component template and style templates are
   * rendered and their results assigned to the element's shadow root (or the
   * element itself when it has none).
   *
   * @param component - Produces the element's markup.
   * @param styles - Produces the stylesheets to adopt, in order.
   * @returns A class decorator to apply to a custom element class.
   * @example
   * ```ts
   * @paint(({ name }) => html`<p>Hello, ${name}</p>`, theme)
   * class Greeting extends HTMLElement {}
   * ```
   */
  export function paint(
    component: ComponentTemplate,
    ...styles: StyleTemplate[]
  ): ClassDecorator

  /**
   * Method decorator that runs the decorated method after the element has
   * finished its first paint (i.e. after markup and styles have both been
   * applied for the initial render).
   *
   * @example
   * ```ts
   * class Greeting extends HTMLElement {
   *   @didPaint
   *   logReady() {
   *     console.log('rendered')
   *   }
   * }
   * ```
   */
  export const didPaint: MethodDecorator

  /**
   * Method decorator that runs the decorated method immediately before the
   * element's first paint (i.e. before markup and styles are applied for
   * the initial render).
   *
   * @example
   * ```ts
   * class Greeting extends HTMLElement {
   *   @willPaint
   *   prepare() {
   *     this.state = 'loading'
   *   }
   * }
   * ```
   */
  export const willPaint: MethodDecorator

  /**
   * Method/accessor decorator that re-renders both markup and styles after
   * the decorated setter or method runs, but only once the element has
   * already completed its initial paint. Use on properties whose changes
   * should trigger a full re-render.
   *
   * @example
   * ```ts
   * class Greeting extends HTMLElement {
   *   @repaint
   *   set name(value) {
   *     this._name = value
   *   }
   * }
   * ```
   */
  export const repaint: MethodDecorator

  /**
   * Method/accessor decorator that re-applies only the stylesheets after the
   * decorated setter or method runs, but only once the element has already
   * completed its initial paint. Use on properties that affect styling but
   * not markup, to avoid a full re-render.
   *
   * @example
   * ```ts
   * class Greeting extends HTMLElement {
   *   @retouch
   *   set theme(value) {
   *     this._theme = value
   *   }
   * }
   * ```
   */
  export const retouch: MethodDecorator
}
