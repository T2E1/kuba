declare module '@t2e1/kuba/directive' {
  export const adopted: MethodDecorator
  export const connected: MethodDecorator
  export const disconnected: MethodDecorator
  export const formAssociated: MethodDecorator
  export const formDisabled: MethodDecorator
  export const formReset: MethodDecorator
  export const formStateRestore: MethodDecorator

  export function define(
    name: string,
    options?: ElementDefinitionOptions,
  ): ClassDecorator

  export function attributeChanged(
    attribute: string,
    ...filters: Array<(value: string) => unknown>
  ): MethodDecorator

  export function booleanAttribute(value: string | null): boolean
  export function resizing(value: string): string

  export function execute(method: string): {
    on(target: object): {
      after(event: string): void
    }
  }
}
