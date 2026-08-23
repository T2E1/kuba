import { mount } from '@test'
import { expect, test, vi } from 'vitest'

/**
 * Reads the fallback resolved for `--icon-color` in the icon's adopted
 * `:host` rule — the part of `var(--icon-color, <fallback>)` that style.js
 * computes from the `color` token.
 */
function resolvedColor(icon) {
  const [sheet] = icon.shadowRoot.adoptedStyleSheets
  const declaration = sheet.cssRules[0].style.color
  return declaration.replace('var(--icon-color, ', '').replace(/\)$/, '')
}

test('hides itself when it carries no name', async () => {
  // Decorative is the right default: without a name the ligature text is what
  // gets announced, so this icon would read as "delete".
  const body = mount('<kb-icon use="delete"></kb-icon>')

  const icon = body.querySelector('kb-icon')

  await vi.waitFor(() => expect(icon.internals.ariaHidden).toBe('true'))
})

test('becomes an image once it is named', async () => {
  const body = mount('<kb-icon use="delete" alt="Delete"></kb-icon>')

  const icon = body.querySelector('kb-icon')

  await vi.waitFor(() => expect(icon.internals.ariaHidden).toBe('false'))
})

test('announces the name, not the ligature', async () => {
  const body = mount('<kb-icon use="cloud_upload" alt="Upload"></kb-icon>')

  const icon = body.querySelector('kb-icon')

  await vi.waitFor(() => expect(icon.internals.ariaLabel).toBe('Upload'))
})

test('is an image to assistive technology', async () => {
  const body = mount('<kb-icon use="delete" alt="Delete"></kb-icon>')

  const icon = body.querySelector('kb-icon')

  await vi.waitFor(() => expect(icon.internals.role).toBe('img'))
})

test('stops hiding when a name arrives after mount', async () => {
  const body = mount('<kb-icon use="delete"></kb-icon>')
  const icon = body.querySelector('kb-icon')
  await vi.waitFor(() => expect(icon.internals.ariaHidden).toBe('true'))

  icon.setAttribute('alt', 'Delete')

  await vi.waitFor(() => expect(icon.internals.ariaHidden).toBe('false'))
})

test('resolves color to currentColor when the attribute is absent', async () => {
  const body = mount('<kb-icon></kb-icon>')
  const icon = body.querySelector('kb-icon')

  await vi.waitFor(() =>
    expect(icon.shadowRoot.adoptedStyleSheets).toHaveLength(1),
  )

  expect(icon.color).toBeUndefined()
  expect(resolvedColor(icon)).toBe('currentColor')
})

test('resolves a valid color to its token custom property', async () => {
  const body = mount('<kb-icon color="primary"></kb-icon>')
  const icon = body.querySelector('kb-icon')

  await vi.waitFor(() =>
    expect(icon.shadowRoot.adoptedStyleSheets).toHaveLength(1),
  )

  expect(icon.color).toBe('primary')
  expect(resolvedColor(icon)).toBe('var(--color-primary)')
})

test('keeps currentColor when the color attribute is not a known token', async () => {
  // `enumerated(COLORS)` never lets an unknown value reach the setter, so
  // the property falls back to its own default rather than the raw string.
  const body = mount('<kb-icon color="rainbow"></kb-icon>')
  const icon = body.querySelector('kb-icon')

  await vi.waitFor(() =>
    expect(icon.shadowRoot.adoptedStyleSheets).toHaveLength(1),
  )

  expect(icon.color).toBeUndefined()
  expect(resolvedColor(icon)).toBe('currentColor')
})

test('keeps the last valid color when the attribute changes to an unknown token', async () => {
  const body = mount('<kb-icon color="primary"></kb-icon>')
  const icon = body.querySelector('kb-icon')
  await vi.waitFor(() => expect(icon.color).toBe('primary'))

  icon.setAttribute('color', 'rainbow')

  await vi.waitFor(() =>
    expect(resolvedColor(icon)).toBe('var(--color-primary)'),
  )
  expect(icon.color).toBe('primary')
})

test('applies the default size when the attribute is absent', async () => {
  const body = mount('<kb-icon></kb-icon>')
  const icon = body.querySelector('kb-icon')

  await vi.waitFor(() =>
    expect(icon.shadowRoot.adoptedStyleSheets).toHaveLength(1),
  )

  expect(icon.size).toBe('md')
})

test('applies a valid size', async () => {
  const body = mount('<kb-icon size="lg"></kb-icon>')
  const icon = body.querySelector('kb-icon')

  await vi.waitFor(() =>
    expect(icon.shadowRoot.adoptedStyleSheets).toHaveLength(1),
  )

  expect(icon.size).toBe('lg')
})

test('keeps the default size when the attribute is not a known token', async () => {
  // Same closed-set guard as `color`: an unknown `size` never reaches the
  // setter, so the property keeps its own default.
  const body = mount('<kb-icon size="huge"></kb-icon>')
  const icon = body.querySelector('kb-icon')

  await vi.waitFor(() =>
    expect(icon.shadowRoot.adoptedStyleSheets).toHaveLength(1),
  )

  expect(icon.size).toBe('md')
})

test('keeps the last valid size when the attribute changes to an unknown token', async () => {
  const body = mount('<kb-icon size="lg"></kb-icon>')
  const icon = body.querySelector('kb-icon')
  await vi.waitFor(() => expect(icon.size).toBe('lg'))

  icon.setAttribute('size', 'huge')

  await vi.waitFor(() => expect(icon.size).toBe('lg'))
})

test('rejects a CSS injection payload carried by the size attribute', async () => {
  // Reproduces the exploit recorded in DESIGN.md: a payload closing the
  // `font-size` declaration early used to append an arbitrary `:host` rule
  // to the shadow root's stylesheet. `enumerated(SIZES)` must keep the
  // attribute from ever reaching that interpolation.
  const payload =
    'md)); } :host { outline: 9px solid red; } trap { font-size: var(--a'
  const body = mount(`<kb-icon size="${payload}"></kb-icon>`)
  const icon = body.querySelector('kb-icon')

  await vi.waitFor(() =>
    expect(icon.shadowRoot.adoptedStyleSheets).toHaveLength(1),
  )

  const [sheet] = icon.shadowRoot.adoptedStyleSheets
  expect(sheet.cssRules).toHaveLength(1)
  expect(sheet.cssRules[0].selectorText).toBe(':host')
})

test('rejects a CSS injection payload carried by the color attribute', async () => {
  const payload =
    'primary)); } :host { outline: 7px solid lime; } trap { color: var(--z'
  const body = mount(`<kb-icon color="${payload}"></kb-icon>`)
  const icon = body.querySelector('kb-icon')

  await vi.waitFor(() =>
    expect(icon.shadowRoot.adoptedStyleSheets).toHaveLength(1),
  )

  const [sheet] = icon.shadowRoot.adoptedStyleSheets
  expect(sheet.cssRules).toHaveLength(1)
  expect(sheet.cssRules[0].selectorText).toBe(':host')
})

test('escapes use so it cannot inject markup into the shadow root', async () => {
  // `component.js` returns `icon.use` verbatim and paint/render.js writes it
  // via `innerHTML` — unlike `alt`, this value becomes real markup.
  const payload = '<img src=x onerror="window.__pwned=1">'
  const body = mount(`<kb-icon use="${payload}"></kb-icon>`)
  const icon = body.querySelector('kb-icon')

  await vi.waitFor(() => expect(icon.shadowRoot.innerHTML).not.toBe(''))

  expect(icon.shadowRoot.querySelector('img')).toBe(null)
  expect(window.__pwned).toBeUndefined()
})

test('resolves a valid color assigned through the property', async () => {
  const body = mount('<kb-icon></kb-icon>')
  const icon = body.querySelector('kb-icon')
  await vi.waitFor(() =>
    expect(icon.shadowRoot.adoptedStyleSheets).toHaveLength(1),
  )

  icon.color = 'danger'

  expect(icon.color).toBe('danger')
  await vi.waitFor(() =>
    expect(resolvedColor(icon)).toBe('var(--color-danger)'),
  )
})

test('applies a valid size assigned through the property', async () => {
  const body = mount('<kb-icon></kb-icon>')
  const icon = body.querySelector('kb-icon')
  await vi.waitFor(() =>
    expect(icon.shadowRoot.adoptedStyleSheets).toHaveLength(1),
  )

  icon.size = 'lg'

  expect(icon.size).toBe('lg')
})
