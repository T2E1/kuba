import execute from './execute'

const disconnected = (target, method) =>
  execute(method).on(target).after('disconnectedCallback')

export default disconnected
