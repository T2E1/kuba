import { css } from '@dom'

function style(progress) {
  return css`
    :host {
      background-color: var(--progress-color-track, var(--color-pure-white));
      border-radius: var(--progress-border-radius, var(--border-radius-pill));
      box-sizing: border-box;
      display: block;
      height: var(--progress-size-height, 6px);
      overflow: hidden;
      width: 100%;

      div {
        background-color: var(--progress-color-indicator, var(--color-primary));
        border-radius: var(--progress-border-radius, var(--border-radius-pill));
        display: block;
        height: 100%;
        width: ${progress.value}%;
      }
    }
  `
}

export default style
