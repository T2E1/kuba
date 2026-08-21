import { css } from '@dom'

function style(icon) {
  return css`
    :host {
      box-sizing: border-box;
      color: var(--icon-color, ${icon.color});
      direction: ltr;
      display: inline-flex;
      font-family: 'Material Symbols Rounded';
      font-size: var(--icon-size, var(--font-size-${icon.size}));
      font-style: normal;
      font-variation-settings:
        'FILL' var(--icon-fill, 1),
        'wght' var(--icon-weight, 400),
        'GRAD' var(--icon-grade, 0),
        'opsz' var(--icon-optical-size, 24);
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
