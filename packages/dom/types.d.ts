export type ComponentTemplate = (target: HTMLElement) => string
export type StyleTemplate = (target: HTMLElement) => CSSStyleSheet

export declare function html(
  strings: TemplateStringsArray,
  ...values: unknown[]
): string

export declare function css(
  strings: TemplateStringsArray,
  ...values: unknown[]
): CSSStyleSheet

export declare function paint(
  component: ComponentTemplate,
  ...styles: StyleTemplate[]
): ClassDecorator

export declare const didPaint: MethodDecorator
export declare const willPaint: MethodDecorator
export declare const repaint: MethodDecorator
export declare const retouch: MethodDecorator
