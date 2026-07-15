const fallback = (page) => {
  fallback.page = page
  fallback.path = globalThis.location.pathname
}

export default fallback
