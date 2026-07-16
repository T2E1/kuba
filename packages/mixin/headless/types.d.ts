// biome-ignore lint/suspicious/noExplicitAny: mixin constructor type requires any[] per TS handbook
type Constructor<T = HTMLElement> = new (...args: any[]) => T

declare function Headless<T extends Constructor>(Base: T): T

export default Headless
