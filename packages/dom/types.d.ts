declare module '@t2e1/kuba/dom' {
  export type ComponentTemplate = (target: HTMLElement) => string
  export type StyleTemplate = (target: HTMLElement) => CSSStyleSheet

  export function html(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): string

  export function css(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): CSSStyleSheet

  export function paint(
    component: ComponentTemplate,
    ...styles: StyleTemplate[]
  ): ClassDecorator

  export const didPaint: MethodDecorator
  export const willPaint: MethodDecorator
  export const repaint: MethodDecorator
  export const retouch: MethodDecorator
}
