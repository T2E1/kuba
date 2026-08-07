import { expect, test, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { inner, mount } from '../../../vitest.helpers.js'

test('dispatches changed on every keystroke', async () => {
  // `@on.input('input', value)` forwards each keystroke into the host's value
  // setter, and `@around(dispatch)` re-dispatches it — so the event fires per
  // character, not on blur.
  const body = mount('<kb-input name="who"></kb-input>')
  const input = body.querySelector('kb-input')
  const onChanged = vi.fn()
  input.addEventListener('changed', onChanged)

  await userEvent.fill(await inner(input, 'input'), 'ada')

  await vi.waitFor(() => expect(onChanged).toHaveBeenCalled())
  expect(onChanged.mock.calls.at(-1)[0].detail).toBe('ada')
})

test('reports valueMissing while a required field is empty', async () => {
  const body = mount('<kb-input name="who" required></kb-input>')
  const input = body.querySelector('kb-input')

  await inner(input, 'input')

  expect(input.checkValidity()).toBe(false)
  expect(input.validity.valueMissing).toBe(true)
})

test('reset() clears the value', async () => {
  const body = mount('<kb-input name="who"></kb-input>')
  const input = body.querySelector('kb-input')
  const control = await inner(input, 'input')

  await userEvent.fill(control, 'ada')
  await vi.waitFor(() => expect(input.value).toBe('ada'))

  input.reset()

  await vi.waitFor(() => expect(control.value).toBe(''))
})
