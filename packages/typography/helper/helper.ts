import { connected, define } from '@directive'
import { paint } from '@dom'
import component from './component'
import { slottable } from './interface'
import style from './style'

@define('kb-helper')
@paint(component, style)
class Helper extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  // Runs on connect so consumers can nest <kb-helper> without setting the slot
  // attribute themselves; targets the `helper` slot exposed by the host component.
  @connected
  [slottable]() {
    this.setAttribute('slot', 'helper')
    return this
  }
}

export default Helper
