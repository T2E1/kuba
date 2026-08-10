import { css } from '@dom'

function style(text) {
  return css`
    :host {
      color: var(--text-color, var(--color-${text.color}));
      font-family: var(--text-font-family, var(--font-family-${text.family}));
      font-size: var(--text-font-size, var(--font-size-${text.size}));
      font-weight: var(--text-font-weight, var(--font-weight-${text.weight}));
      letter-spacing: var(--text-letter-spacing, 0.38px);
      line-height: var(
        --text-line-height,
        var(--line-height-${text.lineHeight})
      );
      text-align: ${text.align};
    }
  `
}

export default style
