import router from './router'

const pushState = () => {
  history.pushState = new Proxy(history.pushState, {
    apply(original, context, args) {
      original.apply(context, args)
      window.dispatchEvent(new CustomEvent('pushstate'))
    },
  })

  window.addEventListener('pushstate', router.handle)
}

export default pushState
