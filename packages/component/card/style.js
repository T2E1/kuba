import { css } from '@dom'

function style(card) {
  return css`
    :host {
      align-items: start;
      background-color: var(--color-master-lighter);
      border-radius: var(--border-radius-md);
      box-sizing: border-box;
      display: flex;
      flex-direction: ${card.direction};
      gap: var(--spacing_inset-xs);
      height: ${card.height};
      padding: var(--spacing_inset-xs);
      width: ${card.width};
    }

    :host([variant="outlined"]) {
      background-color: var(--color-pure-white);
      border: var(--border-width-hairline) solid var(--color-master-light);
    }

    :host(:state(hidden)) {
      display: none;
    }
  `
}

export default style
