// Tagged template: builds the CSS text via String.raw and compiles it into a
// constructable CSSStyleSheet synchronously (replaceSync), so the result is
// ready for adoptedStyleSheets without waiting on parsing/loading.
const css = (strings, ...values) => {
  const styleSheet = new CSSStyleSheet()
  const text = String.raw({ raw: strings }, ...values)
  styleSheet.replaceSync(text)
  return styleSheet
}

export default css
