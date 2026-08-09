import { html } from '@dom'

function component() {
  return html`
    <wrapper>
      <container>
        <leading>
          <slot name="leading">
          </slot>
        </leading>
        <trailing>
          <slot name="trailing"></slot>
        </trailing>
      </container>
    </wrapper>
  `
}

export default component
