// Resolves `path` against `target` by generating and invoking a getter expression at
// runtime, so `path` may be a dot path ('a.b.c') or start with bracket notation
// ('[0].name'). Any resolution error (invalid path, missing segment) yields undefined
// instead of throwing.
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
