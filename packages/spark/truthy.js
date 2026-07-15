export function truthy(value) {
  if (value === 'no') return false
  if (value === 'false') return false
  if (value === '0') return false
  if (value === null) return false
  return true
}
