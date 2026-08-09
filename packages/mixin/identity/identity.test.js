import { expect, test, vi } from 'vitest'
import { mount } from '../../../vitest.helpers.js'
import Hidden from '../hidden'
import Identity, { role } from './index'

// The mixin reads `internals` from the host class, as `Hidden` does, so every
// probe below owns the single `attachInternals()` call an element is allowed.
class Probe extends Identity(Hidden(HTMLElement)) {
  #internals

  get internals() {
    return (this.#internals ??= this.attachInternals())
  }

  get [role]() {
    return 'progressbar'
  }
}
customElements.define('probe-identity', Probe)

class Anonymous extends Identity(HTMLElement) {
  #internals

  get internals() {
    return (this.#internals ??= this.attachInternals())
  }
}
customElements.define('probe-anonymous', Anonymous)

test('publishes the role the element declares', () => {
  const body = mount('<probe-identity></probe-identity>')

  const probe = body.querySelector('probe-identity')

  expect(probe.internals.role).toBe('progressbar')
})

test('alt becomes the accessible name', () => {
  const body = mount('<probe-identity alt="Loading"></probe-identity>')

  const probe = body.querySelector('probe-identity')

  expect(probe.internals.ariaLabel).toBe('Loading')
})

test('leaves the name alone when alt is absent', () => {
  // `alt` only ever runs on an attribute change, so an element that never sets
  // it keeps whatever name its own content gives it.
  const body = mount('<probe-identity></probe-identity>')

  const probe = body.querySelector('probe-identity')

  expect(probe.internals.ariaLabel).toBe(null)
})

test('an author role in the markup outranks the declared one', () => {
  // `internals.role` is a *default*, so the consumer keeps the final say.
  const body = mount('<probe-identity role="slider"></probe-identity>')

  const probe = body.querySelector('probe-identity')

  expect(probe.getAttribute('role')).toBe('slider')
})

test('publishes no role when the element declares none', () => {
  // The `[role]` contract is internal, guarded by a test per adopting element
  // rather than by a runtime throw — this is what forgetting it looks like.
  const body = mount('<probe-anonymous></probe-anonymous>')

  const probe = body.querySelector('probe-anonymous')

  expect(probe.internals.role).toBe(null)
})

test('composes with Hidden on the same element', async () => {
  // Neither mixin calls `attachInternals()`, so both reach the one instance
  // the element owns — a second call would throw NotSupportedError. `Hidden`
  // reflects onto `states` through `@around`, on a later tick.
  const body = mount('<probe-identity hidden></probe-identity>')

  const probe = body.querySelector('probe-identity')

  await vi.waitFor(() =>
    expect(probe.internals.states.has('hidden')).toBe(true),
  )
})
