import { css } from '@dom'

// The bleed is a negative margin, so it's built once from the custom property
// via `calc(... * -1)` — that keeps a single source of truth for the distance
// across every side combination in the map below.
const bleed = 'calc(var(--inset-space-bleed, var(--spacing_inset-xs)) * -1)'
const radius = 'var(--inset-border-radius, var(--border-radius-sm))'

const margin = {
  all: bleed,
  bottom: `0 ${bleed} ${bleed} ${bleed}`,
  left: `${bleed} 0 ${bleed} ${bleed}`,
  right: `${bleed} ${bleed} ${bleed} 0`,
  top: `${bleed} ${bleed} 0 ${bleed}`,
  x: `0 ${bleed}`,
  y: `${bleed} 0`,
}

const borderRadius = {
  all: radius,
  bottom: `0 0 ${radius} ${radius}`,
  left: `${radius} 0 0 ${radius}`,
  right: `0 ${radius} ${radius} 0`,
  top: `${radius} ${radius} 0 0`,
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
