declare module '@t2e1/kuba/middleware' {
  export function after(method: string): MethodDecorator
  export function around(method: string): MethodDecorator
  export function before(method: string): MethodDecorator
}
