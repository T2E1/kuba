import { html } from '@dom'

const component = (fileupload) =>
  html`
    <label>
      <input type="file" accept="image/*" ${fileupload.required ? 'required' : ''} />
      <icon>
        <kb-icon use="cloud_upload" size="md" color="primary"></kb-icon>
      </icon>
      <kb-stack direction="column" spacing="quarck" align="center">
        <slot name="label"></slot>
        <slot name="helper"></slot>
      </kb-stack>
    </label>
    <preview>
      <img src="${fileupload.file}" loading="lazy" />
      <kb-button color="danger" variant="icon">
        <kb-icon use="delete" size="sm"></kb-icon>
      </kb-button>
    </preview>
    <slot name="validity"></slot>
  `

export default component
