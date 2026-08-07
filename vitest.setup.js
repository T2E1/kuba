import { afterEach } from 'vitest'
import './packages/pixel/index.css'
import './index.js'

// Every test mounts markup into document.body; clearing it between tests keeps
// one test's elements out of the next one's queries — and, more importantly,
// out of Echo's shared bus, which matches arcs by id/name across the whole
// document rather than by proximity.
afterEach(() => {
  document.body.innerHTML = ''
})
