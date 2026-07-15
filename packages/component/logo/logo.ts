import { define } from '@directive'
import { paint } from '@dom'
import component from './component.js'
import style from './style.js'

@define('m-logo')
@paint(component, style)
class Logo extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
}

export default Logo
