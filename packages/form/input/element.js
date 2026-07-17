import { isPainted } from '@dom/interfaces'

/**
 * Wraps the host `<kb-input>` in a `Proxy` that transparently reads/writes
 * either the host itself (before first paint) or its shadow-rendered
 * `<input>` element (after paint), so properties can be set on the host
 * before the shadow DOM exists without losing them once it does.
 */
const element = {
  from(input) {
    function get(target, key) {
      if (!input[isPainted]) return target[key]

      if (/^(style|value|validationMessage|validity)$/i.test(key)) {
        return input.shadowRoot.querySelector('input')[key]
      }

      return input.shadowRoot.querySelector('input').getAttribute(key)
    }

    function set(target, key, value) {
      if (!input[isPainted]) {
        target[key] = value
        return true
      }

      if (/^(value)$/i.test(key)) {
        input.shadowRoot.querySelector('input')[key] = value || ''
        return true
      }

      return value
        ? input.shadowRoot.querySelector('input').setAttribute(key, value)
        : input.shadowRoot.querySelector('input').removeAttribute(key)
    }

    return new Proxy({}, { get, set })
  },
}

export default element
