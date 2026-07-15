import { html } from '@dom'

function component() {
  return html`
    <button>
      <slot></slot>
    </button>
  `
}

export default component
