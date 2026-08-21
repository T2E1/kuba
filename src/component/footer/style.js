import { css } from '@dom'

function style() {
  return css`
    :host {
      box-sizing: border-box;
      height: var(--footer-size-height, 72px);
      width: 100%;

      wrapper {
        width: 100%;

        container {
          align-items: center;
          box-sizing: border-box;
          display: flex;
          height: var(--footer-size-height, 72px);
          justify-content: space-between;
          margin: 0 auto;
          max-width: var(--footer-size-max-width, 1024px);
          padding: var(--footer-space-inset, var(--spacing_inset-xs));
        }
      }
    }
  `
}

export default style
