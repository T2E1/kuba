import { html } from '@dom'

const component = (form) =>
  html`
    <form>${form.textContent}</form>
  `

export default component
