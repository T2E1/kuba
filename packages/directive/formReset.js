import execute from './execute'

const formReset = (target, method) =>
  execute(method).on(target).after('formResetCallback')

export default formReset
