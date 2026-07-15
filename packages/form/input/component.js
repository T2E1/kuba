import { html } from '@dom'

const component = (input) => html`
	<label for="${input.id}">
		<slot name="label"></slot>
	</label>
	<input
		${input.id ? `id="${input.id}"` : ''}
		${input.inputMode ? `inputmode="${input.inputMode}"` : ''}
		${input.max ? `max="${input.max}"` : ''}
		${input.maxLength ? `maxlength="${input.maxLength}"` : ''}
		${input.min ? `min="${input.min}"` : ''}
		${input.minLength ? `minlength="${input.minLength}"` : ''}
		${input.name ? `name="${input.name}"` : ''}
		${input.pattern ? `pattern="${input.pattern}"` : ''}
		${input.placeholder ? `placeholder="${input.placeholder}"` : ''}
		${input.step ? `step="${input.step}"` : ''}
		${input.type ? `type="${input.type}"` : ''}
		${input.value ? `value="${input.value}"` : ''}
		${input.disabled ? 'disabled' : ''}
		${input.readonly ? 'readonly' : ''}
		${input.required ? 'required' : ''}
	/>
	<slot name="helper"></slot>
	<slot name="validity"></slot>
`

export default component
