import execute from './execute'

const formDisabled = (target, method) =>
  execute(method).on(target).after('formDisabledCallback')

export default formDisabled
