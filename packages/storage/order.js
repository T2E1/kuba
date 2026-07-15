class Order {
  #compare = () => 0

  by(field, direction = 'asc') {
    const multiplier = direction === 'desc' ? -1 : 1
    this.#compare = (a, b) => {
      if (a[field] < b[field]) return -1 * multiplier
      if (a[field] > b[field]) return 1 * multiplier
      return 0
    }
  }

  reduce(records) {
    return [...records].sort(this.#compare)
  }
}

export default Order
