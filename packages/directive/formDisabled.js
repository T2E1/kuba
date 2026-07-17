import execute from './execute'

/** Runs `target[method]` after `formDisabledCallback` fires (enclosing fieldset's disabled state changes). Requires `static formAssociated = true` on the element. */
const formDisabled = (target, method) =>
  execute(method).on(target).after('formDisabledCallback')

export default formDisabled
