import { expect, test, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { clickInner, inner, mount } from '../../../vitest.helpers.js'

test('dispatches clicked carrying its value', async () => {
  const body = mount('<kb-button value="42">Save</kb-button>')
  const button = body.querySelector('kb-button')
  const onClicked = vi.fn()
  button.addEventListener('clicked', onClicked)

  await clickInner(button)

  expect(onClicked).toHaveBeenCalledOnce()
  expect(onClicked.mock.calls[0][0].detail).toBe('42')
})

test('submits an owning form', async () => {
  // `type="submit"` (the default) calls `internals.form?.requestSubmit()` —
  // form association happens because the button is a form-associated custom
  // element nested in a real <form>.
  const body = mount('<form><kb-button type="submit">Save</kb-button></form>')
  const onSubmit = vi.fn((event) => event.preventDefault())
  body.querySelector('form').addEventListener('submit', onSubmit)

  await clickInner(body.querySelector('kb-button'))

  expect(onSubmit).toHaveBeenCalledOnce()
})

test('resets an owning form', async () => {
  const body = mount(
    '<form><input name="note" value="original" /><kb-button type="reset">Reset</kb-button></form>',
  )
  const input = body.querySelector('input')

  await userEvent.fill(input, 'changed')
  expect(input).toHaveValue('changed')

  await clickInner(body.querySelector('kb-button'))

  expect(input).toHaveValue('original')
})

test('wires a payload to another element through an arc', async () => {
  // `on` assigns #source's `clicked` payload straight to #target's `value`
  // property (`setter` sink), with no listener written by the page.
  const body = mount(`
    <kb-button id="source" value="42">Source</kb-button>
    <kb-button id="target" on="#source/clicked:setter/value">Target</kb-button>
  `)
  const target = body.querySelector('#target')

  expect(target.value).toBeUndefined()

  await clickInner(body.querySelector('#source'))

  await vi.waitFor(() => expect(target.value).toBe('42'))
})

test('names the inner control, not the host', async () => {
  // The <button> in the shadow root is what the accessibility tree treats as
  // the button, so the name has to land there — naming the host would name a
  // wrapper no one ever focuses.
  const body = mount('<kb-button variant="icon" alt="Delete"></kb-button>')
  const button = body.querySelector('kb-button')

  const control = await inner(button, 'button')

  expect(control.getAttribute('aria-label')).toBe('Delete')
})

test('leaves the control unnamed when alt is absent', async () => {
  // A button with visible text takes its name from that text; an empty
  // aria-label would erase it.
  const body = mount('<kb-button>Save</kb-button>')
  const button = body.querySelector('kb-button')

  const control = await inner(button, 'button')

  expect(control.hasAttribute('aria-label')).toBe(false)
})

test('follows alt when it changes after mount', async () => {
  const body = mount('<kb-button variant="icon" alt="Delete"></kb-button>')
  const button = body.querySelector('kb-button')
  await inner(button, 'button')

  button.setAttribute('alt', 'Remove')

  await vi.waitFor(async () =>
    expect((await inner(button, 'button')).getAttribute('aria-label')).toBe(
      'Remove',
    ),
  )
})
