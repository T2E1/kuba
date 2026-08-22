import { inner, mount } from '@test'
import { expect, test } from 'vitest'

test('is the contentinfo landmark', async () => {
  const body = mount('<kb-footer></kb-footer>')
  const footer = body.querySelector('kb-footer')

  await inner(footer, 'wrapper')

  expect(footer.internals.role).toBe('contentinfo')
})

test('holds the only contentinfo in its shadow root', async () => {
  // A <footer> inside the shadow root would map to `contentinfo` as well,
  // leaving two nested landmarks — the wrapper is deliberately non-semantic.
  const body = mount('<kb-footer></kb-footer>')
  const footer = body.querySelector('kb-footer')

  await inner(footer, 'wrapper')

  expect(footer.shadowRoot.querySelector('footer')).toBe(null)
})

test('projects content into its leading and trailing regions', async () => {
  // kb-footer's only job is pushing content to opposite ends of a centered
  // row — there is no attribute or event to exercise, so the projection
  // itself is what's asserted.
  const body = mount(`
    <kb-footer>
      <kb-text slot="leading" size="xxxs">© 2026 Your Company</kb-text>
      <kb-text slot="trailing" size="xxxs">Privacy Policy</kb-text>
    </kb-footer>
  `)
  const footer = body.querySelector('kb-footer')

  const leading = await inner(footer, 'slot[name="leading"]')
  const trailing = await inner(footer, 'slot[name="trailing"]')

  expect(leading.assignedElements()[0].textContent).toBe('© 2026 Your Company')
  expect(trailing.assignedElements()[0].textContent).toBe('Privacy Policy')
})

test('alt names the landmark when a page has more than one', async () => {
  const body = mount('<kb-footer alt="Site"></kb-footer>')
  const footer = body.querySelector('kb-footer')

  await inner(footer, 'wrapper')

  expect(footer.internals.ariaLabel).toBe('Site')
})

test('spaces multiple elements projected into the same region', async () => {
  // A single slot can receive more than one projected element — the gap
  // token is what keeps them from rendering flush against each other.
  // getComputedStyle only proves the declaration exists, not that it's
  // applied to real layout, so geometry is measured via getBoundingClientRect.
  const body = mount(`
    <kb-footer>
      <kb-text slot="trailing" size="xxxs">Privacy Policy</kb-text>
      <kb-text slot="trailing" size="xxxs">Terms of Service</kb-text>
    </kb-footer>
  `)
  const footer = body.querySelector('kb-footer')
  const trailing = await inner(footer, 'slot[name="trailing"]')
  const [first, second] = trailing.assignedElements()

  const firstRect = first.getBoundingClientRect()
  const secondRect = second.getBoundingClientRect()

  expect(secondRect.left).toBeGreaterThan(firstRect.right)
})

test('leaves leading empty when nothing is slotted into it', async () => {
  const body = mount(`
    <kb-footer>
      <kb-text slot="trailing" size="xxxs">Privacy Policy</kb-text>
    </kb-footer>
  `)

  const leading = await inner(
    body.querySelector('kb-footer'),
    'slot[name="leading"]',
  )

  expect(leading.assignedElements()).toHaveLength(0)
  expect(leading.textContent.trim()).toBe('')
})
