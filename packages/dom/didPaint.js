import execute from './execute'
import { didPaintCallback } from './interfaces'

const didPaint = (target, method) =>
  execute(method).on(target).after(didPaintCallback)

export default didPaint
