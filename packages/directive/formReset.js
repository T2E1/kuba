import execute from './execute'

/** Runs `target[method]` after `formResetCallback` fires (the owning form is reset). Requires `static formAssociated = true` on the element. */
const formReset = (target, method) =>
  execute(method).on(target).after('formResetCallback')

export default formReset
