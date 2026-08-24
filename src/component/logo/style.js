import { css } from '@dom'

function style() {
  return css`
    :host {
      /* OPTIMIZE(024): 60/93 repeats the viewBox in component.js by hand —
         no test ties them, so a future mark swap can silently stretch the
         SVG. Revisit with the architect: aspect-ratio (as in
         src/component/cover/style.js) would derive this instead of copying it. */
      color: var(--logo-color, var(--color-primary));
      height: var(--logo-size, 40px);
      width: calc(var(--logo-size, 40px) * 60 / 93);

      svg {
        height: inherit;
        width: inherit;
      }
    }
  `
}

export default style
