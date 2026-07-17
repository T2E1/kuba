import { attributeChanged, define } from '@directive'
import { paint, repaint } from '@dom'
import Echo from '@echo'
import component from './component.js'
import style from './style.js'

// Echo(HTMLElement) adds the event-dispatch mixin used elsewhere in the codebase;
// it is not exercised directly by this component but is required by the base class chain.
@define('kb-text')
@paint(component, style)
class Text extends Echo(HTMLElement) {
  #align
  #color
  #family
  #lineHeight
  #size
  #weight

  // Each setter below is wired to its matching HTML attribute via @attributeChanged
  // and triggers a @repaint (re-runs style/component) whenever the attribute changes.
  get align() {
    return (this.#align ??= 'left')
  }

  @attributeChanged('align')
  @repaint
  set align(value) {
    this.#align = value
  }

  get color() {
    return (this.#color ??= 'master-dark')
  }

  @attributeChanged('color')
  @repaint
  set color(value) {
    this.#color = value
  }

  get family() {
    return (this.#family ??= 'base')
  }

  @attributeChanged('family')
  @repaint
  set family(value) {
    this.#family = value
  }

  get lineHeight() {
    return (this.#lineHeight ??= 'lg')
  }

  @attributeChanged('line-height')
  @repaint
  set lineHeight(value) {
    this.#lineHeight = value
  }

  get size() {
    return (this.#size ??= 'xxs')
  }

  @attributeChanged('size')
  @repaint
  set size(value) {
    this.#size = value
  }

  get weight() {
    return (this.#weight ??= 'regular')
  }

  @attributeChanged('weight')
  @repaint
  set weight(value) {
    this.#weight = value
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
}

export default Text
