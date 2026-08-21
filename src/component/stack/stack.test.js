import { inner, mount } from '@test'
import { expect, test, vi } from 'vitest'

test('stays out of the accessibility tree', async () => {
  // A layout box has no meaning of its own; without this it shows up as a
  // generic node wrapping everything it arranges.
  const body = mount('<kb-stack><kb-text>One</kb-text></kb-stack>')
  const stack = body.querySelector('kb-stack')

  await inner(stack, 'slot')

  expect(stack.internals.role).toBe('none')
})

test('keeps the default direction when the attribute is not a known token', async () => {
  // `enumerating(DIRECTIONS)` never lets an unknown value reach the setter,
  // so the property falls back to its own default rather than the raw
  // string, and the CSS interpolation in style.js never sees it either.
  const body = mount('<kb-stack direction="diagonal"></kb-stack>')
  const stack = body.querySelector('kb-stack')

  expect(stack.direction).toBe('row')
})

test('keeps the last valid direction when the attribute changes to an unknown token', async () => {
  const body = mount('<kb-stack direction="column"></kb-stack>')
  const stack = body.querySelector('kb-stack')
  await inner(stack, 'slot')
  expect(stack.direction).toBe('column')

  stack.setAttribute('direction', 'diagonal')

  await vi.waitFor(() => expect(stack.direction).toBe('column'))
})
