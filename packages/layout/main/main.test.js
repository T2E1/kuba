import { expect, test } from 'vitest'
import { inner, mount } from '../../../vitest.helpers.js'

test('is the main landmark', async () => {
  // The shadow root is a bare <slot>, so without this the page has no `main`
  // for a screen reader to skip to.
  const body = mount('<kb-main></kb-main>')
  const main = body.querySelector('kb-main')

  await inner(main, 'slot')

  expect(main.internals.role).toBe('main')
})
