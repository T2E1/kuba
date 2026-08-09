import { html } from '@dom'

function component() {
  return html`
    <wrapper>
      <container>
        <leading>
          <slot name="leading">
            <kb-text size="xxxs">© 2025 Memoize. Todos os direitos reservados.</kb-text>
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
