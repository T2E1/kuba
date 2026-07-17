// Reads/writes go straight through to `document.cookie`; there is no in-memory
// cache, so every get re-parses the full cookie string.
const cookie = new Proxy(
  {},
  {
    get: (_, key) =>
      document.cookie.match(`(^|;)\\s*${key}\\s*=\\s*([^;]+)`)?.pop(),

    // Defaults to path=/ and a 1-year max-age (31536000s); overwrites any
    // existing cookie of the same name.
    set: (_, key, value) => {
      document.cookie = `${key}=${value}; path=/; max-age=31536000`
      return true
    },

    // Deletes by setting max-age=0, which is the standard way to expire a
    // cookie immediately since there is no native "remove" API.
    deleteProperty: (_, key) => {
      document.cookie = `${key}=; path=/; max-age=0`
      return true
    },
  },
)

export default cookie
