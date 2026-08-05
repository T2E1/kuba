import { css } from '@dom'

function style() {
  return css`
    :host {
      box-sizing: border-box;
      color: var(--validity-color, var(--color-danger));
      display: none;
      font-family: var(--validity-font-family, var(--font-family-base));
      font-size: var(--validity-font-size, var(--font-size-xxxs));
      font-weight: var(--validity-font-weight, var(--font-weight-regular));
      line-height: var(--validity-line-height, var(--line-height-lg));
    }

    :host(:state(invalid)) {
      display: inline;
    }
  `
}

export default style
