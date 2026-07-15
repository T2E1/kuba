const args = () => {
  const search = new URLSearchParams(globalThis.location.search).entries()
  Object.keys(args).forEach((key) => delete args[key])
  Array.from(search).forEach(([key, value]) => Reflect.set(args, key, value))
}

export default args
