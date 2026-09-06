import { clickInner, inner, mount } from '@test'
import { expect, test, vi } from 'vitest'

/** Reads the adopted `:host` rule's inline style declaration block. */
async function declarations(inset) {
  await vi.waitFor(() =>
    expect(inset.shadowRoot.adoptedStyleSheets.length).toBeGreaterThan(0),
  )
  const [sheet] = inset.shadowRoot.adoptedStyleSheets
  return sheet.cssRules[0].style
}

test('stays out of the accessibility tree', async () => {
  // The element is negative spacing; whatever bleeds to the edge keeps its own
  // semantics, and the box around it carries none.
  const body = mount('<kb-inset side="top"><kb-text>One</kb-text></kb-inset>')
  const inset = body.querySelector('kb-inset')

  await inner(inset, 'slot')

  expect(inset.internals.role).toBe('none')
})

test('applies the default side and direction when no attribute is set', async () => {
  const body = mount('<kb-inset><kb-text>One</kb-text></kb-inset>')
  const inset = body.querySelector('kb-inset')

  const style = await declarations(inset)

  expect(inset.side).toBe('all')
  expect(inset.direction).toBe('column')
  expect(style.flexDirection).toBe('column')
})

test('reflects a valid direction directly onto flex-direction', async () => {
  const body = mount(
    '<kb-inset direction="row"><kb-text>One</kb-text></kb-inset>',
  )
  const inset = body.querySelector('kb-inset')

  const style = await declarations(inset)

  expect(inset.direction).toBe('row')
  expect(style.flexDirection).toBe('row')
})

test('keeps the default direction when the attribute is not a known keyword', async () => {
  const body = mount(
    '<kb-inset direction="diagonal"><kb-text>One</kb-text></kb-inset>',
  )
  const inset = body.querySelector('kb-inset')

  const style = await declarations(inset)

  expect(inset.direction).toBe('column')
  expect(style.flexDirection).toBe('column')
})

test('keeps the last valid side when a later attribute write is not a known keyword', async () => {
  const body = mount('<kb-inset side="top"><kb-text>One</kb-text></kb-inset>')
  const inset = body.querySelector('kb-inset')
  inset.setAttribute('side', 'sideways')

  await declarations(inset)

  expect(inset.side).toBe('top')
})

test('rejects a CSS injection payload carried by the direction attribute', async () => {
  // `direction` is interpolated directly into `flex-direction` (not routed
  // through a custom property), so `enumerated(DIRECTIONS)` is the only thing
  // standing between an attacker-controlled string and arbitrary CSS.
  const payload = 'row; } :host { outline: 9px solid red; } trap {'
  const body = mount(
    `<kb-inset direction="${payload}"><kb-text>One</kb-text></kb-inset>`,
  )
  const inset = body.querySelector('kb-inset')

  const style = await declarations(inset)

  expect(inset.direction).toBe('column')
  expect(style.flexDirection).toBe('column')
})

test('receives a keyword through an arc, as an Echo sink', async () => {
  // `on` routes #source's `clicked` payload straight onto this element's
  // `direction` property (`setter` sink). Echo in the chain is what observes
  // `on` and connects the shared bus to this host.
  const body = mount(`
    <kb-button id="source" value="row">Source</kb-button>
    <kb-inset id="target" on="#source/clicked:setter/direction"><kb-text>One</kb-text></kb-inset>
  `)
  const target = body.querySelector('#target')

  await clickInner(body.querySelector('#source'))

  await vi.waitFor(() => expect(target.direction).toBe('row'))
})
