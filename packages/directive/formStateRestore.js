import execute from './execute'

/** Runs `target[method]` after `formStateRestoreCallback` fires (browser restores previously saved form state, e.g. after navigation). Requires `static formAssociated = true` on the element. */
const formStateRestore = (target, method) =>
  execute(method).on(target).after('formStateRestoreCallback')

export default formStateRestore
