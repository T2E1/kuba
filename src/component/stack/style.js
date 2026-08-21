import { css } from '@dom'

function style(stack) {
  return css`
    :host {
      align-items: ${stack.align};
      display: flex;
      flex-direction: ${stack.direction};
      gap: var(--stack-space-gap, var(--spacing_inset-${stack.spacing}));
      height: ${stack.height};
      justify-content: ${stack.justify};
      width: ${stack.width};
    }

    :host(:state(hidden)) {
      display: none;
    }
  `
}

export default style
