import { css } from '@dom'

function style(self) {
  return css`
    :host {
      display: inline-flex;
      width: ${self.width};

      button {
        align-items: center;
        background-color: var(--button-color-accent, var(--color-${self.color}));
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
      }
    }

    :host(:state(naked)) {
      button {
        background-color: transparent;
        border: var(--button-border-width, var(--border-width-thin)) solid var(--button-color-accent, var(--color-${self.color}));
        color: var(--button-color-accent, var(--color-${self.color}));
      }
    }

    :host(:state(ghost)) {
      button {
        background-color: var(--button-color-background-ghost, var(--color-master-lighter));
        border: var(--button-border-width, var(--border-width-thin)) solid transparent;
        color: var(--button-color-accent, var(--color-${self.color}));
      }
    }

    :host(:state(link)) {
      button {
        background-color: transparent;
        border: var(--button-border-width, var(--border-width-thin)) solid transparent;
        color: var(--button-color-accent, var(--color-${self.color}));
      }
    }

    :host(:state(icon)) {
      button {
        background-color: transparent;
        border: var(--button-border-width, var(--border-width-thin)) solid transparent;
        color: var(--button-color-accent, var(--color-${self.color}));
        padding: 0;
        width: var(--button-size-height, 40px);
      }
    }

    :host(:state(hidden)) {
      display: none;
    }

    ::slotted(*) {
      pointer-events: none;
    }
  `
}

export default style
