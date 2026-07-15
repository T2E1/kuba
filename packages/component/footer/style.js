import { css } from '@dom'

function style() {
  return css`
    :host {
      box-sizing: border-box;
      height: 72px;
      width: 100%;

      footer {
        width: 100svw;

        container {
          align-items: center;
          box-sizing: border-box;
          display: flex;
          height: 72px;
          justify-content: space-between;
          margin: 0 auto;
          max-width: 1024px;
          padding: var(--spacing_inset-xs);
        }
      }
    }
  `
}

export default style
