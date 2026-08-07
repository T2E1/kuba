import { expect, test, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { inner, mount } from '../../../vitest.helpers.js'

const markup = `
  <kb-form autorender>
    <template>
      <kb-input name="email" type="email" required>
        <kb-label>Email</kb-label>
      </kb-input>
      <kb-button type="submit">Send</kb-button>
    </template>
  </kb-form>
`

test('publishes submitted with the parsed form data', async () => {
  const body = mount(markup)
  const form = body.querySelector('kb-form')
  const onSubmitted = vi.fn()
  form.addEventListener('submitted', onSubmitted)

  // Each rendered field is itself a custom element with its own shadow root,
  // so reaching the native control crosses a second boundary. The click has to
  // land on kb-button's inner <button> for the same reason.
  const field = await inner(form, 'kb-input')
  await userEvent.fill(await inner(field, 'input'), 'ada@example.com')
  await userEvent.click(await inner(await inner(form, 'kb-button'), 'button'))

  await vi.waitFor(() => expect(onSubmitted).toHaveBeenCalledOnce())
  expect(onSubmitted.mock.calls[0][0].detail).toEqual({
    email: 'ada@example.com',
  })
})

test('publishes resetted with an empty detail', async () => {
  const body = mount(markup)
  const form = body.querySelector('kb-form')
  const onResetted = vi.fn()
  form.addEventListener('resetted', onResetted)

  await inner(form, 'kb-input')
  form.reset()

  await vi.waitFor(() => expect(onResetted).toHaveBeenCalledOnce())
  expect(onResetted.mock.calls[0][0].detail).toEqual({})
})

test('native validation blocks a submit with an invalid field', async () => {
  const body = mount(markup)
  const form = body.querySelector('kb-form')
  const onSubmitted = vi.fn()
  form.addEventListener('submitted', onSubmitted)

  await userEvent.click(await inner(await inner(form, 'kb-button'), 'button'))

  await new Promise((resolve) => setTimeout(resolve, 100))
  expect(onSubmitted).not.toHaveBeenCalled()
})
