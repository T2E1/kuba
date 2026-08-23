import { inner, mount } from '@test'
import { expect, test } from 'vitest'

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

test('projects content into its leading and trailing regions', async () => {
  // kb-header's only job is pushing content to opposite ends of a centered
  // row — there is no attribute or event to exercise, so the projection
  // itself is what's asserted.
  const body = mount(`
    <kb-header>
      <kb-text slot="leading" size="xxxs">Your Company</kb-text>
      <kb-text slot="trailing" size="xxxs">Sign out</kb-text>
    </kb-header>
  `)
  const header = body.querySelector('kb-header')

  const leading = await inner(header, 'slot[name="leading"]')
  const trailing = await inner(header, 'slot[name="trailing"]')

  expect(leading.assignedElements()[0].textContent).toBe('Your Company')
  expect(trailing.assignedElements()[0].textContent).toBe('Sign out')
})

test('alt names the landmark when a page has more than one', async () => {
  const body = mount('<kb-header alt="Primary"></kb-header>')
  const header = body.querySelector('kb-header')

  await inner(header, 'wrapper')

  expect(header.internals.ariaLabel).toBe('Primary')
})

test('spaces multiple elements projected into the same region', async () => {
  // A single slot can receive more than one projected element — the gap
  // token is what keeps them from rendering flush against each other.
  // getComputedStyle only proves the declaration exists, not that it's
  // applied to real layout, so geometry is measured via getBoundingClientRect.
  const body = mount(`
    <kb-header>
      <kb-text slot="trailing" size="xxxs">Sign out</kb-text>
      <kb-text slot="trailing" size="xxxs">Settings</kb-text>
    </kb-header>
  `)
  const header = body.querySelector('kb-header')
  const trailing = await inner(header, 'slot[name="trailing"]')
  const [first, second] = trailing.assignedElements()

  const firstRect = first.getBoundingClientRect()
  const secondRect = second.getBoundingClientRect()

  expect(secondRect.left).toBeGreaterThan(firstRect.right)
})

test('leaves leading empty when nothing is slotted into it', async () => {
  const body = mount(`
    <kb-header>
      <kb-text slot="trailing" size="xxxs">Sign out</kb-text>
    </kb-header>
  `)

  const leading = await inner(
    body.querySelector('kb-header'),
    'slot[name="leading"]',
  )

  expect(leading.assignedElements()).toHaveLength(0)
  expect(leading.textContent.trim()).toBe('')
})

test('respects a narrower parent instead of stretching to the viewport', async () => {
  // Regression: the wrapper used `width: 100svw`, which resolves against the
  // viewport regardless of what contains the element. getBoundingClientRect
  // can't tell the two apart here — the wrapper is a block box inside a
  // narrower container, so the browser clips its painted rect to that
  // container either way, `100%` or `100svw`. getComputedStyle exposes the
  // resolved width in pixels before that clipping, which is where `100svw`
  // (the headless window's width) and `100%` (the container's width) diverge.
  const body = mount(`
    <div id="container" style="width: 320px;">
      <kb-header></kb-header>
    </div>
  `)
  const header = body.querySelector('kb-header')
  const container = body.querySelector('#container')

  const wrapper = await inner(header, 'wrapper')

  const wrapperWidth = Number.parseFloat(getComputedStyle(wrapper).width)
  const containerWidth = container.getBoundingClientRect().width

  expect(wrapperWidth).toBeLessThanOrEqual(containerWidth)
})
