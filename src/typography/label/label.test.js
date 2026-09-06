import { mount } from '@test'
import { expect, test, vi } from 'vitest'

test('assigns itself to the label slot on connect', async () => {
  const body = mount('<kb-label>Full name</kb-label>')
  const label = body.querySelector('kb-label')

  await vi.waitFor(() => expect(label.getAttribute('slot')).toBe('label'))
})
