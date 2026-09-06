import { clickInner, mount } from '@test'
import { afterEach, expect, test, vi } from 'vitest'

// Same well-known key as `src/data/headers/interfaces.js` and
// `src/data/fetch/interfaces.js` — `Symbol.for` so every module resolves the
// same symbol. Declared here too, matching the pattern the other two modules
// already use, so the test can spy on the wiring contract itself instead of
// only on its effect on a real network request.
const setHeader = Symbol.for('setHeader')

// http.js calls the ambient `fetch`, so intercepting it here is the most
// direct way to observe the headers a <kb-fetch> actually sends — no test in
// the repository mocks network for `kb-fetch` yet, so this establishes the
// pattern rather than following one.
afterEach(() => {
  vi.restoreAllMocks()
})

test('delivers its key/value pair as a request header', async () => {
  const body = mount(`
    <kb-fetch url="/api/x">
      <kb-headers key="x-api-key" value="DEMO"></kb-headers>
    </kb-fetch>
  `)
  const fetcher = body.querySelector('kb-fetch')
  const spy = vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue(new Response('{}'))

  // The wiring from child to parent finishes asynchronously after
  // `connectedCallback`, so the call is retried until the header lands.
  await vi.waitFor(async () => {
    await fetcher.get({})
    const [, init] = spy.mock.calls.at(-1)
    expect(init.headers.get('x-api-key')).toBe('DEMO')
  })
})

test('combines sibling headers into the same request', async () => {
  const body = mount(`
    <kb-fetch url="/api/x">
      <kb-headers key="x-api-key" value="DEMO"></kb-headers>
      <kb-headers key="accept-language" value="pt-BR"></kb-headers>
    </kb-fetch>
  `)
  const fetcher = body.querySelector('kb-fetch')
  const spy = vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue(new Response('{}'))

  await vi.waitFor(async () => {
    await fetcher.get({})
    const [, init] = spy.mock.calls.at(-1)
    expect(init.headers.get('x-api-key')).toBe('DEMO')
    expect(init.headers.get('accept-language')).toBe('pt-BR')
  })
})

test('key and value default to an empty string before any attribute is set', () => {
  const headers = document.createElement('kb-headers')

  expect(headers.key).toBe('')
  expect(headers.value).toBe('')
})

test('an empty key leaves the parent request headers untouched', async () => {
  const body = mount(`
    <kb-fetch url="/api/x">
      <kb-headers></kb-headers>
    </kb-fetch>
  `)
  const fetcher = body.querySelector('kb-fetch')
  const spy = vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue(new Response('{}'))

  await fetcher.get({})

  const [, init] = spy.mock.calls.at(-1)
  expect([...init.headers.keys()]).toHaveLength(0)
})

test('a static header writes to the parent exactly once', async () => {
  const body = mount(`
    <kb-fetch url="/api/x">
      <kb-headers key="X" value="Y"></kb-headers>
    </kb-fetch>
  `)
  const fetcher = body.querySelector('kb-fetch')
  const spy = vi.spyOn(fetcher, setHeader)

  await vi.waitFor(() => expect(spy).toHaveBeenCalledTimes(1))
  expect(spy).toHaveBeenCalledWith('X', 'Y')
})

test('an Echo arc updates the header after connection', async () => {
  const body = mount(`
    <kb-button id="source" value="UPDATED">Update</kb-button>
    <kb-fetch url="/api/x">
      <kb-headers
        key="x-api-key"
        value="DEMO"
        on="#source/clicked:setter/value"
      ></kb-headers>
    </kb-fetch>
  `)
  const fetcher = body.querySelector('kb-fetch')
  const spy = vi.spyOn(fetcher, setHeader)

  await vi.waitFor(() => expect(spy).toHaveBeenCalledWith('x-api-key', 'DEMO'))

  await clickInner(body.querySelector('#source'))

  await vi.waitFor(() =>
    expect(spy).toHaveBeenLastCalledWith('x-api-key', 'UPDATED'),
  )
})

test('two synchronous writes in the same turn collapse into one call', async () => {
  const body = mount(`
    <kb-fetch url="/api/x">
      <kb-headers></kb-headers>
    </kb-fetch>
  `)
  const fetcher = body.querySelector('kb-fetch')
  const headers = body.querySelector('kb-headers')
  const spy = vi.spyOn(fetcher, setHeader)

  headers.key = 'A'
  headers.value = 'B'

  await vi.waitFor(() => expect(spy).toHaveBeenCalledTimes(1))
  expect(spy).toHaveBeenCalledWith('A', 'B')
})

test('a write made before connection is not lost, nor sent early', async () => {
  const headers = document.createElement('kb-headers')
  headers.key = 'k'
  headers.value = 'v'
  await Promise.resolve()

  const fetcher = document.createElement('kb-fetch')
  document.body.append(fetcher)
  const spy = vi.spyOn(fetcher, setHeader)

  fetcher.append(headers)

  await vi.waitFor(() => expect(spy).toHaveBeenCalledTimes(1))
  expect(spy).toHaveBeenCalledWith('k', 'v')
})
