import { clickInner, inner, mount } from '@test'
import { expect, test, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

test('dispatches clicked carrying its value', async () => {
  const body = mount('<kb-button value="42">Save</kb-button>')
  const button = body.querySelector('kb-button')
  const onClicked = vi.fn()
  button.addEventListener('clicked', onClicked)

  await clickInner(button)

  // `around(dispatch)` fires "clicked" a tick after click() returns.
  await vi.waitFor(() => expect(onClicked).toHaveBeenCalledOnce())
  expect(onClicked.mock.calls[0][0].detail).toBe('42')
})

test('submits an owning form', async () => {
  // `type="submit"` (the default) calls `internals.form?.requestSubmit()` —
  // form association happens because the button is a form-associated custom
  // element nested in a real <form>.
  const body = mount('<form><kb-button type="submit">Save</kb-button></form>')
  const onSubmit = vi.fn((event) => event.preventDefault())
  body.querySelector('form').addEventListener('submit', onSubmit)

  await clickInner(body.querySelector('kb-button'))

  expect(onSubmit).toHaveBeenCalledOnce()
})

test('resets an owning form', async () => {
  const body = mount(
    '<form><input name="note" value="original" /><kb-button type="reset">Reset</kb-button></form>',
  )
  const input = body.querySelector('input')

  await userEvent.fill(input, 'changed')
  expect(input).toHaveValue('changed')

  await clickInner(body.querySelector('kb-button'))

  expect(input).toHaveValue('original')
})

test('wires a payload to another element through an arc', async () => {
  // `on` assigns #source's `clicked` payload straight to #target's `value`
  // property (`setter` sink), with no listener written by the page.
  const body = mount(`
    <kb-button id="source" value="42">Source</kb-button>
    <kb-button id="target" on="#source/clicked:setter/value">Target</kb-button>
  `)
  const target = body.querySelector('#target')

  expect(target.value).toBeUndefined()

  await clickInner(body.querySelector('#source'))

  await vi.waitFor(() => expect(target.value).toBe('42'))
})

test('names the inner control, not the host', async () => {
  // The <button> in the shadow root is what the accessibility tree treats as
  // the button, so the name has to land there — naming the host would name a
  // wrapper no one ever focuses.
  const body = mount('<kb-button variant="icon" alt="Delete"></kb-button>')
  const button = body.querySelector('kb-button')

  const control = await inner(button, 'button')

  expect(control.getAttribute('aria-label')).toBe('Delete')
})

test('leaves the control unnamed when alt is absent', async () => {
  // A button with visible text takes its name from that text; an empty
  // aria-label would erase it.
  const body = mount('<kb-button>Save</kb-button>')
  const button = body.querySelector('kb-button')

  const control = await inner(button, 'button')

  expect(control.hasAttribute('aria-label')).toBe(false)
})

test('follows alt when it changes after mount', async () => {
  const body = mount('<kb-button variant="icon" alt="Delete"></kb-button>')
  const button = body.querySelector('kb-button')
  await inner(button, 'button')

  button.setAttribute('alt', 'Remove')

  await vi.waitFor(async () =>
    expect((await inner(button, 'button')).getAttribute('aria-label')).toBe(
      'Remove',
    ),
  )
})

test('escapes alt so it cannot break out of the attribute', async () => {
  // component.js interpolates `alt` straight into `aria-label="..."` — the
  // `escaping` filter is what keeps a value like this from closing the
  // attribute and injecting a new one into the shadow root.
  const payload = `x" onfocus="window.__pwned = true`
  const body = mount('<kb-button>Save</kb-button>')
  const button = body.querySelector('kb-button')
  await inner(button, 'button')

  button.setAttribute('alt', payload)

  await vi.waitFor(async () => {
    const control = await inner(button, 'button')
    expect(control.getAttribute('aria-label')).toBe(payload)
    expect(control.hasAttribute('onfocus')).toBe(false)
  })
})

test('blocks clicked while disabled', async () => {
  const body = mount('<kb-button disabled>Save</kb-button>')
  const button = body.querySelector('kb-button')
  const onClicked = vi.fn()
  button.addEventListener('clicked', onClicked)
  const control = await inner(button, 'button')

  await userEvent.click(control, { force: true })

  expect(onClicked).not.toHaveBeenCalled()
})

test('blocks form submission while disabled', async () => {
  const body = mount(
    '<form><kb-button disabled type="submit">Save</kb-button></form>',
  )
  const onSubmit = vi.fn((event) => event.preventDefault())
  body.querySelector('form').addEventListener('submit', onSubmit)
  const control = await inner(body.querySelector('kb-button'), 'button')

  await userEvent.click(control, { force: true })

  expect(onSubmit).not.toHaveBeenCalled()
})

test('inherits disabled from an enclosing fieldset', async () => {
  const body = mount(
    '<form><fieldset disabled><kb-button>Save</kb-button></fieldset></form>',
  )
  const button = body.querySelector('kb-button')

  await vi.waitFor(() => expect(button.disabled).toBe(true))
})

test('dispatches clicked on Enter while focused', async () => {
  const body = mount('<kb-button value="42">Save</kb-button>')
  const button = body.querySelector('kb-button')
  const onClicked = vi.fn()
  button.addEventListener('clicked', onClicked)
  const control = await inner(button, 'button')

  control.focus()
  await userEvent.keyboard('{Enter}')

  await vi.waitFor(() => expect(onClicked).toHaveBeenCalledOnce())
  expect(onClicked.mock.calls[0][0].detail).toBe('42')
})

test('delegates focus to the inner control on Tab', async () => {
  const body = mount('<kb-button>Save</kb-button>')
  const button = body.querySelector('kb-button')
  const control = await inner(button, 'button')

  await userEvent.tab()

  expect(document.activeElement).toBe(button)
  expect(button.shadowRoot.activeElement).toBe(control)
})

test('emits clicked on submit outside of a form', async () => {
  const body = mount('<kb-button type="submit" value="42">Save</kb-button>')
  const button = body.querySelector('kb-button')
  const onClicked = vi.fn()
  button.addEventListener('clicked', onClicked)

  await clickInner(button)

  await vi.waitFor(() => expect(onClicked).toHaveBeenCalledOnce())
  expect(onClicked.mock.calls[0][0].detail).toBe('42')
})

test('does not submit or reset an owning form when type is button', async () => {
  const body = mount(
    '<form><input name="note" value="original" /><kb-button type="button">Act</kb-button></form>',
  )
  const form = body.querySelector('form')
  const input = body.querySelector('input')
  const onSubmit = vi.fn((event) => event.preventDefault())
  form.addEventListener('submit', onSubmit)

  await userEvent.fill(input, 'changed')
  await clickInner(body.querySelector('kb-button'))

  expect(onSubmit).not.toHaveBeenCalled()
  expect(input).toHaveValue('changed')
})

test('blocks submission when the owning form is invalid', async () => {
  // requestSubmit() runs native constraint validation before firing
  // "submit" — an empty required field must block it the same way a real
  // <button type="submit"> would (DESIGN.md edge case 11).
  const body = mount(
    '<form><input name="note" required /><kb-button type="submit">Save</kb-button></form>',
  )
  const onSubmit = vi.fn((event) => event.preventDefault())
  body.querySelector('form').addEventListener('submit', onSubmit)

  await clickInner(body.querySelector('kb-button'))

  expect(onSubmit).not.toHaveBeenCalled()
})

test('dispatches one clicked event per click', async () => {
  // No dedup against rapid repeated clicks — each click is its own
  // "clicked" (DESIGN.md edge case 15).
  const body = mount('<kb-button value="42">Save</kb-button>')
  const button = body.querySelector('kb-button')
  const onClicked = vi.fn()
  button.addEventListener('clicked', onClicked)

  await clickInner(button)
  await clickInner(button)

  await vi.waitFor(() => expect(onClicked).toHaveBeenCalledTimes(2))
})

test('exports the inner control as part="button"', async () => {
  const body = mount('<kb-button>Save</kb-button>')
  const control = await inner(body.querySelector('kb-button'), 'button')

  expect(control.getAttribute('part')).toBe('button')
})

test('adds no custom state for the default variant until it is set explicitly', async () => {
  // "solid" is the unstyled default with no matching CSS rule — a button
  // that never receives `variant` should not carry a `:state(solid)` either
  // (DESIGN.md, "Regra sobre variant").
  const body = mount('<kb-button>Save</kb-button>')
  const button = body.querySelector('kb-button')
  await inner(button, 'button')

  expect(button.internals.states.has('solid')).toBe(false)

  button.setAttribute('variant', 'solid')

  await vi.waitFor(() =>
    expect(button.internals.states.has('solid')).toBe(true),
  )
})

test('keeps the default color when the attribute is not a known token', async () => {
  // `enumerating(COLORS)` never lets an unknown value reach the setter, so
  // the property falls back to its own default rather than the raw string.
  const body = mount('<kb-button color="xpto">Save</kb-button>')
  const button = body.querySelector('kb-button')
  await inner(button, 'button')

  expect(button.color).toBe('primary')
})

test('keeps the last valid color when the attribute changes to an unknown token', async () => {
  const body = mount('<kb-button color="danger">Save</kb-button>')
  const button = body.querySelector('kb-button')
  await inner(button, 'button')
  expect(button.color).toBe('danger')

  button.setAttribute('color', 'xpto')

  await vi.waitFor(() => expect(button.color).toBe('danger'))
})

test('accepts a valid color set after an invalid one was rejected', async () => {
  const body = mount('<kb-button color="xpto">Save</kb-button>')
  const button = body.querySelector('kb-button')
  await inner(button, 'button')

  button.setAttribute('color', 'success')

  await vi.waitFor(() => expect(button.color).toBe('success'))
})

test('keeps the default variant when the attribute is not a known token', async () => {
  const body = mount('<kb-button variant="xpto">Save</kb-button>')
  const button = body.querySelector('kb-button')
  await inner(button, 'button')

  expect(button.variant).toBe('solid')
})

test('adds no invented custom state for an unknown variant', async () => {
  const body = mount('<kb-button variant="xpto">Save</kb-button>')
  const button = body.querySelector('kb-button')
  await inner(button, 'button')

  expect(button.internals.states.has('xpto')).toBe(false)
})

test('keeps the last valid variant when the attribute changes to an unknown token', async () => {
  const body = mount('<kb-button variant="ghost">Save</kb-button>')
  const button = body.querySelector('kb-button')
  await inner(button, 'button')
  await vi.waitFor(() =>
    expect(button.internals.states.has('ghost')).toBe(true),
  )

  button.setAttribute('variant', 'xpto')

  await vi.waitFor(() => expect(button.variant).toBe('ghost'))
  expect(button.internals.states.has('ghost')).toBe(true)
})

test('accepts a valid variant set after an invalid one was rejected', async () => {
  const body = mount('<kb-button variant="xpto">Save</kb-button>')
  const button = body.querySelector('kb-button')
  await inner(button, 'button')

  button.setAttribute('variant', 'link')

  await vi.waitFor(() => expect(button.variant).toBe('link'))
})

test('keeps the default type when the attribute is not a known token', async () => {
  const body = mount('<kb-button type="xpto">Save</kb-button>')
  const button = body.querySelector('kb-button')
  await inner(button, 'button')

  expect(button.type).toBe('submit')
})

test('keeps the last valid type when the attribute changes to an unknown token', async () => {
  const body = mount('<kb-button type="button">Save</kb-button>')
  const button = body.querySelector('kb-button')
  await inner(button, 'button')
  expect(button.type).toBe('button')

  button.setAttribute('type', 'xpto')

  await vi.waitFor(() => expect(button.type).toBe('button'))
})

test('accepts a valid type set after an invalid one was rejected', async () => {
  const body = mount('<kb-button type="xpto">Save</kb-button>')
  const button = body.querySelector('kb-button')
  await inner(button, 'button')

  button.setAttribute('type', 'reset')

  await vi.waitFor(() => expect(button.type).toBe('reset'))
})

test('submits the owning form when an invalid type left it at the submit default', async () => {
  // type never resolved to anything valid, so it stays at 'submit' — click()
  // must still requestSubmit(), proving the filter's fallback is behavioral,
  // not just a getter default.
  const body = mount('<form><kb-button type="xpto">Save</kb-button></form>')
  const onSubmit = vi.fn((event) => event.preventDefault())
  body.querySelector('form').addEventListener('submit', onSubmit)

  await clickInner(body.querySelector('kb-button'))

  expect(onSubmit).toHaveBeenCalledOnce()
})
