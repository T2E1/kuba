import { html } from '@dom'

function component() {
  return html`
    <header>
      <container>
        <leading>
          <slot name="leading">
            <m-logo></m-logo>
          </slot>
        </leading>
        <trailing>
          <slot name="trailing"></slot>
        </trailing>
      </container>
    </header>
  `
}

export default component
