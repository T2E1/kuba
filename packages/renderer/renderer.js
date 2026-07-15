const app = document.querySelector('app')

function renderer(content) {
  document.startViewTransition(() => {
    app.innerHTML = content
  })
}

export default renderer
