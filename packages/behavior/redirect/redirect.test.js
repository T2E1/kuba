import { clickInner, mount } from '@test'
import { afterEach, expect, test, vi } from 'vitest'

// go() calls history.pushState, which outlives the test — restore the entry
// so the next test doesn't start on a URL a previous one navigated to.
const initial = location.pathname
afterEach(() => history.pushState({}, '', initial))

test('navigates when a wired element publishes', async () => {
  const body = mount(`
    <kb-button id="to-profile">View profile</kb-button>
    <kb-redirect on="#to-profile/clicked:method/go" href="/profile"></kb-redirect>
  `)

  await clickInner(body.querySelector('#to-profile'))

  await vi.waitFor(() => expect(location.pathname).toBe('/profile'))
})

test('interpolates the payload into a dynamic href', async () => {
  // `{}` is the whole payload — here the button's own `value`.
  const body = mount(`
    <kb-button id="to-user" value="42">View user #42</kb-button>
    <kb-redirect on="#to-user/clicked:method/go" href="/user/{}"></kb-redirect>
  `)

  await clickInner(body.querySelector('#to-user'))

  await vi.waitFor(() => expect(location.pathname).toBe('/user/42'))
})
