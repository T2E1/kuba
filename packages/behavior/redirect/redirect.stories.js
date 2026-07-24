import { expect, userEvent, waitFor } from 'storybook/test'

// The click listener that triggers `click()` lives on `shadowRoot`, not
// the host — it only reacts to clicks originating inside the shadow tree
// (packages/event/listen.js), so the click has to land on the real inner
// <button>. `@paint` (see packages/dom/paint/render.js) defers the first
// shadow DOM write to a requestAnimationFrame, so it may not exist yet
// when `play` starts.
async function clickInnerButton(host) {
  const innerButton = await waitFor(
    () => host.shadowRoot.querySelector('button') ?? Promise.reject(),
  )
  await userEvent.click(innerButton)
}

export default {
  title: 'Behavior/Redirect',
  parameters: {
    a11y: { test: 'todo' },
  },
  render: ({ href, route, on }) =>
    `<kb-redirect href="${href}" route="${route}" on="${on}"></kb-redirect>`,
  argTypes: {
    href: {
      control: 'text',
      description:
        'Target URL used when `route` is not set — an absolute URL, an absolute path, or a fragment/query starting with `#`/`?`. May contain `{path.to.value}` placeholders, resolved against the `params` passed to `go()`.',
      table: { defaultValue: { summary: '#' } },
    },
    route: {
      control: 'text',
      description:
        'Name of a router-registered route to resolve (via `urlFor`) into the target URL, taking precedence over `href` when set.',
      table: { defaultValue: { summary: '' } },
    },
    on: {
      control: 'text',
      description:
        "Arc string wiring an event from another element to this host, in the form `source/event:type/sink` (optionally `|filter=value`). Inherited from the `Echo` mixin — commonly used to wire a button's `clicked` event to `go()`.",
    },
  },
  args: {
    href: '#',
    route: '',
    on: '',
  },
}

export const WiredToAButtonClick = {
  // `<kb-redirect>` renders nothing — it's a headless Echo subscriber that
  // calls `history.pushState` when `go()` runs. It's demonstrated wired to
  // a publisher rather than standing alone, since its whole purpose is to
  // be a subscriber. See Foundations/Dataflow for the publisher/subscriber
  // model.
  render: () => `
    <kb-button id="to-profile">View profile</kb-button>
    <kb-redirect on="#to-profile/clicked:method/go" href="/profile"></kb-redirect>
  `,
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('#to-profile')

    await clickInnerButton(button)

    await waitFor(() => expect(location.pathname).toBe('/profile'))
  },
}

export const InterpolatedHref = {
  // `href` may contain `{path.to.value}` placeholders, interpolated
  // against the `params` passed to `go()` — here the button's `clicked`
  // payload (its own `value`) fills the empty `{}` placeholder.
  render: () => `
    <kb-button id="to-user" value="42">View user #42</kb-button>
    <kb-redirect on="#to-user/clicked:method/go" href="/user/{}"></kb-redirect>
  `,
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('#to-user')

    await clickInnerButton(button)

    await waitFor(() => expect(location.pathname).toBe('/user/42'))
  },
}
