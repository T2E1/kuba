// Wraps AbortController because an aborted one can never signal again — renewal has to
// happen before the next request reads `signal`, not when `abort()` is called, since the
// caller aborts once per request but reads `signal` again right after for the new one.
class Controller {
  #target = new AbortController()

  get signal() {
    this.#target.signal.aborted && (this.#target = new AbortController())
    return this.#target.signal
  }

  abort() {
    this.#target.abort()
  }
}

export default Controller
