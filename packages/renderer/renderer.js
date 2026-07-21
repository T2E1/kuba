// Queried once at module load; the root <app> element must already exist in
// the page by then, or every renderer() call becomes a no-op.
const app = document.querySelector('app')

/**
 * Replaces the root `<app>` element's content, wrapping the DOM write in a
 * View Transition so the swap animates instead of flashing.
 */
function renderer(content) {
  document.startViewTransition(() => {
    app.innerHTML = content
  })
}

export default renderer
