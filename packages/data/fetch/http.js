const http = new Proxy(
  {},
  {
    get(_, method) {
      return (url) => {
        const init = { method }

        return {
          body(target) {
            Object.assign(init, { body: JSON.stringify(target) })
            return this
          },

          headers(target) {
            Object.assign(init, { headers: new Headers(target) })
            return this
          },

          json() {
            return fetch(url, init)
              .then(async (response) => {
                const json = await response.json()
                return response.ok
                  ? { data: json, error: null }
                  : { data: null, error: json }
              })
              .catch((error) => ({ data: null, error }))
          },

          signal(target) {
            Object.assign(init, { signal: target })
            return this
          },
        }
      }
    },
  },
)

export default http
