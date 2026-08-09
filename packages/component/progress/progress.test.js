import { expect, test, vi } from 'vitest'
import { inner, mount } from '../../../vitest.helpers.js'

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
