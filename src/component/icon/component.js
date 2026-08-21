// Renders `icon.use` verbatim as the element's text content: the Material
// Symbols font resolves ligature names (e.g. "home") to glyphs, so no
// markup wrapper is needed.
function component(icon) {
  return icon.use
}

export default component
