import { css } from '@dom'

function style() {
  return css`
    :host {
      box-sizing: border-box;
      color: var(--color-master-dark);
      display: inline-flex;
      font-family: var(--font-family-base);
      font-size: var(--font-size-xxxs);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-lg);
      text-align: left;
    }
  `
}

export default style
