import { css } from '@dom'

function style(button) {
  return css`
    :host {
      display: inline-flex;
      width: ${button.width};

      button {
        align-items: center;
        background-color: var(--button-color-accent, var(--color-${button.color}, var(--color-primary)));
        border: var(--button-border-width, var(--border-width-thin)) solid transparent;
        border-radius: var(--button-border-radius, var(--border-radius-sm));
        box-sizing: border-box;
        color: var(--button-color-text, var(--color-pure-white));
        cursor: pointer;
        display: flex;
        font-family: var(--button-font-family, var(--font-family-base));
        font-size: var(--button-font-size, var(--font-size-xxs));
        font-weight: var(--button-font-weight, var(--font-weight-medium));
        gap: var(--button-space-gap, var(--spacing_inset-nano));
        height: var(--button-size-height, 40px);
        justify-content: center;
        letter-spacing: var(--button-letter-spacing, 0.38px);
        line-height: var(--button-line-height, var(--line-height-default));
        min-width: var(--button-size-min-width, 40px);
        padding: 0 var(--button-space-inline, var(--spacing_inset-xs));
        transition: var(--button-transition, all 0.2s ease-out);
        width: 100%;

        &:hover:not(:disabled) {
          background-color: var(--button-color-accent-hover, var(--color-${button.color}-dark, var(--color-primary-dark)));
        }

        &:active:not(:disabled) {
          background-color: var(--button-color-accent-active, var(--color-${button.color}-darker, var(--color-primary-darker)));
        }

        &:focus-visible {
          outline: var(--button-border-width, var(--border-width-thin)) solid var(--button-color-focus-ring, var(--color-master-darkest));
          outline-offset: 2px;
        }

        &:disabled {
          cursor: not-allowed;
        }
      }
    }

    :host(:state(naked)) {
      button {
        background-color: transparent;
        border: var(--button-border-width, var(--border-width-thin)) solid var(--button-color-accent, var(--color-${button.color}, var(--color-primary)));
        color: var(--button-color-accent, var(--color-${button.color}, var(--color-primary)));

        &:hover:not(:disabled) {
          background-color: var(--button-color-background-hover, var(--color-${button.color}-lighter, var(--color-primary-lighter)));
        }

        &:active:not(:disabled) {
          background-color: var(--button-color-background-active, var(--color-${button.color}-light, var(--color-primary-light)));
        }
      }
    }

    :host(:state(ghost)) {
      button {
        background-color: var(--button-color-background-ghost, var(--color-master-lighter));
        border: var(--button-border-width, var(--border-width-thin)) solid transparent;
        color: var(--button-color-accent, var(--color-${button.color}, var(--color-primary)));

        &:hover:not(:disabled) {
          background-color: var(--button-color-background-hover, var(--color-master-light));
        }

        &:active:not(:disabled) {
          background-color: var(--button-color-background-active, var(--color-master));
        }
      }
    }

    :host(:state(link)) {
      button {
        background-color: transparent;
        border: var(--button-border-width, var(--border-width-thin)) solid transparent;
        color: var(--button-color-accent, var(--color-${button.color}, var(--color-primary)));

        &:hover:not(:disabled) {
          text-decoration: underline;
        }

        &:active:not(:disabled) {
          color: var(--button-color-accent-active, var(--color-${button.color}-dark, var(--color-primary-dark)));
        }
      }
    }

    :host(:state(icon)) {
      button {
        background-color: transparent;
        border: var(--button-border-width, var(--border-width-thin)) solid transparent;
        color: var(--button-color-accent, var(--color-${button.color}, var(--color-primary)));
        padding: 0;
        width: var(--button-size-height, 40px);

        &:hover:not(:disabled) {
          background-color: var(--button-color-background-hover, var(--color-master-lighter));
        }

        &:active:not(:disabled) {
          background-color: var(--button-color-background-active, var(--color-master-light));
        }
      }
    }

    :host(:state(hidden)) {
      display: none;
    }

    /**
     * 'disabled' mirrors the native <button disabled> already written by
     * component.js — the platform already blocks focus, click and keyboard
     * activation. This only supplies the visual signal, on the custom state
     * published by the disabled setter (button.ts).
     */
    :host(:state(disabled)) {
      cursor: not-allowed;
      opacity: var(--button-opacity-disabled, var(--opacity-level-intense));
    }

    /**
     * forced-colors: the button is a real <button>, so the platform already
     * applies system button chrome by default — no rescue needed for solid.
     * The exception is naked/ghost/link/icon, which set border-color:
     * transparent: unlike author colors, transparent is preserved as-is
     * under forced-colors instead of being remapped to a system color, so
     * those variants would lose their boundary entirely. ButtonText and
     * Highlight are system color keywords, not design tokens — there is no
     * --color-* equivalent, and inventing one would fight the OS theme
     * forced-colors exists to respect.
     */
    @media (forced-colors: active) {
      button {
        border-color: ButtonText;
      }

      button:focus-visible {
        outline-color: Highlight;
      }
    }

    ::slotted(*) {
      pointer-events: none;
    }
  `
}

export default style
