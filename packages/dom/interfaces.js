// Symbol.for (global registry) so multiple bundled copies of this package
// still agree on the same key when checking whether an element already
// painted. The callback symbols below are module-local by design.
export const isPainted = Symbol.for('isPainted')
export const didPaintCallback = Symbol('didPaintCallback')
export const htmlCallback = Symbol('htmlCallback')
export const cssCallback = Symbol('cssCallback')
export const willPaintCallback = Symbol('willPaintCallback')
