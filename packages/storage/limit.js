class Limit {
  #count = Number.MAX_VALUE

  reduce(records) {
    return records.slice(0, this.#count)
  }

  to(count) {
    this.#count = count
  }
}

export default Limit
