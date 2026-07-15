export function prop(target, path) {
  try {
    return new Function(
      'target',
      `return target${/\[/.test(path) ? '' : '.'}${path}`,
    )(target)
  } catch (_) {
    return undefined
  }
}
