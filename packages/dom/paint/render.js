import {
  cssCallback,
  didPaintCallback,
  htmlCallback,
  isPainted,
  willPaintCallback,
} from '@dom/interfaces'

const render = (component) => ({
  with: (styles) => ({
    on: (target) => ({
      whenConnected: () => {
        target.prototype.connectedCallback = new Proxy(
          target.prototype.connectedCallback || (() => {}),
          {
            async apply(original, context, args) {
              await original.apply(context, args)

              // Deferred to requestAnimationFrame so html/css writes land in
              // the same paint frame instead of forcing layout mid-callback;
              // stashed on the instance so repaint/retouch can re-invoke the
              // exact same work later without redefining it.
              context[htmlCallback] = (resolve) => {
                requestAnimationFrame(async () => {
                  ;(context.shadowRoot ?? context).innerHTML =
                    await component(context)
                  resolve()
                })
              }

              context[cssCallback] = (resolve) => {
                requestAnimationFrame(async () => {
                  const styleSheets = styles.map((style) => style(context))
                  ;(context.shadowRoot ?? document).adoptedStyleSheets =
                    await Promise.all(styleSheets)
                  resolve()
                })
              }

              // isPainted flips only after the first html+css pass settles,
              // so repaint/retouch (which check this flag) never fire before
              // the initial render completes.
              await context[willPaintCallback]?.()
              await Promise.all([
                new Promise(context[htmlCallback]),
                new Promise(context[cssCallback]),
              ])
              context[isPainted] = true
              await context[didPaintCallback]?.()
            },
          },
        )
      },
    }),
  }),
})

export default render
