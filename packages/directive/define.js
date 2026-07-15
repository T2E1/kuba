const define = (name, options) => (target) =>
  customElements.get(name) ?? customElements.define(name, target, options)

export default define
