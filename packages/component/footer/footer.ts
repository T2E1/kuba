import { define } from '@directive'
import { paint } from '@dom'
import component from './component.js'
import style from './style.js'

@define('m-footer')
@paint(component, style)
class Footer extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
}

export default Footer
