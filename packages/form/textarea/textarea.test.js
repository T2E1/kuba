import { expect, test, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { inner, mount } from '../../../vitest.helpers.js'

test('dispatches changed with the typed value', async () => {
  // The same event name <kb-input> and <kb-fileupload> publish, so one arc
  // works for any of the three fields.
  const body = mount('<kb-textarea name="bio"></kb-textarea>')
  const textarea = body.querySelector('kb-textarea')
  const onChanged = vi.fn()
  textarea.addEventListener('changed', onChanged)

  await userEvent.fill(await inner(textarea, 'textarea'), 'hi')

  await vi.waitFor(() => expect(onChanged).toHaveBeenCalled())
  expect(onChanged.mock.calls.at(-1)[0].detail).toBe('hi')
})

test('grows to fit its content', async () => {
  // `@on.input('textarea')` re-measures scrollHeight on every input, so the
  // box fits its content instead of scrolling — the one behavior with no
  // attribute exposing it.
  const body = mount('<kb-textarea name="bio"></kb-textarea>')
  const control = await inner(body.querySelector('kb-textarea'), 'textarea')

  await userEvent.fill(control, 'one')
  const oneLine = Number.parseInt(control.style.height, 10)

  await userEvent.fill(control, 'one\ntwo\nthree\nfour\nfive\nsix\nseven')

  await vi.waitFor(() =>
    expect(Number.parseInt(control.style.height, 10)).toBeGreaterThan(oneLine),
  )
})
