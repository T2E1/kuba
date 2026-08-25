import { mount } from '@test'
import { expect, test, vi } from 'vitest'
import Hidden from '../hidden'
import Presentational from './index'

// The mixin reads `internals` from the host class, as `Hidden` does, so every
// probe below owns the single `attachInternals()` call an element is allowed.
class Probe extends Presentational(Hidden(HTMLElement)) {
  #internals

  get internals() {
    return (this.#internals ??= this.attachInternals())
  }
}
customElements.define('probe-presentational', Probe)

test('publishes role none on connect', () => {
  const body = mount('<probe-presentational></probe-presentational>')

  const probe = body.querySelector('probe-presentational')

  expect(probe.internals.role).toBe('none')
})

test('publishes no accessible name', () => {
  // The role half on its own: unlike `Identity`, nothing here writes
  // `ariaLabel`, and no `alt` reaches the element's public surface.
  const body = mount('<probe-presentational alt="Nope"></probe-presentational>')

  const probe = body.querySelector('probe-presentational')

  expect(probe.internals.ariaLabel).toBe(null)
})

test('an author role in the markup outranks the published one', () => {
  // `internals.role` is a *default*, so the consumer keeps the final say.
  const body = mount(
    '<probe-presentational role="group"></probe-presentational>',
  )

  const probe = body.querySelector('probe-presentational')

  expect(probe.getAttribute('role')).toBe('group')
})

test('composes with Hidden on the same element', async () => {
  // Neither mixin calls `attachInternals()`, so both reach the one instance
  // the element owns — a second call would throw NotSupportedError.
  const body = mount('<probe-presentational hidden></probe-presentational>')

  const probe = body.querySelector('probe-presentational')

  await vi.waitFor(() =>
    expect(probe.internals.states.has('hidden')).toBe(true),
  )
})
