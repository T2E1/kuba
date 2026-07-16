import { connected, define } from '@directive'
import { paint } from '@dom'
import component from './component'
import { slottable } from './interface'
import style from './style'

@define('kb-label')
@paint(component, style)
class Label extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  @connected
  [slottable]() {
    this.setAttribute('slot', 'label')
    return this
  }
}

export default Label
