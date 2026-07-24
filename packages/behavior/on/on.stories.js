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
  title: 'Behavior/On',
  parameters: {
    a11y: { test: 'todo' },
  },
  render: ({ value }) => `<kb-on value="${value}"></kb-on>`,
  argTypes: {
    value: {
      control: 'text',
      description:
        'Arc string describing the wiring, in the form `source/event:type/sink` (optionally followed by `|filter=value` pairs). `source` is `*` (any), `#id`, `name`, or tag name to match the event origin; `event` is the event type to listen for; `type` is how `sink` is applied (`method`, `attribute`, or `setter`); `sink` is the method, attribute, or property name on the parent.',
    },
  },
  args: {
    value: '',
  },
}

export const MultipleArcsOnOneHost = {
  // `<kb-on>` renders nothing on its own — it exists to attach a second
  // (or third...) arc to a parent Echo host, since an element can only
  // carry one `on="..."` attribute. See Foundations/Dataflow for the arc
  // string syntax.
  render: () => `
    <kb-button name="approve" value="Approved">Approve</kb-button>
    <kb-button name="reject" value="Rejected" variant="outline" color="danger">Reject</kb-button>

    <kb-render layout="list">
      <template>Last action: {}</template>
      <kb-on value="approve/clicked:method/render"></kb-on>
      <kb-on value="reject/clicked:method/render"></kb-on>
    </kb-render>
  `,
  play: async ({ canvasElement }) => {
    const approve = canvasElement.querySelector('[name="approve"]')
    const reject = canvasElement.querySelector('[name="reject"]')
    const output = canvasElement.querySelector('kb-render')

    await clickInnerButton(approve)
    await waitFor(() =>
      expect(output.textContent).toBe('Last action: Approved'),
    )

    await clickInnerButton(reject)
    await waitFor(() =>
      expect(output.textContent).toBe('Last action: Rejected'),
    )
  },
}
