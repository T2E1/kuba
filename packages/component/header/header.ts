import { define } from '@directive'
import { paint } from '@dom'
import component from './component.js'
import style from './style.js'

@define('m-header')
@paint(component, style)
class Header extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
}

export default Header
