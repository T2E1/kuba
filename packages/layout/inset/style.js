import { css } from '@dom'

const margin = {
  all: '-16px',
  bottom: '0 -16px -16px -16px',
  left: '-16px 0 -16px -16px',
  right: '-16px -16px -16px 0',
  top: '-16px -16px 0 -16px',
  x: '0 -16px',
  y: '-16px 0',
}

const borderRadius = {
  all: '8px',
  bottom: '0 0 8px 8px',
  left: '8px 0 0 8px',
  right: '0 8px 8px 0',
  top: '8px 8px 0 0',
  x: '0',
  y: '0',
}

function style(inset) {
  return css`
    :host {
      border-radius: ${borderRadius[inset.side] || borderRadius.all};
      box-sizing: border-box;
      display: flex;
      flex-direction: ${inset.direction};
      height: ${inset.height};
      margin: ${margin[inset.side] || margin.all} !important;
      overflow: hidden;
      width: ${inset.width};
    }

    :host(:state(hidden)) {
      display: none;
    }
  `
}

export default style
