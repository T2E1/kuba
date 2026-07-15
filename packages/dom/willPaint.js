import execute from './execute'
import { willPaintCallback } from './interfaces'

const willPaint = (target, method) =>
  execute(method).on(target).after(willPaintCallback)

export default willPaint
