import { clickInner, mount } from '@test'
import { expect, test, vi } from 'vitest'

/** Reads the adopted `:host` rule's inline style declaration block. */
async function declarations(text) {
  await vi.waitFor(() =>
    expect(text.shadowRoot.adoptedStyleSheets).toHaveLength(1),
  )
  const [sheet] = text.shadowRoot.adoptedStyleSheets
  return sheet.cssRules[0].style
}

test('applies the default tokens when no attribute is set', async () => {
  const body = mount('<kb-text>Hello</kb-text>')
  const text = body.querySelector('kb-text')

  const style = await declarations(text)

  expect(style.color).toBe('var(--text-color, var(--color-master-dark))')
  expect(style.textAlign).toBe('left')
})

test('resolves a valid color to its token custom property', async () => {
  const body = mount('<kb-text color="danger">Hello</kb-text>')
  const text = body.querySelector('kb-text')

  const style = await declarations(text)

  expect(text.color).toBe('danger')
  expect(style.color).toBe('var(--text-color, var(--color-danger))')
})

test('resolves a valid family to its token custom property', async () => {
  const body = mount('<kb-text family="highlight">Hello</kb-text>')
  const text = body.querySelector('kb-text')

  const style = await declarations(text)

  expect(text.family).toBe('highlight')
  expect(style.fontFamily).toBe(
    'var(--text-font-family, var(--font-family-highlight))',
  )
})

test('resolves a valid line height to its token custom property', async () => {
  const body = mount('<kb-text line-height="xl">Hello</kb-text>')
  const text = body.querySelector('kb-text')

  const style = await declarations(text)

  expect(text.lineHeight).toBe('xl')
  expect(style.lineHeight.replace(/\s+/g, ' ')).toBe(
    'var( --text-line-height, var(--line-height-xl) )',
  )
})

test('resolves a valid size to its token custom property', async () => {
  const body = mount('<kb-text size="lg">Hello</kb-text>')
  const text = body.querySelector('kb-text')

  const style = await declarations(text)

  expect(text.size).toBe('lg')
  expect(style.fontSize).toBe('var(--text-font-size, var(--font-size-lg))')
})

test('resolves a valid weight to its token custom property', async () => {
  const body = mount('<kb-text weight="bold">Hello</kb-text>')
  const text = body.querySelector('kb-text')

  const style = await declarations(text)

  expect(text.weight).toBe('bold')
  expect(style.fontWeight).toBe(
    'var(--text-font-weight, var(--font-weight-bold))',
  )
})

test('reflects a valid align directly onto text-align', async () => {
  const body = mount('<kb-text align="center">Hello</kb-text>')
  const text = body.querySelector('kb-text')

  const style = await declarations(text)

  expect(text.align).toBe('center')
  expect(style.textAlign).toBe('center')
})

test('keeps the default color when the attribute is not a known token', async () => {
  const body = mount('<kb-text color="rainbow">Hello</kb-text>')
  const text = body.querySelector('kb-text')

  const style = await declarations(text)

  expect(text.color).toBe('master-dark')
  expect(style.color).toBe('var(--text-color, var(--color-master-dark))')
})

test('keeps the default family when the attribute is not a known token', async () => {
  const body = mount('<kb-text family="comic-sans">Hello</kb-text>')
  const text = body.querySelector('kb-text')

  const style = await declarations(text)

  expect(text.family).toBe('base')
  expect(style.fontFamily).toBe(
    'var(--text-font-family, var(--font-family-base))',
  )
})

test('keeps the default weight when the attribute is not a known token', async () => {
  const body = mount('<kb-text weight="900">Hello</kb-text>')
  const text = body.querySelector('kb-text')

  const style = await declarations(text)

  expect(text.weight).toBe('regular')
  expect(style.fontWeight).toBe(
    'var(--text-font-weight, var(--font-weight-regular))',
  )
})

test('keeps the default line height when the attribute is not a known token', async () => {
  const body = mount('<kb-text line-height="tight">Hello</kb-text>')
  const text = body.querySelector('kb-text')

  const style = await declarations(text)

  expect(text.lineHeight).toBe('lg')
  expect(style.lineHeight.replace(/\s+/g, ' ')).toBe(
    'var( --text-line-height, var(--line-height-lg) )',
  )
})

test('keeps the last valid size when a later attribute write is not a known token', async () => {
  const body = mount('<kb-text size="xl">Hello</kb-text>')
  const text = body.querySelector('kb-text')
  text.setAttribute('size', 'enormous')

  const style = await declarations(text)

  expect(text.size).toBe('xl')
  expect(style.fontSize).toBe('var(--text-font-size, var(--font-size-xl))')
})

test('receives a token through an arc, as an Echo sink', async () => {
  // `on` routes #source's `clicked` payload straight onto this element's
  // `size` property (`setter` sink). Echo in the chain is what observes `on`
  // and connects the shared bus to this host.
  const body = mount(`
    <kb-button id="source" value="lg">Source</kb-button>
    <kb-text id="target" on="#source/clicked:setter/size">Hello</kb-text>
  `)
  const target = body.querySelector('#target')

  await clickInner(body.querySelector('#source'))

  await vi.waitFor(() => expect(target.size).toBe('lg'))
})

test('rejects a CSS injection payload carried by the align attribute', async () => {
  // `align` is interpolated directly into `text-align` (not routed through a
  // custom property), so `enumerated(ALIGNS)` is the only thing standing
  // between an attacker-controlled string and arbitrary CSS.
  const payload = 'left; } :host { outline: 9px solid red; } trap {'
  const body = mount(`<kb-text align="${payload}">Hello</kb-text>`)
  const text = body.querySelector('kb-text')

  const style = await declarations(text)

  expect(text.align).toBe('left')
  expect(style.textAlign).toBe('left')
})
