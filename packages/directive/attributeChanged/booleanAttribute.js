function booleanAttribute(value) {
  if (value === 'false') return false
  if (value === '0') return false
  if (value === null) return false
  return true
}

export default booleanAttribute
