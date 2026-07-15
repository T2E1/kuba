import { controller } from './interfaces'

const listen = (type) => ({
  on: (selector) => ({
    with: (...filters) => ({
      in: (target) => ({
        call: (method) => {
          target.connectedCallback = new Proxy(
            target.connectedCallback ?? (() => {}),
            {
              apply(original, context, args) {
                context[controller] = new AbortController()

                const options = { signal: context[controller].signal }
                const listener = (event) => {
                  if (event.target.matches(selector)) {
                    context[method](
                      filters.reduce((target, filter) => filter(target), event),
                    )
                  }
                }

                context.shadowRoot?.addEventListener(type, listener, options)

                return original.apply(context, args)
              },
            },
          )

          target.disconnectedCallback = new Proxy(
            target.disconnectedCallback ?? (() => {}),
            {
              apply(original, context, args) {
                context[controller].abort()
                return original.apply(context, args)
              },
            },
          )
        },
      }),
    }),
  }),
})

export default listen
