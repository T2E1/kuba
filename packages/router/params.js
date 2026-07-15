const params = (path) => {
  if (!path) return

  const rule = path.replace(/:(\w+)/g, '(?<$1>[a-z0-9-_]+)')
  const pattern = new RegExp(`^${rule}$`, 'i')
  const match = globalThis.location.pathname.match(pattern)

  Object.keys(params).forEach((key) => delete params[key])

  if (match?.groups) {
    Object.entries(match.groups).forEach(([key, value]) => {
      Reflect.set(params, key, value)
    })
  }
}

export default params
