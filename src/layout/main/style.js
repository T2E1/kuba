import { css } from '@dom'

function style() {
  return css`
    :host {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--main-space-gap, var(--spacing_inset-md));
      margin: 0 auto;
      max-width: var(--main-size-max-width, 480px);
      min-height: calc(100svh - var(--main-size-offset, 144px));
      padding: var(--main-space-inset, var(--spacing_inset-xs));
      width: 100%;
    }
  `
}

export default style
