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

  @connected
  [slottable]() {
    this.setAttribute('slot', 'helper')
    return this
  }
}

export default Helper
