import { css } from '@dom'

function style(card) {
  return css`
    :host {
      align-items: start;
      background-color: var(--card-color-background, var(--color-master-lighter));
      border-radius: var(--card-border-radius, var(--border-radius-md));
      box-sizing: border-box;
      display: flex;
      flex-direction: ${card.direction};
      gap: var(--card-space-gap, var(--spacing_inset-xs));
      height: ${card.height};
      padding: var(--card-space-inset, var(--spacing_inset-xs));
      width: ${card.width};
    }

    :host(:state(hidden)) {
      display: none;
    }
  `
}

export default style
