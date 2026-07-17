import execute from './execute'

/** Runs `target[method]` after `formAssociatedCallback` fires (element linked to a form). Requires `static formAssociated = true` on the element. */
const formAssociated = (target, method) =>
  execute(method).on(target).after('formAssociatedCallback')

export default formAssociated
