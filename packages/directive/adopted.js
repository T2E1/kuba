import execute from './execute'

/** Runs `target[method]` after `adoptedCallback` fires (element moved to a new document). */
const adopted = (target, method) =>
  execute(method).on(target).after('adoptedCallback')

export default adopted
