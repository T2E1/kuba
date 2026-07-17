// Tagged template: each interpolated value is coerced through `[].concat`
// before joining, so arrays (e.g. a list of child template results) are
// flattened into the markup instead of rendering as "value1,value2" via
// naive toString().
const html = (strings, ...values) => {
  return String.raw(
    { raw: strings },
    ...values.map((value) => [].concat(value).join('')),
  )
}

export default html
