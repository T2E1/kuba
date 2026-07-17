/** Registers `target` as `name` in the custom elements registry, skipping re-registration if `name` is already defined (safe against duplicate module evaluation). */
const define = (name, options) => (target) =>
  customElements.get(name) ?? customElements.define(name, target, options)

export default define
