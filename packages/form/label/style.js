import { css } from '@dom'

function style() {
  return css`
    :host {
      box-sizing: border-box;
      color: var(--color-master-dark);
      display: inline-flex;
      font-family: var(--font-family-base);
      font-size: var(--font-size-xxs);
      font-weight: var(--font-weight-medium);
      line-height: var(--line-height-default);
      text-align: left;
    }
  `
}

export default style
