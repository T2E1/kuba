import { isPainted } from '@dom/interfaces'

const element = {
  from(textarea) {
    function get(target, key) {
      if (!textarea[isPainted]) return target[key]

      if (/^(style|value|validationMessage|validity)$/i.test(key)) {
        return textarea.shadowRoot.querySelector('textarea')[key]
      }

      return textarea.shadowRoot.querySelector('textarea').getAttribute(key)
    }

    function set(target, key, value) {
      if (!textarea[isPainted]) {
        target[key] = value
        return true
      }

      if (/^(value)$/i.test(key)) {
        textarea.shadowRoot.querySelector('textarea')[key] = value || ''
        return true
      }

      return value
        ? textarea.shadowRoot.querySelector('textarea').setAttribute(key, value)
        : textarea.shadowRoot.querySelector('textarea').removeAttribute(key)
    }

    return new Proxy({}, { get, set })
  },
}

export default element
