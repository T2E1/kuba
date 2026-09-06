import { define } from '@directive'
import attributeChanged, { enumerated } from '@directive/attributeChanged'
import { paint, repaint } from '@dom'
import Echo from '@echo'
import { ALIGNS } from './align.js'
import { COLORS } from './color.js'
import component from './component.js'
import { FAMILIES } from './family.js'
import { LINE_HEIGHTS } from './lineHeight.js'
import { SIZES } from './size.js'
import style from './style.js'
import { WEIGHTS } from './weight.js'

// Echo puts `on` in observedAttributes and routes the shared arc bus to this
// host, so a consumer can drive `<kb-text>` declaratively (arc wiring, `<kb-on>`
// children) — the baseline every consumable element shares. It dispatches
// nothing itself.
@define('kb-text')
@paint(component, style)
class Text extends Echo(HTMLElement) {
  #align
  #color
  #family
  #lineHeight
  #size
  #weight

  // Each setter below is wired to its matching HTML attribute via @attributeChanged,
  // validated against a closed token set (rule 003), and triggers a @repaint
  // (re-runs style/component) whenever the attribute changes.
  get align() {
    return (this.#align ??= ALIGNS.LEFT)
  }

  @attributeChanged('align', enumerated(ALIGNS))
  @repaint
  set align(value) {
    this.#align = value
  }

  get color() {
    return (this.#color ??= COLORS.MASTER_DARK)
  }

  @attributeChanged('color', enumerated(COLORS))
  @repaint
  set color(value) {
    this.#color = value
  }

  get family() {
    return (this.#family ??= FAMILIES.BASE)
  }

  @attributeChanged('family', enumerated(FAMILIES))
  @repaint
  set family(value) {
    this.#family = value
  }

  get lineHeight() {
    return (this.#lineHeight ??= LINE_HEIGHTS.LG)
  }

  @attributeChanged('line-height', enumerated(LINE_HEIGHTS))
  @repaint
  set lineHeight(value) {
    this.#lineHeight = value
  }

  get size() {
    return (this.#size ??= SIZES.XXS)
  }

  @attributeChanged('size', enumerated(SIZES))
  @repaint
  set size(value) {
    this.#size = value
  }

  get weight() {
    return (this.#weight ??= WEIGHTS.REGULAR)
  }

  @attributeChanged('weight', enumerated(WEIGHTS))
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
