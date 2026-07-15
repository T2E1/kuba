const interpolate = (text, data) =>
  text.replace(/\{(.*?)\}/g, (_, namespace) => {
    if (namespace === '') return data
    return new Function('data', `return data.${namespace}`)(data)
  })

export default interpolate
