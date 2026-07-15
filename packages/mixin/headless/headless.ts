import { connected } from '@directive'
import { hideable } from './interfaces'

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
