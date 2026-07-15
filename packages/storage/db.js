import Store from './store.js'

class DB {
  static #instance = null

  static open() {
    return (DB.#instance ??= new Promise((resolve, reject) => {
      const opened = window.indexedDB.open('memoize', 2)

      opened.onupgradeneeded = ({ target }) => {
        const db = target.result
        db.createObjectStore('deck', { keyPath: 'id', autoIncrement: true })
        db.createObjectStore('card', { keyPath: 'id', autoIncrement: true })
      }

      opened.onsuccess = ({ target }) =>
        resolve(
          new Proxy(
            {},
            { get: (_, storeName) => new Store(target.result, storeName) },
          ),
        )

      opened.onerror = ({ target }) => reject(target.error)
    }))
  }
}

export default DB
