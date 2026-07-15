import { css } from '@dom'

function style() {
  return css`
    :host {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--spacing_inset-md);
      margin: 0 auto;
      max-width: 480px;
      min-height: calc(100svh - 144px);
      padding: var(--spacing_inset-xs);
      width: 100%;
    }
  `
}

export default style
