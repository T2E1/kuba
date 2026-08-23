import { css } from '@dom'

function style() {
  return css`
    :host {
      box-sizing: border-box;
      height: var(--header-size-height, 72px);
      width: 100%;

      wrapper {
        box-sizing: border-box;
        width: 100%;

        container {
          align-items: center;
          box-sizing: border-box;
          display: flex;
          height: var(--header-size-height, 72px);
          justify-content: space-between;
          margin: 0 auto;
          max-width: var(--header-size-max-width, 1024px);
          padding: var(--header-space-inset, var(--spacing_inset-xs));

          leading {
            align-items: center;
            display: flex;
            gap: var(--header-space-gap, var(--spacing_inset-xs));
            justify-content: start;
          }

          trailing {
            align-items: center;
            display: flex;
            gap: var(--header-space-gap, var(--spacing_inset-xs));
            justify-content: end;
          }
        }
      }
    }
  `
}

export default style
