import execute from './execute'

/** Runs `target[method]` after `connectedCallback` fires (element inserted into the DOM). */
const connected = (target, method) =>
  execute(method).on(target).after('connectedCallback')

export default connected
