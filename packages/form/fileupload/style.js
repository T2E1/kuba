import { css } from '@dom'

function style(fileupaload) {
  return css`
    :host {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--fileupload-space-gap, var(--spacing-nano));
      position: relative;
      user-select: none;
      width: ${fileupaload.width};

      label {
        align-items: center;
        aspect-ratio: var(--fileupload-aspect-ratio, 1.95/1);
        background-color: var(--fileupload-color-background, transparent);
        border: var(--border-width-hairline) solid
          var(--fileupload-color-border, var(--color-master-light));
        border-radius: var(--fileupload-border-radius, var(--border-radius-sm));
        box-sizing: border-box;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: var(--spacing_inset-xs);
        justify-content: center;
        overflow: hidden;
        padding: var(--fileupload-space-inset, var(--spacing-xl) var(--spacing-md));
        width: 100%;

        &:hover {
          border-color: var(--fileupload-color-border_hover, var(--color-primary));
        }

        input {
          display: none;
        }

        icon {
          align-items: center;
          background-color: var(
            --fileupload-color-icon-background,
            var(--color-primary-lighter)
          );
          border-radius: var(--border-radius-circular);
          display: flex;
          height: 48px;
          justify-content: center;
          width: 48px;
        }
      }

      preview {
        aspect-ratio: var(--fileupload-aspect-ratio, 1.95/1);
        box-sizing: border-box;
        display: ${fileupaload.file ? 'block' : 'none'};
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;

        img {
          border-radius: var(
            --fileupload-border-radius,
            var(--border-radius-sm)
          );
          display: block;
          height: 100%;
          object-fit: var(--fileupload-preview-fit, cover);
          width: 100%;
        }

        kb-button {
          background-color: var(--color-master-lightest);
          border-radius: var(--border-radius-circular);
          position: absolute;
          right: var(--spacing-xxxs);
          top: var(--spacing-xxxs);
        }
      }
    }

    :host(:state(hidden)) {
      display: none;
    }
  `
}

export default style
