import { css } from '@dom'

function style() {
  return css`
    :host,
    :host([layout="list"]) {
      box-sizing: border-box;
      container-type: inline-size;
      display: flex;
      flex-direction: column;
      gap: var(--spacing_inset-xs);
      width: 100%;
    }

    :host([layout="grid"]) {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
    }

    :host(:state(hidden)) {
      display: none;
    }
  `
}

export default style
