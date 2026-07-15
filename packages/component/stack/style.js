import { css } from '@dom'

function style(self) {
  return css`
    :host {
      align-items: ${self.align};
      display: flex;
      flex-direction: ${self.direction};
      gap: var(--spacing_inset-${self.spacing});
      height: ${self.height};
      justify-content: ${self.justify};
      width: ${self.width};
    }

    :host(:state(hidden)) {
      display: none;
    }
  `
}

export default style
