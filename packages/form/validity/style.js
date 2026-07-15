import { css } from '@dom'

function style() {
  return css`
    :host {
      box-sizing: border-box;
      color: var(--color-danger);
      display: none;
      font-family: var(--font-family-base);
      font-size: var(--font-size-xxxs);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-lg);
    }

    :host(:state(invalid)) {
      display: inline;
    }
  `
}

export default style
