// Treats the strings 'no', 'false', '0', and null as falsy; everything else (including
// empty string, 0, undefined) is truthy. Useful for evaluating string-based condition values.
export function truthy(value) {
  if (value === 'no') return false
  if (value === 'false') return false
  if (value === '0') return false
  if (value === null) return false
  return true
}
