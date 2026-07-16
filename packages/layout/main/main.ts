import { define } from '@directive'
import { paint } from '@dom'
import component from './component.js'
import style from './style.js'

@define('kb-main')
@paint(component, style)
class Main extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
}

export default Main
