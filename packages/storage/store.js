import Mode from './mode.js'
import Query from './query.js'

class Store {
  #database
  #storeName

  constructor(database, storeName) {
    this.#database = database
    this.#storeName = storeName
  }

  add(data) {
    return new Promise((resolve, reject) => {
      const transaction = this.#database.transaction(
        this.#storeName,
        Mode.READ_WRITE,
      )
      const store = transaction.objectStore(this.#storeName)
      const created = store.add(data)

      created.onsuccess = () => {
        const found = store.get(created.result)

        found.onsuccess = () => resolve({ data: found.result })
        found.onerror = () => reject({ error: found.error })
      }

      created.onerror = () => reject({ error: created.error })
    })
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.#database.transaction(
        this.#storeName,
        Mode.READ_WRITE,
      )
      const store = transaction.objectStore(this.#storeName)
      const removed = store.delete(Number(id))

      removed.onsuccess = () => resolve({ data: removed.result })
      removed.onerror = () => reject({ error: removed.error })
    })
  }

  get(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.#database.transaction(
        this.#storeName,
        Mode.READ_ONLY,
      )
      const store = transaction.objectStore(this.#storeName)
      const found = id ? store.get(Number(id)) : store.getAll()

      found.onsuccess = () => resolve({ data: found.result })
      found.onerror = () => reject({ error: found.error })
    })
  }

  put(id, data) {
    return new Promise((resolve, reject) => {
      const transaction = this.#database.transaction(
        this.#storeName,
        Mode.READ_WRITE,
      )
      const store = transaction.objectStore(this.#storeName)
      const found = store.get(Number(id))

      found.onsuccess = () => {
        const saved = store.put({ ...found.result, ...data })

        saved.onsuccess = () => {
          const found = store.get(saved.result)

          found.onsuccess = () => resolve({ data: found.result })
          found.onerror = () => reject({ error: found.error })
        }

        saved.onerror = () => reject({ error: saved.error })
      }

      found.onerror = () => reject({ error: found.error })
    })
  }

  where(fields) {
    return new Query(this).where(fields)
  }
}

export default Store
