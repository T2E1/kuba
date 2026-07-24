import { expect, fn, userEvent, waitFor } from 'storybook/test'

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
  title: 'Components/Button',
  // Docs page is authored by hand in button.mdx (usage guidance), which
  // attaches to this CSF file via `<Meta of={ButtonStories} />` — tagging
  // this file 'autodocs' too would generate a second, conflicting page.
  parameters: {
    actions: { handles: ['clicked'] },
    a11y: { test: 'todo' },
  },
  render: ({ color, variant, type, value, width, hidden, on, label }) =>
    `<kb-button color="${color}" variant="${variant}" type="${type}" value="${value}" width="${width}" ${hidden ? 'hidden' : ''} on="${on}">${label}</kb-button>`,
  argTypes: {
    color: {
      control: { type: 'select' },
      options: [
        'master',
        'primary',
        'complete',
        'success',
        'warning',
        'danger',
        'info',
        'menu',
      ],
      description:
        'Semantic color, resolved against the `--color-{value}` CSS custom property.',
      table: { defaultValue: { summary: 'primary' } },
    },
    variant: {
      control: { type: 'select' },
      options: ['solid', 'naked', 'ghost', 'link', 'icon'],
      description: 'Visual style, exposed to CSS as a custom element state.',
      table: { defaultValue: { summary: 'solid' } },
    },
    type: {
      control: { type: 'select' },
      options: ['submit', 'reset'],
      description: 'Native button behavior inside a `<form>`.',
      table: { defaultValue: { summary: 'submit' } },
    },
    value: {
      control: 'text',
      description:
        'Arbitrary payload carried by the button, returned by `click()`.',
    },
    width: {
      control: 'text',
      description:
        'Width of the button, normalized by the `resizing` filter: numeric `px`/`%` values pass through, `hug` becomes `auto`, `fill` becomes `100%`, anything else defaults to `auto`.',
      table: { defaultValue: { summary: 'auto' } },
    },
    hidden: {
      control: 'boolean',
      description:
        'Whether the button is hidden. `"false"`/`"0"`/absent read as `false`; any other attribute value reads as `true`.',
      table: { defaultValue: { summary: 'false' } },
    },
    on: {
      control: 'text',
      description:
        'Arc string wiring an event from another element to this button, in the form `source/event:type/sink` (optionally `|filter=value`). Inherited from the `Echo` mixin.',
    },
    label: { control: 'text' },
  },
  args: {
    color: 'primary',
    variant: 'solid',
    type: 'submit',
    value: '',
    width: 'auto',
    hidden: false,
    on: '',
    label: 'Save',
  },
}

export const ClickDispatchesEvent = {
  args: { value: '42' },
  // Clicking re-dispatches as a single `clicked` event on the host (see
  // button.ts's `@dispatchEvent`), carrying `value` as its detail.
  play: async ({ canvasElement, args }) => {
    const button = canvasElement.querySelector('kb-button')
    const onClicked = fn()
    button.addEventListener('clicked', onClicked)

    await clickInnerButton(button)

    await expect(onClicked).toHaveBeenCalledOnce()
    await expect(onClicked.mock.calls[0][0].detail).toBe(args.value)
  },
}

export const SubmittedInsideForm = {
  // `type="submit"` (the default) calls `this.internals.form?.requestSubmit()`
  // — form association happens automatically because the button is a
  // form-associated custom element (`static formAssociated = true`)
  // nested inside a real <form>.
  render: () => '<form><kb-button type="submit">Save</kb-button></form>',
  play: async ({ canvasElement }) => {
    const form = canvasElement.querySelector('form')
    const button = canvasElement.querySelector('kb-button')
    const onSubmit = fn()
    // Prevent the real page navigation a native form submit would trigger.
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      onSubmit()
    })

    await clickInnerButton(button)

    await expect(onSubmit).toHaveBeenCalledOnce()
  },
}

export const ResetInsideForm = {
  // `type="reset"` calls `this.internals.form?.reset()`, which resets
  // every form control back to its default value — including plain
  // native <input>s that aren't kb-button itself.
  render: () =>
    '<form><input name="note" value="original" /><kb-button type="reset">Reset</kb-button></form>',
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input')
    const button = canvasElement.querySelector('kb-button')

    await userEvent.clear(input)
    await userEvent.type(input, 'changed')
    await expect(input).toHaveValue('changed')

    await clickInnerButton(button)

    await expect(input).toHaveValue('original')
  },
}

export const WiredViaOnAttribute = {
  // `on` (inherited from the `Echo` mixin) wires an arc string
  // `source/event:type/sink` — here, whenever #source dispatches
  // `clicked`, its payload is assigned directly to #target's `value`
  // property (`setter` sink), with zero manual event listeners.
  render: () => `
    <kb-button id="source" value="42">Source</kb-button>
    <kb-button id="target" on="#source/clicked:setter/value">Target</kb-button>
  `,
  play: async ({ canvasElement }) => {
    const source = canvasElement.querySelector('#source')
    const target = canvasElement.querySelector('#target')

    await expect(target.value).toBeUndefined()

    await clickInnerButton(source)

    await waitFor(() => expect(target.value).toBe('42'))
  },
}
