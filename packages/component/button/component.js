import { html } from '@dom'

function component(button) {
  return html`
    <button
      part="button"
      ${button.alt ? `aria-label="${button.alt}"` : ''}
      ${button.disabled ? 'disabled' : ''}
    >
      <slot></slot>
    </button>
  `
}

export default component
