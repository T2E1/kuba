import { connected } from '@directive'
import { hideable } from './interfaces'

/** Adds a `hideable` lifecycle hook that hides the host element once connected to the DOM, by setting `display: none` directly on it. */
const Headless = (Super) => {
  class C extends Super {
    @connected
    [hideable]() {
      this.style.setProperty('display', 'none')
      return this
    }
  }

  return C
}

export default Headless
