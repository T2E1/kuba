import { expect, test } from 'vitest'
import { inner, mount } from '../../../vitest.helpers.js'

test('is the page banner landmark', async () => {
  const body = mount('<kb-header></kb-header>')
  const header = body.querySelector('kb-header')

  await inner(header, 'wrapper')

  expect(header.internals.role).toBe('banner')
})

test('holds the only banner in its shadow root', async () => {
  // A <header> inside the shadow root would map to `banner` as well, leaving
  // two nested landmarks — the wrapper is deliberately a non-semantic tag.
  const body = mount('<kb-header></kb-header>')
  const header = body.querySelector('kb-header')

  await inner(header, 'wrapper')

  expect(header.shadowRoot.querySelector('header')).toBe(null)
})

test('alt names the landmark when a page has more than one', async () => {
  const body = mount('<kb-header alt="Primary"></kb-header>')
  const header = body.querySelector('kb-header')

  await inner(header, 'wrapper')

  expect(header.internals.ariaLabel).toBe('Primary')
})
