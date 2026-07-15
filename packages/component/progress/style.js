import { css } from '@dom'

function style(progress) {
  return css`
    :host {
      background-color: var(--color-pure-white);
      border-radius: var(--border-radius-pill);
      bottom: var(--spacing_inset-quarck);
      box-sizing: border-box;
      display: block;
      height: 6px;
      overflow: hidden;
      width: 100%;

      div {
        background-color: var(--color-primary);
        border-radius: var(--border-radius-pill);
        display: block;
        height: 100%;
        width: ${progress.value}%;
      }
    }
  `
}

export default style
