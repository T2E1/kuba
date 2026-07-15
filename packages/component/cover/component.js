import { html } from '@dom'

function component(cover) {
  return html`<img alt="${cover.alt}" src="${cover.src}" />`
}

export default component
