const html = (strings, ...values) => {
  return String.raw(
    { raw: strings },
    ...values.map((value) => [].concat(value).join('')),
  )
}

export default html
