import { expect, test, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { inner, mount } from '../../../vitest.helpers.js'

// A 1x1 transparent GIF — the smallest real image a FileReader can encode, so
// the test exercises the actual read path instead of stubbing it.
const PIXEL_GIF = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

function pixelFile() {
  const bytes = Uint8Array.from(atob(PIXEL_GIF), (char) => char.charCodeAt(0))
  return new File([bytes], 'pixel.gif', { type: 'image/gif' })
}

test('dispatches changed with the file encoded as a data URL', async () => {
  // `@on.change('input', files)` hands the picked File to a FileReader, so
  // `file` is only set once the read resolves.
  const body = mount('<kb-fileupload name="avatar"></kb-fileupload>')
  const fileupload = body.querySelector('kb-fileupload')
  const onChanged = vi.fn()
  fileupload.addEventListener('changed', onChanged)

  await userEvent.upload(
    await inner(fileupload, 'input[type="file"]'),
    pixelFile(),
  )

  await vi.waitFor(() => expect(onChanged).toHaveBeenCalledOnce())
  expect(onChanged.mock.calls[0][0].detail).toContain('data:image/gif;base64,')
})

test('reports valueMissing while required and empty', async () => {
  const body = mount('<kb-fileupload name="avatar" required></kb-fileupload>')
  const fileupload = body.querySelector('kb-fileupload')

  await inner(fileupload, 'input[type="file"]')

  expect(fileupload.checkValidity()).toBe(false)
  expect(fileupload.validity.valueMissing).toBe(true)
})
