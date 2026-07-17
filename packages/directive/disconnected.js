import execute from './execute'

/** Runs `target[method]` after `disconnectedCallback` fires (element removed from the DOM). */
const disconnected = (target, method) =>
  execute(method).on(target).after('disconnectedCallback')

export default disconnected
