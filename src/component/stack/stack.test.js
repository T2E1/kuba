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

test('never reintroduces alt as a functional property', async () => {
  // `Stack` composes the `Presentational` mixin instead of `Identity`, so it
  // never contracts an accessible name. Assigning `alt` must be a no-op —
  // proof that no mixin quietly reattached the property, not just that the
  // symbol is absent.
  const body = mount('<kb-stack></kb-stack>')
  const stack = body.querySelector('kb-stack')
  await inner(stack, 'slot')

  stack.alt = 'x'

  expect(stack.internals.ariaLabel).toBeNull()
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

test('applies align as align-items', async () => {
  const body = mount('<kb-stack align="center"></kb-stack>')
  const stack = body.querySelector('kb-stack')
  await inner(stack, 'slot')

  await vi.waitFor(() =>
    expect(getComputedStyle(stack).alignItems).toBe('center'),
  )
})

test('applies justify as justify-content', async () => {
  const body = mount('<kb-stack justify="space-between"></kb-stack>')
  const stack = body.querySelector('kb-stack')
  await inner(stack, 'slot')

  await vi.waitFor(() =>
    expect(getComputedStyle(stack).justifyContent).toBe('space-between'),
  )
})

test('resolves spacing against the inset scale as the gap', async () => {
  // docs/components/stack.md:90 documents `sm` as 24px on the inset scale.
  const body = mount('<kb-stack spacing="sm"></kb-stack>')
  const stack = body.querySelector('kb-stack')
  await inner(stack, 'slot')

  await vi.waitFor(() => expect(getComputedStyle(stack).gap).toBe('24px'))
})

test('keeps the default align when the attribute breaks out of its CSS declaration', async () => {
  // `align` now carries the same `enumerating(ALIGNMENTS)` wrapper as
  // `direction`: a value outside the closed set never reaches the setter, so
  // this hostile payload — which a prior audit confirmed could close the
  // `:host` block and inject a new `display: none` rule — never gets past the
  // attribute-changed callback. The proof is that `align` stays at its
  // default, not that the injected rule happens to fail to parse.
  const body = mount(
    '<kb-stack align="flex-start; } :host { display: none } x {"></kb-stack>',
  )
  const stack = body.querySelector('kb-stack')
  await inner(stack, 'slot')

  expect(stack.align).toBe('start')
})

test('keeps the default justify when the attribute breaks out of its CSS declaration', async () => {
  // Same proof as align, for the `justify` vector the audit also confirmed.
  const body = mount(
    '<kb-stack justify="center; } :host { display: none } x {"></kb-stack>',
  )
  const stack = body.querySelector('kb-stack')
  await inner(stack, 'slot')

  expect(stack.justify).toBe('start')
})

test('keeps the default spacing when the attribute breaks out through var()', async () => {
  // `spacing` is nested inside `var(--spacing_inset-${stack.spacing})`
  // (style.js:9), so this payload closes the inner `var()` and the `:host`
  // block through one extra level of nesting. Starts from `md`, not the
  // default `xs`, so the assertion distinguishes "rejected, fell back to
  // default" from "accepted the payload's own leading token".
  const body = mount(
    '<kb-stack spacing="md)) } :host { display: none } x { a: var(--z"></kb-stack>',
  )
  const stack = body.querySelector('kb-stack')
  await inner(stack, 'slot')

  expect(stack.spacing).toBe('xs')
})

test('never adopts an injected rule for a rejected align value', async () => {
  // Beyond the property staying at its default, confirm no attacker-supplied
  // rule made it into the shadow root's stylesheet at all.
  const body = mount(
    '<kb-stack align="flex-start; } :host { display: none } x {"></kb-stack>',
  )
  const stack = body.querySelector('kb-stack')
  await inner(stack, 'slot')

  await vi.waitFor(() => expect(getComputedStyle(stack).display).toBe('flex'))
})

test('rejects a direct align assignment outside the closed set, keeping the last valid one', async () => {
  // `@attributeChanged('align', enumerating(ALIGNMENTS))` only guards
  // attribute writes — assigning `stack.align` directly used to skip it and
  // reach the setter unchecked. The setter now re-checks `isEnumerated`
  // itself, so this entry point gets the same guarantee as the attribute one.
  const body = mount('<kb-stack></kb-stack>')
  const stack = body.querySelector('kb-stack')
  await inner(stack, 'slot')

  stack.align = 'flex-start; } :host { display: none } x {'

  expect(stack.align).toBe('start')
  expect(getComputedStyle(stack).display).toBe('flex')
})

test('rejects a direct justify assignment outside the closed set, keeping the last valid one', async () => {
  const body = mount('<kb-stack></kb-stack>')
  const stack = body.querySelector('kb-stack')
  await inner(stack, 'slot')

  stack.justify = 'center; } :host { display: none } x {'

  expect(stack.justify).toBe('start')
})

test('rejects a direct spacing assignment outside the closed set, keeping the last valid one', async () => {
  const body = mount('<kb-stack></kb-stack>')
  const stack = body.querySelector('kb-stack')
  await inner(stack, 'slot')

  stack.spacing = 'md)) } :host { display: none } x { a: var(--z'

  expect(stack.spacing).toBe('xs')
})

test('rejects a direct direction assignment outside the closed set, keeping the last valid one', async () => {
  const body = mount('<kb-stack></kb-stack>')
  const stack = body.querySelector('kb-stack')
  await inner(stack, 'slot')

  stack.direction = 'diagonal'

  expect(stack.direction).toBe('row')
})
