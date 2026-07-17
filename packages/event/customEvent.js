// Bubbles and is cancelable by default so it behaves like native DOM events
// when dispatched from within a shadow-DOM component tree.
const customEvent = (type, detail) =>
  new CustomEvent(type, {
    bubbles: true,
    cancelable: true,
    detail,
  })

export default customEvent
