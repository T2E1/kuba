import { isPainted } from '@dom/interfaces'

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
