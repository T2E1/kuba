// biome-ignore lint/suspicious/noExplicitAny: mixin constructor type requires any[] per TS handbook
type Constructor<T = HTMLElement> = new (...args: any[]) => T

interface HiddenInstance {
  hidden: boolean
}

declare function Hidden<T extends Constructor>(
  Base: T,
): T & Constructor<HiddenInstance>

export default Hidden
