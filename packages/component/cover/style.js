import { css } from '@dom'

function style(cover) {
  return css`
    :host {
      aspect-ratio: var(--cover-aspect-ratio-${cover.orientation === 'portrait' ? 'portrait' : 'landscape'}, ${cover.orientation === 'portrait' ? '4/5' : '16/9'});
      background-color: var(--cover-color-background, var(--color-pure-white));
      border-radius: var(--cover-border-radius, var(--border-radius-md));
      box-sizing: border-box;

      img {
        display: block;
        height: 100%;
        object-fit: cover;
        width: 100%;
      }
    }
  `
}

export default style
