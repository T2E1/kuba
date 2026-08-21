import { mount } from '@test'
import { expect, test, vi } from 'vitest'

// The Storybook story this replaces drove a real request against a public dog
// API and waited up to 10s for it. That made the check depend on a third
// party's uptime; the wiring it proved (an arc reaching `render`) is covered
// by on.test.js, so these exercise the element's own contract instead.

test('interpolates a record into its template', async () => {
  const body = mount(`
    <kb-render>
      <template>Hello, {name}!</template>
    </kb-render>
  `)
  const render = body.querySelector('kb-render')

  await vi.waitFor(() => expect(render.shadowRoot).toBeTruthy())
  render.render({ name: 'Ada' })

  await vi.waitFor(() => expect(render.textContent).toBe('Hello, Ada!'))
})

test('renders one interpolation per array entry', async () => {
  const body = mount(`
    <kb-render>
      <template>{name};</template>
    </kb-render>
  `)
  const render = body.querySelector('kb-render')

  await vi.waitFor(() => expect(render.shadowRoot).toBeTruthy())
  render.render([{ name: 'Ada' }, { name: 'Grace' }])

  await vi.waitFor(() => expect(render.textContent).toBe('Ada;Grace;'))
})

test('clear() empties the output without losing the template', async () => {
  const body = mount(`
    <kb-render>
      <template>{name}</template>
    </kb-render>
  `)
  const render = body.querySelector('kb-render')

  await vi.waitFor(() => expect(render.shadowRoot).toBeTruthy())
  render.render({ name: 'Ada' })
  await vi.waitFor(() => expect(render.textContent).toBe('Ada'))

  render.clear()
  await vi.waitFor(() => expect(render.textContent).toBe(''))

  render.render({ name: 'Grace' })
  await vi.waitFor(() => expect(render.textContent).toBe('Grace'))
})

test('stays out of the accessibility tree', async () => {
  // The rendered items carry the semantics; the container holding them adds
  // nothing an assistive technology needs to hear about.
  const body = mount(`
    <kb-render>
      <template>{name}</template>
    </kb-render>
  `)
  const render = body.querySelector('kb-render')

  render.render({ name: 'Ada' })

  expect(render.internals.role).toBe('none')
})
