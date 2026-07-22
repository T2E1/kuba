/**
 * A guide, not a component catalog entry: shows two unrelated custom
 * elements (`<kb-button>`, `<kb-redirect>`) wired together declaratively via
 * the `on` attribute (Echo), with zero JavaScript event listeners written by
 * the page author. This is the dataflow model kuba is built around.
 */
export default {
  title: 'Guides/Declarative navigation',
  tags: ['autodocs'],
}

export const ButtonWiredToRedirect = {
  render: () => `
    <kb-button id="to-profile" color="primary" variant="solid">
      View profile
    </kb-button>
    <kb-redirect on="#to-profile/clicked:method/go" href="/profile"></kb-redirect>
    <p>
      Clicking the button dispatches a <code>clicked</code> event; the
      <code>on</code> attribute routes it straight to
      <code>&lt;kb-redirect&gt;</code>'s <code>go()</code> method — no
      JavaScript listener was written for this page.
    </p>
  `,
}
