import { css } from '@dom'

function style(self) {
  return css`
    :host {
      box-sizing: border-box;
      color: ${self.color};
      direction: ltr;
      display: inline-flex;
      font-family: 'Material Symbols Rounded';
      font-size: var(--font-size-${self.size});
      font-style: normal;
      font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      font-weight: normal;
      letter-spacing: normal;
      line-height: 1;
      -moz-font-feature-settings: 'liga';
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
      text-transform: none;
      white-space: nowrap;
      word-wrap: normal;
    }
  `
}

export default style
