import { css } from '@dom'

function style() {
  return css`
    :host {
      box-sizing: border-box;
      color: var(--label-color, var(--color-master-dark));
      display: inline-flex;
      font-family: var(--label-font-family, var(--font-family-base));
      font-size: var(--label-font-size, var(--font-size-xxs));
      font-weight: var(--label-font-weight, var(--font-weight-medium));
      line-height: var(--label-line-height, var(--line-height-default));
      text-align: left;
    }
  `
}

export default style
