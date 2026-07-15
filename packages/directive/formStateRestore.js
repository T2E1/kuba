import execute from './execute'

const formStateRestore = (target, method) =>
  execute(method).on(target).after('formStateRestoreCallback')

export default formStateRestore
