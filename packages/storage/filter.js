class Filter {
  #fields = {}

  add(fields) {
    Object.assign(this.#fields, fields)
  }

  reduce(records) {
    return records.filter((record) =>
      Object.entries(this.#fields).every(
        ([key, value]) => record[key] == value,
      ),
    )
  }
}

export default Filter
