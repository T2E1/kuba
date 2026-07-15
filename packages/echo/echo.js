import spark from '@spark'
import { connectArc, disconnectArc, on } from './interfaces'
import target from './target'

const Echo = (Klass) => {
  class Host extends Klass {
    #controllers = {}

    static observedAttributes = [...(Klass.observedAttributes ?? []), on]

    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback?.(name, oldValue, newValue)

      if (name === on) {
        this[disconnectArc](oldValue)
        this[connectArc](newValue)
      }

      return this
    }

    disconnectedCallback() {
      super.disconnectedCallback?.()

      for (const arc of Object.keys(this.#controllers)) {
        this[disconnectArc](arc)
      }

      return this
    }

    dispatchEvent(event) {
      super.dispatchEvent?.(event)

      target.dispatchEvent(
        new CustomEvent(event.type, {
          detail: {
            attribute: {
              id: this.getAttribute('id'),
              name: this.getAttribute('name'),
            },
            node: this.localName,
            token: event.detail,
          },
        }),
      )
    }

    [connectArc](arc) {
      this.#controllers[arc] = new AbortController()

      const [, source, event, type, sink, filters] =
        arc.match(/^([*#\w-]+)\/([\w-]+):([a-z]+)\/([\w-]+)(?:\|(.*))?$/i) || []

      const transforms = (filters || '')
        .split('|')
        .filter(Boolean)
        .map((filter) => filter.split('='))
        .map(([name, value]) => [spark.get(name), value])

      target.addEventListener(
        event,
        (e) => {
          const {
            attribute: { id, name },
            node,
            token,
          } = e.detail

          if (new RegExp(`^(\\*|#${id}|${name}|${node})$`, 'i').test(source)) {
            const payload = transforms.reduce(
              (data, [fn, value]) => fn(data, value),
              token,
            )

            if (/method$/i.test(type)) this[sink]?.(payload)
            if (/attribute$/i.test(type)) this.setAttribute(sink, payload)
            if (/setter$/i.test(type)) this[sink] = payload
          }

          return this
        },
        {
          signal: this.#controllers[arc].signal,
        },
      )

      return this
    }

    [disconnectArc](arc) {
      this.#controllers[arc]?.abort()
      return this
    }
  }

  return Host
}

export default Echo
