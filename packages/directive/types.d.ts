export declare const adopted: MethodDecorator
export declare const connected: MethodDecorator
export declare const disconnected: MethodDecorator
export declare const formAssociated: MethodDecorator
export declare const formDisabled: MethodDecorator
export declare const formReset: MethodDecorator
export declare const formStateRestore: MethodDecorator

export declare function define(
  name: string,
  options?: ElementDefinitionOptions,
): ClassDecorator

export declare function attributeChanged(
  attribute: string,
  ...filters: Array<(value: string) => unknown>
): MethodDecorator

export declare function booleanAttribute(value: string | null): boolean
export declare function resizing(value: string): string

export declare function execute(method: string): {
  on(target: object): {
    after(event: string): void
  }
}
