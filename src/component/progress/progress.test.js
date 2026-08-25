import { inner, mount } from '@test'
import { expect, test, vi } from 'vitest'

test('is a progressbar to assistive technology', async () => {
  // The shadow root is a bare <div>, so without the role the bar is an
  // anonymous box no screen reader can describe.
  const body = mount('<kb-progress value="40"></kb-progress>')
  const progress = body.querySelector('kb-progress')

  await inner(progress, 'div')

  expect(progress.internals.role).toBe('progressbar')
})

test('reports the fill percentage as its ARIA value', async () => {
  const body = mount('<kb-progress value="40"></kb-progress>')
  const progress = body.querySelector('kb-progress')

  await inner(progress, 'div')

  await vi.waitFor(() => expect(progress.internals.ariaValueNow).toBe('40'))
})

test('fixes the scale at 0-100', async () => {
  // `value` is applied straight into CSS as a `%`, so the range is not
  // configurable — the announced scale has to say the same.
  const body = mount('<kb-progress value="40"></kb-progress>')
  const progress = body.querySelector('kb-progress')

  await inner(progress, 'div')

  await vi.waitFor(() => expect(progress.internals.ariaValueMax).toBe('100'))
})

test('follows the value as it changes', async () => {
  const body = mount('<kb-progress value="10"></kb-progress>')
  const progress = body.querySelector('kb-progress')
  await inner(progress, 'div')

  progress.setAttribute('value', '75')

  await vi.waitFor(() => expect(progress.internals.ariaValueNow).toBe('75'))
})

test('fixes the scale at 0-100 on its lower bound too', async () => {
  const body = mount('<kb-progress value="40"></kb-progress>')
  const progress = body.querySelector('kb-progress')

  await inner(progress, 'div')

  await vi.waitFor(() => expect(progress.internals.ariaValueMin).toBe('0'))
})

test('announces a value above 100 without clamping it', async () => {
  // docs/components/progress.md:58-60 — no clamping, an overshoot is
  // announced verbatim even though `overflow: hidden` hides it visually.
  const body = mount('<kb-progress value="150"></kb-progress>')
  const progress = body.querySelector('kb-progress')

  await inner(progress, 'div')

  await vi.waitFor(() => expect(progress.internals.ariaValueNow).toBe('150'))
})

test('announces a negative value without clamping it', async () => {
  // docs/components/progress.md:61-62 — a negative value collapses the
  // indicator's width, but the raw string still reaches aria-valuenow.
  const body = mount('<kb-progress value="-10"></kb-progress>')
  const progress = body.querySelector('kb-progress')

  await inner(progress, 'div')

  await vi.waitFor(() => expect(progress.internals.ariaValueNow).toBe('-10'))
})

test('sanitizes a value that breaks out of its CSS declaration to its numeric prefix', async () => {
  // `numeric` calls `next` with the *parsed* number, never the raw string —
  // `Number.parseFloat` stops at the first non-numeric character, so
  // passing the original input through would let anything appended after a
  // valid-looking prefix (like this payload closing the `%` declaration and
  // opening a new `:host` rule) reach the property and style.js intact.
  // The value isn't rejected — `50` is a legitimate number — but only the
  // digits it parsed to reach the property, nothing appended after them.
  const body = mount(
    '<kb-progress value="50; } :host { display: none } div { width: 1"></kb-progress>',
  )
  const progress = body.querySelector('kb-progress')

  await inner(progress, 'div')

  expect(progress.value).toBe('50')
})

test('never adopts an injected rule from a value with a trailing payload', async () => {
  const body = mount(
    '<kb-progress value="50; } :host { display: none } div { width: 1"></kb-progress>',
  )
  const progress = body.querySelector('kb-progress')

  await inner(progress, 'div')

  await vi.waitFor(() =>
    expect(getComputedStyle(progress).display).not.toBe('none'),
  )
})

test('rejects a value with no numeric prefix at all, keeping the last valid one', async () => {
  const body = mount('<kb-progress value="40"></kb-progress>')
  const progress = body.querySelector('kb-progress')
  await inner(progress, 'div')

  progress.setAttribute('value', 'abc')

  await vi.waitFor(() => expect(progress.value).toBe('40'))
})

test('sanitizes a direct property assignment the same way as the attribute', async () => {
  // `@attributeChanged('value', numeric)` only guards attribute writes —
  // assigning `progress.value` directly skips it and used to reach the
  // setter, and style.js's interpolation, raw. The setter now re-applies
  // `toNumericString` itself, so this entry point gets the same guarantee.
  const body = mount('<kb-progress></kb-progress>')
  const progress = body.querySelector('kb-progress')
  await inner(progress, 'div')

  progress.value = '1; } div { background-color: red; width: 100'

  expect(progress.value).toBe('1')
  expect(getComputedStyle(progress).backgroundColor).not.toBe('rgb(255, 0, 0)')
})

test('rejects a direct property assignment with no numeric prefix, keeping the last valid value', async () => {
  const body = mount('<kb-progress value="40"></kb-progress>')
  const progress = body.querySelector('kb-progress')
  await inner(progress, 'div')

  progress.value = 'abc'

  expect(progress.value).toBe('40')
})

test('publishes the default ARIA value range on connect, even without a value attribute', async () => {
  // Fixed during audit: `[measurable]` now also runs on `@connected`, not
  // only from `@attributeChanged('value')`, so a `<kb-progress>` mounted
  // with no `value` attribute still publishes the documented default
  // (types.d.ts, docs/components/progress.md:110-113) instead of leaving
  // aria-valuenow/min/max unset.
  const body = mount('<kb-progress></kb-progress>')
  const progress = body.querySelector('kb-progress')

  await inner(progress, 'div')

  expect(progress.internals.ariaValueNow).toBe('0')
})
