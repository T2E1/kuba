function resizing(value) {
  if (/^[0-9]+(%|px)$/.test(value)) return value
  if (/^hug$/i.test(value)) return 'auto'
  if (/^fill$/i.test(value)) return '100%'
  return 'auto'
}

export default resizing
