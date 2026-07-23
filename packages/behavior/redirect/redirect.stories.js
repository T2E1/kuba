/**
 * `<kb-redirect>` renders nothing — it's a headless Echo subscriber that
 * calls `history.pushState` when `go()` runs. It's demonstrated wired to a
 * publisher rather than standing alone, since its whole purpose is to be a
 * subscriber. See Foundations/Dataflow for the publisher/subscriber model.
 */
export default {
  title: 'Behavior/Redirect',
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'todo' },
  },
}

export const WiredToAButtonClick = {
  render: () => `
    <kb-button id="to-profile">View profile</kb-button>
    <kb-redirect on="#to-profile/clicked:method/go" href="/profile"></kb-redirect>
    <p>
      Clicking the button dispatches <code>clicked</code>; the
      <code>on</code> attribute (<code>#to-profile/clicked:method/go</code>)
      routes it to <code>go()</code>, which pushes <code>/profile</code>
      onto the history stack — no listener was written for this page.
    </p>
  `,
}

export const InterpolatedHref = {
  render: () => `
    <kb-button id="to-user" value="42">View user #42</kb-button>
    <kb-redirect on="#to-user/clicked:method/go" href="/user/{}"></kb-redirect>
    <p>
      <code>href</code> may contain <code>{path.to.value}</code>
      placeholders, interpolated against the <code>params</code> passed to
      <code>go()</code> — here the button's <code>clicked</code> payload
      (its own <code>value</code>, <code>"42"</code>) fills the empty
      <code>{}</code> placeholder, navigating to <code>/user/42</code>.
    </p>
  `,
}
