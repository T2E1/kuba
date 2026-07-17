// Single shared EventTarget acting as the cross-element event bus: every Echo
// host dispatches re-broadcast events onto it and listens on it for arcs
// sourced from other elements, decoupling emitter and receiver DOM nodes.
const target = new EventTarget()

export default target
