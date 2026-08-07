import { expect, test } from 'vitest'
import { inner, mount } from '../../../vitest.helpers.js'

test('projects content into its leading and trailing regions', async () => {
  // kb-footer's only job is pushing content to opposite ends of a centered
  // row — there is no attribute or event to exercise, so the projection
  // itself is what's asserted.
  const body = mount(`
    <kb-footer>
      <kb-text slot="leading" size="xxxs">© 2026 Memoize</kb-text>
      <kb-text slot="trailing" size="xxxs">Privacy Policy</kb-text>
    </kb-footer>
  `)
  const footer = body.querySelector('kb-footer')

  const leading = await inner(footer, 'slot[name="leading"]')
  const trailing = await inner(footer, 'slot[name="trailing"]')

  expect(leading.assignedElements()[0].textContent).toBe('© 2026 Memoize')
  expect(trailing.assignedElements()[0].textContent).toBe('Privacy Policy')
})

test('falls back to its built-in copyright line', async () => {
  // With nothing slotted into `leading`, the <slot>'s own default content
  // shows through.
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
  expect(leading.textContent).toContain('Todos os direitos reservados')
})
