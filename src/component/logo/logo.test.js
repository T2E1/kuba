import { mount } from '@test'
import { expect, test, vi } from 'vitest'

test('hides itself when it carries no name', async () => {
  // The <svg> has no <title>, so an unnamed logo would be an image with
  // nothing to announce. Next to a written site name it is redundant anyway.
  const body = mount('<kb-logo></kb-logo>')

  const logo = body.querySelector('kb-logo')

  await vi.waitFor(() => expect(logo.internals.ariaHidden).toBe('true'))
})

test('becomes a named image when the mark stands alone', async () => {
  const body = mount('<kb-logo alt="kuba, home"></kb-logo>')

  const logo = body.querySelector('kb-logo')

  await vi.waitFor(() => expect(logo.internals.ariaLabel).toBe('kuba, home'))
})

test('is an image to assistive technology', async () => {
  const body = mount('<kb-logo alt="kuba, home"></kb-logo>')

  const logo = body.querySelector('kb-logo')

  await vi.waitFor(() => expect(logo.internals.role).toBe('img'))
})
