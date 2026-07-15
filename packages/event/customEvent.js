const customEvent = (type, detail) =>
  new CustomEvent(type, {
    bubbles: true,
    cancelable: true,
    detail,
  })

export default customEvent
