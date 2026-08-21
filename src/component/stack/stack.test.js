import { inner, mount } from '@test'
import { expect, test } from 'vitest'

test('stays out of the accessibility tree', async () => {
  // A layout box has no meaning of its own; without this it shows up as a
  // generic node wrapping everything it arranges.
  const body = mount('<kb-stack><kb-text>One</kb-text></kb-stack>')
  const stack = body.querySelector('kb-stack')

  await inner(stack, 'slot')

  expect(stack.internals.role).toBe('none')
})
