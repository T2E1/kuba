declare module '@t2e1/kuba/mixin' {
  // biome-ignore lint/suspicious/noExplicitAny: mixin constructor type requires any[] per TS handbook
  type Constructor<T = HTMLElement> = new (...args: any[]) => T

  /** Instance shape added by {@link Headless}. */
  interface HeadlessInstance {}

  /** Instance shape added by {@link Hidden}. */
  interface HiddenInstance {
    /** Whether the element is hidden. Reflects the `hidden` attribute. */
    hidden: boolean
  }

  /** Instance shape added by {@link Height}. */
  interface HeightInstance {
    /** CSS height applied to the element. Reflects the `height` attribute; defaults to `"auto"`. */
    height: string
  }

  /** Instance shape added by {@link Width}. */
  interface WidthInstance {
    /** CSS width applied to the element. Reflects the `width` attribute; defaults to `"auto"`. */
    width: string
  }

  /** Instance shape added by {@link Value}. */
  interface ValueInstance {
    /** Current value of the element. Reflects the `value` attribute. */
    value: string | undefined
  }

  /** Instance shape added by {@link Template}. */
  interface TemplateInstance {
    /** Resolved markup: the `innerHTML` of the referenced `<template>`, or the concatenated `outerHTML` of its children. */
    template: string
  }

  /**
   * Hides the host element by setting `display: none` on it once the
   * element is connected to the DOM.
   *
   * @param Base - The class to extend.
   * @returns `Base` extended with headless (always-hidden) behavior.
   * @example
   * class MyElement extends Headless(HTMLElement) {}
   */
  function Headless<T extends Constructor>(
    Base: T,
  ): T & Constructor<HeadlessInstance>

  /**
   * Adds a `hidden` property, reflected from/to the `hidden` attribute, that
   * also toggles a `hidden` custom state on `ElementInternals.states`.
   *
   * @param Base - The class to extend.
   * @returns `Base` extended with a reactive `hidden` property.
   * @example
   * class MyElement extends Hidden(HTMLElement) {}
   * const el = new MyElement()
   * el.hidden = true
   */
  function Hidden<T extends Constructor>(
    Base: T,
  ): T & Constructor<HiddenInstance>

  /**
   * Adds a `height` property reflected from/to the `height` attribute.
   * Defaults to `"auto"` until explicitly set.
   *
   * @param Base - The class to extend.
   * @returns `Base` extended with a reactive `height` property.
   * @example
   * class MyElement extends Height(HTMLElement) {}
   * const el = new MyElement()
   * el.height = '100px'
   */
  function Height<T extends Constructor>(
    Base: T,
  ): T & Constructor<HeightInstance>

  /**
   * Adds a `width` property reflected from/to the `width` attribute.
   * Defaults to `"auto"` until explicitly set.
   *
   * @param Base - The class to extend.
   * @returns `Base` extended with a reactive `width` property.
   * @example
   * class MyElement extends Width(HTMLElement) {}
   * const el = new MyElement()
   * el.width = '50%'
   */
  function Width<T extends Constructor>(Base: T): T & Constructor<WidthInstance>

  /**
   * Adds a `value` property reflected from/to the `value` attribute.
   *
   * @param Base - The class to extend.
   * @returns `Base` extended with a reactive `value` property.
   * @example
   * class MyElement extends Value(HTMLElement) {}
   * const el = new MyElement()
   * el.value = 'hello'
   */
  function Value<T extends Constructor>(Base: T): T & Constructor<ValueInstance>

  /**
   * Adds a `template` property, backed by the `template` attribute (an id
   * reference to a `<template>` element), that resolves to the markup of
   * the element's own `<template>` child.
   *
   * @param Base - The class to extend.
   * @returns `Base` extended with a `template` property.
   * @example
   * class MyElement extends Template(HTMLElement) {}
   * const el = new MyElement()
   * console.log(el.template)
   */
  function Template<T extends Constructor>(
    Base: T,
  ): T & Constructor<TemplateInstance>

  export { Headless, Height, Hidden, Template, Value, Width }
}
