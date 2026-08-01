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
  title: 'Components/Cover',
  // Docs page is authored by hand in cover.mdx (usage guidance), which
  // attaches to this CSF file via `<Meta of={CoverStories} />` — tagging
  // this file 'autodocs' too would generate a second, conflicting page.
  parameters: {
    a11y: { test: 'todo' },
  },
  render: ({ src, alt, orientation, on }) =>
    `<kb-cover src="${src}" alt="${alt}" orientation="${orientation}" on="${on}"></kb-cover>`,
  argTypes: {
    src: {
      control: 'text',
      description: 'Image URL rendered by the underlying `<img>`.',
      table: { defaultValue: { summary: "''" } },
    },
    alt: {
      control: 'text',
      description: 'Alternative text for the underlying `<img>`.',
      table: { defaultValue: { summary: "''" } },
    },
    orientation: {
      control: { type: 'select' },
      options: ['landscape', 'portrait'],
      description:
        "Aspect ratio applied to the host: `'landscape'` renders 16/9, `'portrait'` renders 4/5.",
      table: { defaultValue: { summary: 'landscape' } },
    },
    on: {
      control: 'text',
      description:
        'Arc string wiring an event from another element to this cover, in the form `source/event:type/sink` (optionally `|filter=value`). Inherited from the `Echo` mixin.',
    },
  },
  args: {
    src: 'https://picsum.photos/800/450',
    alt: 'Product banner',
    orientation: 'landscape',
    on: '',
  },
}

export const RendersImage = {
  // kb-cover's only job is to project `src`/`alt` onto an internal <img> —
  // `@paint` (see packages/dom/paint/render.js) defers the first shadow DOM
  // write to a requestAnimationFrame, so the <img> may not exist yet when
  // `play` starts.
  play: async ({ canvasElement, args }) => {
    const cover = canvasElement.querySelector('kb-cover')
    const img = await waitFor(
      () => cover.shadowRoot.querySelector('img') ?? Promise.reject(),
    )

    await expect(img.src).toBe(args.src)
    await expect(img.alt).toBe(args.alt)
  },
}

export const WiredViaOnAttribute = {
  // `on` (inherited from the `Echo` mixin) wires an arc string
  // `source/event:type/sink` — here, whenever #source dispatches
  // `clicked`, its payload is assigned directly to #target's `src`
  // property (`setter` sink), with zero manual event listeners.
  render: () => `
    <kb-button id="source" value="https://picsum.photos/450/560">Swap cover</kb-button>
    <kb-cover id="target" src="https://picsum.photos/800/450" alt="Product banner" on="#source/clicked:setter/src"></kb-cover>
  `,
  play: async ({ canvasElement }) => {
    const source = canvasElement.querySelector('#source')
    const target = canvasElement.querySelector('#target')

    await expect(target.src).toBe('https://picsum.photos/800/450')

    await clickInnerButton(source)

    await waitFor(() =>
      expect(target.src).toBe('https://picsum.photos/450/560'),
    )
  },
}
