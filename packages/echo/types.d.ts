// biome-ignore lint/suspicious/noExplicitAny: mixin constructor type requires any[] per TS handbook
type Constructor<T = HTMLElement> = new (...args: any[]) => T

declare function Echo<T extends Constructor>(Base: T): T

export default Echo

export declare function dispatchEvent(eventName: string): MethodDecorator

export declare const on: 'on'
export declare const echoConnectedCallback: unique symbol
export declare const echoDisconnectedCallback: unique symbol
