declare module '@t2e1/kuba/mixin' {
  // biome-ignore lint/suspicious/noExplicitAny: mixin constructor type requires any[] per TS handbook
  type Constructor<T = HTMLElement> = new (...args: any[]) => T

  interface HeadlessInstance {}

  interface HiddenInstance {
    hidden: boolean
  }

  interface HeightInstance {
    height: string
  }

  interface WidthInstance {
    width: string
  }

  interface ValueInstance {
    value: string | undefined
  }

  interface TemplateInstance {
    template: string
  }

  function Headless<T extends Constructor>(
    Base: T,
  ): T & Constructor<HeadlessInstance>

  function Hidden<T extends Constructor>(
    Base: T,
  ): T & Constructor<HiddenInstance>

  function Height<T extends Constructor>(
    Base: T,
  ): T & Constructor<HeightInstance>

  function Width<T extends Constructor>(Base: T): T & Constructor<WidthInstance>

  function Value<T extends Constructor>(Base: T): T & Constructor<ValueInstance>

  function Template<T extends Constructor>(
    Base: T,
  ): T & Constructor<TemplateInstance>

  export { Headless, Height, Hidden, Template, Value, Width }
}
