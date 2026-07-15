import { css } from '@dom'

function style() {
  return css`
    :host {
      display: flex;
      width: 100%;

      form {
        align-items: start;
        display: flex;
        flex-direction: column;
        gap: var(--spacing_inset-xs);
        width: 100%;
      }
    }

    :host(:state(hidden)) {
      display: none;
    }
  `
}

export default style
