import { css } from '@dom'

function style() {
  return css`
    :host {
      color: var(--logo-color, var(--color-primary));
      height: var(--logo-size, 40px);
      width: var(--logo-size, 40px);

      svg {
        height: inherit;
        width: inherit;
      }
    }
  `
}

export default style
