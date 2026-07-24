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
