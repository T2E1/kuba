import Headless from './headless/types'
import Hidden from './hidden/types'

// biome-ignore lint/suspicious/noExplicitAny: mixin constructor type requires any[] per TS handbook
type Constructor<T = HTMLElement> = new (...args: any[]) => T

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

declare function Height<T extends Constructor>(
  Base: T,
): T & Constructor<HeightInstance>

declare function Width<T extends Constructor>(
  Base: T,
): T & Constructor<WidthInstance>

declare function Value<T extends Constructor>(
  Base: T,
): T & Constructor<ValueInstance>

declare function Template<T extends Constructor>(
  Base: T,
): T & Constructor<TemplateInstance>

export { Headless, Height, Hidden, Template, Value, Width }
