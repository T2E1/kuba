import { html } from '@dom'

const component = (fileupload) =>
  html`
    <label>
      <input type="file" accept="image/*" ${fileupload.required ? 'required' : ''} />
      <icon>
        <m-icon use="cloud_upload" size="md" color="primary"></m-icon>
      </icon>
      <m-stack direction="column" spacing="quarck" align="center">
        <slot name="label"></slot>
        <slot name="helper"></slot>
      </m-stack>
    </label>
    <preview>
      <img src="${fileupload.file}" loading="lazy" />
      <m-button color="danger" variant="icon">
        <m-icon use="delete" size="sm"></m-icon>
      </m-button>
    </preview>
    <slot name="validity"></slot>
  `

export default component
