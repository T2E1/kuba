import { expect, test } from 'vitest'
import { inner, mount } from '../../../vitest.helpers.js'

test('stays out of the accessibility tree', async () => {
  // The element is negative spacing; whatever bleeds to the edge keeps its own
  // semantics, and the box around it carries none.
  const body = mount('<kb-inset side="top"><kb-text>One</kb-text></kb-inset>')
  const inset = body.querySelector('kb-inset')

  await inner(inset, 'slot')

  expect(inset.internals.role).toBe('none')
})
