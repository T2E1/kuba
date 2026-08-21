import { mount } from '@test'
import { expect, test, vi } from 'vitest'

test('hides itself when it carries no name', async () => {
  // Decorative is the right default: without a name the ligature text is what
  // gets announced, so this icon would read as "delete".
  const body = mount('<kb-icon use="delete"></kb-icon>')

  const icon = body.querySelector('kb-icon')

  await vi.waitFor(() => expect(icon.internals.ariaHidden).toBe('true'))
})

test('becomes an image once it is named', async () => {
  const body = mount('<kb-icon use="delete" alt="Delete"></kb-icon>')

  const icon = body.querySelector('kb-icon')

  await vi.waitFor(() => expect(icon.internals.ariaHidden).toBe('false'))
})

test('announces the name, not the ligature', async () => {
  const body = mount('<kb-icon use="cloud_upload" alt="Upload"></kb-icon>')

  const icon = body.querySelector('kb-icon')

  await vi.waitFor(() => expect(icon.internals.ariaLabel).toBe('Upload'))
})

test('is an image to assistive technology', async () => {
  const body = mount('<kb-icon use="delete" alt="Delete"></kb-icon>')

  const icon = body.querySelector('kb-icon')

  await vi.waitFor(() => expect(icon.internals.role).toBe('img'))
})

test('stops hiding when a name arrives after mount', async () => {
  const body = mount('<kb-icon use="delete"></kb-icon>')
  const icon = body.querySelector('kb-icon')
  await vi.waitFor(() => expect(icon.internals.ariaHidden).toBe('true'))

  icon.setAttribute('alt', 'Delete')

  await vi.waitFor(() => expect(icon.internals.ariaHidden).toBe('false'))
})
