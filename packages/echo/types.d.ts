declare module '@t2e1/kuba/echo' {
  // biome-ignore lint/suspicious/noExplicitAny: mixin constructor type requires any[] per TS handbook
  type Constructor<T = HTMLElement> = new (...args: any[]) => T

  function Echo<T extends Constructor>(Base: T): T

  export default Echo

  export function dispatchEvent(eventName: string): MethodDecorator

  export const on: 'on'
  export const echoConnectedCallback: unique symbol
  export const echoDisconnectedCallback: unique symbol
}
