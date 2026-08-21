import { clickInner, inner, mount } from '@test'
import { expect, test, vi } from 'vitest'

test('projects src and alt onto its internal image', async () => {
  const body = mount(
    '<kb-cover src="https://picsum.photos/800/450" alt="Product banner"></kb-cover>',
  )

  const img = await inner(body.querySelector('kb-cover'), 'img')

  expect(img.src).toBe('https://picsum.photos/800/450')
  expect(img.alt).toBe('Product banner')
})

test('swaps its source from another element through an arc', async () => {
  const body = mount(`
    <kb-button id="source" value="https://picsum.photos/450/560">Swap</kb-button>
    <kb-cover id="target" src="https://picsum.photos/800/450" alt="Banner" on="#source/clicked:setter/src"></kb-cover>
  `)
  const target = body.querySelector('#target')

  expect(target.src).toBe('https://picsum.photos/800/450')

  await clickInner(body.querySelector('#source'))

  await vi.waitFor(() =>
    expect(target.src).toBe('https://picsum.photos/450/560'),
  )
})

test('applies the default orientation when the attribute is absent', async () => {
  const body = mount('<kb-cover></kb-cover>')
  const cover = body.querySelector('kb-cover')

  expect(cover.orientation).toBe('landscape')
  await vi.waitFor(() =>
    expect(getComputedStyle(cover).aspectRatio).toBe('16 / 9'),
  )
})

test('applies a valid orientation to the aspect ratio', async () => {
  const body = mount('<kb-cover orientation="portrait"></kb-cover>')
  const cover = body.querySelector('kb-cover')

  await vi.waitFor(() =>
    expect(getComputedStyle(cover).aspectRatio).toBe('4 / 5'),
  )
})

test('lays out a taller box in portrait than in landscape', async () => {
  // `getComputedStyle().aspectRatio` only proves the declaration exists —
  // `display: block` is what makes the host actually take that shape, and
  // only `getBoundingClientRect()` observes the box that was really laid
  // out (DESIGN.md bug: inline boxes ignore aspect-ratio entirely).
  const landscape = mount(
    '<kb-cover orientation="landscape"></kb-cover>',
  ).querySelector('kb-cover')
  await vi.waitFor(() =>
    expect(getComputedStyle(landscape).aspectRatio).toBe('16 / 9'),
  )
  const landscapeRect = landscape.getBoundingClientRect()

  const portrait = mount(
    '<kb-cover orientation="portrait"></kb-cover>',
  ).querySelector('kb-cover')
  await vi.waitFor(() =>
    expect(getComputedStyle(portrait).aspectRatio).toBe('4 / 5'),
  )
  const portraitRect = portrait.getBoundingClientRect()

  expect(portraitRect.height / portraitRect.width).toBeGreaterThan(
    landscapeRect.height / landscapeRect.width,
  )
})

test('keeps the default orientation when the attribute is not a known token', async () => {
  // `enumerating(ORIENTATIONS)` never lets an unknown value reach the
  // setter, so the property falls back to its own default rather than the
  // raw string, and the CSS interpolation in style.js never sees it either.
  const body = mount('<kb-cover orientation="square"></kb-cover>')
  const cover = body.querySelector('kb-cover')

  expect(cover.orientation).toBe('landscape')
  await vi.waitFor(() =>
    expect(getComputedStyle(cover).aspectRatio).toBe('16 / 9'),
  )
})

test('keeps the last valid orientation when the attribute changes to an unknown token', async () => {
  const body = mount('<kb-cover orientation="portrait"></kb-cover>')
  const cover = body.querySelector('kb-cover')
  await vi.waitFor(() =>
    expect(getComputedStyle(cover).aspectRatio).toBe('4 / 5'),
  )

  cover.setAttribute('orientation', 'square')

  await vi.waitFor(() => expect(cover.orientation).toBe('portrait'))
  expect(getComputedStyle(cover).aspectRatio).toBe('4 / 5')
})

test('accepts a valid orientation set after an invalid one was rejected', async () => {
  const body = mount('<kb-cover orientation="square"></kb-cover>')
  const cover = body.querySelector('kb-cover')

  cover.setAttribute('orientation', 'portrait')

  await vi.waitFor(() => expect(cover.orientation).toBe('portrait'))
})

test('escapes alt so it cannot break out of the attribute', async () => {
  // component.js interpolates `alt` straight into `alt="..."` — the
  // `escaping` filter is what keeps a value like this from closing the
  // attribute and injecting a new one into the shadow root's <img>.
  const payload = `x" onerror="window.__pwned = true`
  const body = mount(
    '<kb-cover src="https://picsum.photos/800/450"></kb-cover>',
  )
  const cover = body.querySelector('kb-cover')
  await inner(cover, 'img')

  cover.setAttribute('alt', payload)

  await vi.waitFor(async () => {
    const img = await inner(cover, 'img')
    expect(img.getAttribute('alt')).toBe(payload)
    expect(img.hasAttribute('onerror')).toBe(false)
  })
})

test('escapes src so it cannot break out of the attribute', async () => {
  const payload = `x" onerror="window.__pwned = true`
  const body = mount(
    '<kb-cover src="https://picsum.photos/800/450"></kb-cover>',
  )
  const cover = body.querySelector('kb-cover')
  await inner(cover, 'img')

  cover.setAttribute('src', payload)

  await vi.waitFor(async () => {
    const img = await inner(cover, 'img')
    expect(img.getAttribute('src')).toBe(payload)
    expect(img.hasAttribute('onerror')).toBe(false)
  })
})

test('reflects hidden onto internals.states', async () => {
  const body = mount('<kb-cover hidden></kb-cover>')
  const cover = body.querySelector('kb-cover')

  await vi.waitFor(() =>
    expect(cover.internals.states.has('hidden')).toBe(true),
  )
})
