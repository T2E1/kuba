import { expect, fn, userEvent, waitFor } from 'storybook/test'

// The `clicked` listener lives on `shadowRoot` (see packages/event/listen.js)
// and only fires for events whose retargeted `target` matches the `*`
// selector — i.e. a click that composes up through the <slot>. A click on
// the host itself never reaches it, so the play has to click real slotted
// content (the first slotted element, whatever it is), not the <kb-card>.
async function clickSlottedContent(host) {
  const content = await waitFor(
    () => host.querySelector('*') ?? Promise.reject(),
  )
  await userEvent.click(content)
}

export default {
  title: 'Components/Card',
  // Docs page is authored by hand in card.mdx (usage guidance), which
  // attaches via `<Meta of={CardStories} />` — tagging this file 'autodocs'
  // too would generate a second, conflicting page.
  parameters: {
    actions: { handles: ['clicked'] },
    a11y: { test: 'todo' },
    // Show the exact markup `render` returns (with args resolved) in the
    // "Show code" block, instead of Storybook's beautifier re-indenting it
    // and breaking inline elements like <strong> onto their own lines.
    docs: { source: { format: false } },
  },
  // A realistic breed card: an edge-to-edge image via kb-inset + kb-cover, a
  // highlight title, and a kb-stack of details — the same per-record template
  // you'd nest inside a <kb-render>. Only the card's own knobs are wired to
  // controls; the composed content is fixed.
  render: ({ direction, variant, value, width, height, on }) => `
    <kb-card direction="${direction}" variant="${variant}" value="${value}" width="${width}" height="${height}" on="${on}">
      <kb-inset side="top">
        <kb-cover src="https://placedog.net/500/280?id=42" alt="Affenpinscher"></kb-cover>
      </kb-inset>
      <kb-text family="highlight" weight="medium" size="xs" color="primary-dark">Affenpinscher</kb-text>
      <kb-stack direction="column" spacing="quarck">
        <kb-text size="xxxs"><strong>Bred for:</strong> Small rodent hunting, lapdog</kb-text>
        <kb-text size="xxxs"><strong>Life span:</strong> 10 – 12 years</kb-text>
        <kb-text size="xxxs"><strong>Temperament:</strong> Stubborn, Curious, Playful</kb-text>
      </kb-stack>
    </kb-card>
  `,
  argTypes: {
    direction: {
      control: { type: 'select' },
      options: ['row', 'column'],
      description: "Flex layout direction for the card's content.",
      table: { defaultValue: { summary: 'column' } },
    },
    variant: {
      control: { type: 'select' },
      options: ['filled', 'outlined'],
      description:
        'Visual style, driven by the `variant` attribute in CSS. `filled` (default) has no matching rule; `outlined` swaps to a white background with a hairline border.',
      table: { defaultValue: { summary: 'filled' } },
    },
    value: {
      control: 'text',
      description:
        'Arbitrary payload sent as the detail of the `clicked` event.',
    },
    width: {
      control: 'text',
      description:
        'Width of the card (from the `Width` mixin), normalized by the `resizing` filter: numeric `px`/`%` pass through, `hug` becomes `auto`, `fill` becomes `100%`. Default `auto` fills the container — set a fixed width for a self-contained card.',
      table: { defaultValue: { summary: 'auto' } },
    },
    height: {
      control: 'text',
      description:
        'Height of the card (from the `Height` mixin), normalized by the `resizing` filter: numeric `px`/`%` pass through, `hug` becomes `auto`, `fill` becomes `100%`. Default `auto` grows with the content.',
      table: { defaultValue: { summary: 'auto' } },
    },
    on: {
      control: 'text',
      description:
        'Arc string wiring an event from another element to this card, in the form `source/event:type/sink` (optionally `|filter=value`). Inherited from the `Echo` mixin.',
    },
  },
  args: {
    direction: 'column',
    variant: 'filled',
    value: '42',
    width: '320px',
    height: 'auto',
    on: '',
  },
}

export const ClickDispatchesEvent = {
  // A card absorbs click/clicked events from its descendants (see card.ts's
  // `@on.click`/`@on.clicked`) and re-dispatches a single `clicked` on the
  // host, carrying `value` as its detail.
  play: async ({ canvasElement, args }) => {
    const card = canvasElement.querySelector('kb-card')
    const onClicked = fn()
    card.addEventListener('clicked', onClicked)

    await clickSlottedContent(card)

    await expect(onClicked).toHaveBeenCalledOnce()
    await expect(onClicked.mock.calls[0][0].detail).toBe(args.value)
  },
}
