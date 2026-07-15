import { html } from '@dom'

const component = (textarea) => html`
  <label for="${textarea.id}">
    <slot name="label"></slot>
  </label>
  <textarea
    ${textarea.id ? `id="${textarea.id}"` : ''}
    ${textarea.name ? `name="${textarea.name}"` : ''}
    ${textarea.placeholder ? `placeholder="${textarea.placeholder}"` : ''}
    ${textarea.value ? `value="${textarea.value}"` : ''}
    ${textarea.disabled ? 'disabled' : ''}
    ${textarea.readonly ? 'readonly' : ''}
    ${textarea.required ? 'required' : ''}>${textarea.value}</textarea>
  <slot name="helper"></slot>
  <slot name="validity"></slot>
`

export default component
