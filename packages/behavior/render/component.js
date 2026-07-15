import { html } from '@dom'

function component(render) {
  return html`${render.textContent}`
}

export default component
