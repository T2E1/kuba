import { connected, define } from '@directive'
import Echo from '@echo'
import { customEvent } from '@event'
import { Headless } from '@mixin'
import DB from '@storage'
import { dispatch } from './interfaces'

@define('m-load')
class Load extends Echo(Headless(HTMLElement)) {
  @connected
  async [dispatch]() {
    await customElements.whenDefined(this.parentElement?.localName)

    const db = await DB.open()
    const { data, error } = await db[this.parentElement.store].get()

    error
      ? this.parentElement.dispatchEvent(customEvent('failed', error))
      : this.parentElement.dispatchEvent(customEvent('loaded', data))

    return this
  }
}

export default Load
