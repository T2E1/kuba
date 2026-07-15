const css = (strings, ...values) => {
  const styleSheet = new CSSStyleSheet()
  const text = String.raw({ raw: strings }, ...values)
  styleSheet.replaceSync(text)
  return styleSheet
}

export default css
