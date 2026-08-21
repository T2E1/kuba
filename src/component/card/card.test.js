import { mount } from '@test'
import { expect, test, vi } from 'vitest'

test('applies the default direction when the attribute is absent', async () => {
  const body = mount('<kb-card></kb-card>')
  const card = body.querySelector('kb-card')

  expect(card.direction).toBe('column')
  await vi.waitFor(() =>
    expect(getComputedStyle(card).flexDirection).toBe('column'),
  )
})

test('applies a valid direction to the flex layout', async () => {
  const body = mount('<kb-card direction="row"></kb-card>')
  const card = body.querySelector('kb-card')

  await vi.waitFor(() =>
    expect(getComputedStyle(card).flexDirection).toBe('row'),
  )
})

test('keeps the default direction when the attribute is not a known token', async () => {
  // `enumerating(DIRECTIONS)` never lets an unknown value reach the setter,
  // so the property falls back to its own default rather than the raw
  // string, and the CSS interpolation in style.js never sees it either.
  const body = mount('<kb-card direction="diagonal"></kb-card>')
  const card = body.querySelector('kb-card')

  expect(card.direction).toBe('column')
  await vi.waitFor(() =>
    expect(getComputedStyle(card).flexDirection).toBe('column'),
  )
})

test('keeps the last valid direction when the attribute changes to an unknown token', async () => {
  const body = mount('<kb-card direction="row"></kb-card>')
  const card = body.querySelector('kb-card')
  await vi.waitFor(() => expect(card.direction).toBe('row'))

  card.setAttribute('direction', 'diagonal')

  await vi.waitFor(() => expect(card.direction).toBe('row'))
  expect(getComputedStyle(card).flexDirection).toBe('row')
})

test('accepts a valid direction set after an invalid one was rejected', async () => {
  const body = mount('<kb-card direction="diagonal"></kb-card>')
  const card = body.querySelector('kb-card')

  card.setAttribute('direction', 'row')

  await vi.waitFor(() => expect(card.direction).toBe('row'))
})
