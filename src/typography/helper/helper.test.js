import { mount } from '@test'
import { expect, test, vi } from 'vitest'

test('assigns itself to the helper slot on connect', async () => {
  const body = mount('<kb-helper>This field is required.</kb-helper>')
  const helper = body.querySelector('kb-helper')

  await vi.waitFor(() => expect(helper.getAttribute('slot')).toBe('helper'))
})
