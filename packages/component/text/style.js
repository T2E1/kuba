import { css } from '@dom'

function style(self) {
  return css`
    :host {
      color: var(--color-${self.color});
      font-family: var(--font-family-${self.family});
      font-size: var(--font-size-${self.size});
      font-weight: var(--font-weight-${self.weight});
      letter-spacing: 0.38px;
      line-height: var(--line-height-${self.lineHeight});
      text-align: ${self.align};
    }
  `
}

export default style
