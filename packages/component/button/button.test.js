import { expect, test, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { clickInner, mount } from '../../../vitest.helpers.js'

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
