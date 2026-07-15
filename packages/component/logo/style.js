import { css } from '@dom'

function style() {
  return css`
    :host {
      color: var(--color-primary);
      height: 40px;
      width: 40px;

      svg {
        height: inherit;
        width: inherit;
      }
    }
  `
}

export default style
