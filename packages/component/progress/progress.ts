import { attributeChanged, define } from '@directive'
import { paint, retouch } from '@dom'
import Echo from '@echo'
import component from './component.js'
import style from './style.js'

@define('m-progress')
@paint(component, style)
class Progress extends Echo(HTMLElement) {
  #value

  get value() {
    return (this.#value ??= '0')
  }

  @attributeChanged('value')
  @retouch
  set value(value) {
    this.#value = value
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }
}

export default Progress
