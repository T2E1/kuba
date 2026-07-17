// Any property access (e.g. http.get, http.post) is treated as the HTTP
// method name and returns a request builder for that verb — there is no
// fixed list of supported methods.
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

          // Never rejects: both network failures and non-2xx responses
          // resolve to a { data, error } result instead of throwing.
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
