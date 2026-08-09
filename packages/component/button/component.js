import { html } from '@dom'

function component(button) {
  return html`
    <button ${button.alt ? `aria-label="${button.alt}"` : ''}>
      <slot></slot>
    </button>
  `
}

export default component
