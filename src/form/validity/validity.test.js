import { inner, mount } from '@test'
import { afterEach, expect, test, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Long enough for a `changed` listener + a rejected `whenDefined` microtask to
// run, short enough to keep the suite quick. Used only to prove a *negative* —
// that something stays put — where there is no positive condition to await.
const SETTLE_MS = 50
const settle = () => new Promise((resolve) => setTimeout(resolve, SETTLE_MS))

const requiredField = `
  <kb-input name="who" required>
    <kb-validity state="valueMissing">Required</kb-validity>
  </kb-input>
`

test('shows when its ValidityState key is true on the parent', async () => {
  const body = mount(requiredField)
  const input = body.querySelector('kb-input')
  const message = body.querySelector('kb-validity')
  const control = await inner(input, 'input')

  await userEvent.fill(control, 'a')
  await userEvent.clear(control)

  await vi.waitFor(() =>
    expect(getComputedStyle(message).display).not.toBe('none'),
  )
})

test('stays invisible while the parent field is valid', async () => {
  const body = mount(requiredField)
  const input = body.querySelector('kb-input')
  const message = body.querySelector('kb-validity')
  const control = await inner(input, 'input')

  await userEvent.fill(control, 'a')

  await settle()
  expect(getComputedStyle(message).display).toBe('none')
})

test('reacts only to its own key, not to any other validity failure', async () => {
  const body = mount(`
    <kb-input name="mail" type="email" required>
      <kb-validity state="valueMissing">Required</kb-validity>
      <kb-validity state="typeMismatch">Not an email</kb-validity>
    </kb-input>
  `)
  const input = body.querySelector('kb-input')
  const missing = body.querySelector('kb-validity[state="valueMissing"]')
  const mismatch = body.querySelector('kb-validity[state="typeMismatch"]')

  await userEvent.fill(await inner(input, 'input'), 'notanemail')

  await vi.waitFor(() =>
    expect(getComputedStyle(mismatch).display).not.toBe('none'),
  )
  expect(getComputedStyle(missing).display).toBe('none')
})

test('assumes slot="validity" on connect without the consumer writing it', async () => {
  const body = mount(
    '<kb-input name="who" required><kb-validity state="valueMissing">Required</kb-validity></kb-input>',
  )
  const message = body.querySelector('kb-validity')

  await vi.waitFor(() => expect(message.getAttribute('slot')).toBe('validity'))
})

test('clears its invalid state when the parent field is reset', async () => {
  const body = mount(requiredField)
  const input = body.querySelector('kb-input')
  const message = body.querySelector('kb-validity')
  const control = await inner(input, 'input')
  await userEvent.fill(control, 'a')
  await userEvent.clear(control)
  await vi.waitFor(() => expect(message.matches(':state(invalid)')).toBe(true))

  input.reset()

  await vi.waitFor(() => expect(message.matches(':state(invalid)')).toBe(false))
})

// Suppresses the unhandled rejection from `whenDefined('div')` (see the test
// below and DESIGN.md:205, edge case 4) without leaking a listener into the
// next test: the controller is aborted in `afterEach`.
const rejectionGuard = new AbortController()
afterEach(() => rejectionGuard.abort())

test('never adds :state(invalid) when the parent is not form-associated (DESIGN.md:205, edge case 4)', async () => {
  // A working element WOULD add `invalid` on a real `valueMissing`. Here the
  // parent is a plain <div> with no `.validity`, so `[reflectable]` never
  // wires its listeners — the state is a signal that only appears if the
  // element reacted, which it must not. Documented, not fixed: the guard is
  // code scope.
  window.addEventListener(
    'unhandledrejection',
    (event) => event.preventDefault(),
    { signal: rejectionGuard.signal },
  )
  const body = mount(
    '<div><kb-validity state="valueMissing">Required</kb-validity></div>',
  )
  const message = body.querySelector('kb-validity')

  body.querySelector('div').dispatchEvent(new Event('changed'))
  await settle()

  expect(message.matches(':state(invalid)')).toBe(false)
})
