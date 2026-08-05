import { expect, waitFor } from 'storybook/test'

// `@paint` (see packages/dom/paint/render.js) defers the first shadow DOM
// write to a requestAnimationFrame, so the <slot> may not exist yet when
// `play` starts.
async function slotNamed(host, name) {
  return waitFor(
    () =>
      host.shadowRoot.querySelector(`slot[name="${name}"]`) ?? Promise.reject(),
  )
}

export default {
  title: 'Components/Footer',
  // Docs page is authored by hand in footer.mdx (usage guidance), which
  // attaches via `<Meta of={FooterStories} />` — tagging this file 'autodocs'
  // too would generate a second, conflicting page.
  parameters: {
    a11y: { test: 'todo' },
    // Show the exact markup `render` returns (with args resolved) in the
    // "Show code" block, instead of Storybook's beautifier re-indenting it
    // and breaking inline elements onto their own lines.
    docs: { source: { format: false } },
  },
  // kb-footer has no attributes of its own — its whole surface is the pair of
  // `leading`/`trailing` slots, so the controls drive slotted content instead.
  // An empty `leading` falls back to the element's built-in copyright line.
  render: ({ leading, trailing }) => `
    <kb-footer>
      ${leading ? `<kb-text slot="leading" size="xxxs">${leading}</kb-text>` : ''}
      <kb-text slot="trailing" size="xxxs">${trailing}</kb-text>
    </kb-footer>
  `,
  argTypes: {
    leading: {
      control: 'text',
      description:
        'Content projected into the `leading` slot. Leave it empty to keep the built-in copyright line.',
    },
    trailing: {
      control: 'text',
      description: 'Content projected into the `trailing` slot.',
    },
  },
  args: {
    leading: '',
    trailing: 'Privacy Policy',
  },
}

export const ProjectsSlottedContent = {
  // kb-footer's only job is to push content to opposite ends of a centered
  // container — assert the projection itself, since there is no attribute or
  // event to exercise.
  args: { leading: '© 2026 Memoize' },
  play: async ({ canvasElement, args }) => {
    const footer = canvasElement.querySelector('kb-footer')
    const leading = await slotNamed(footer, 'leading')
    const trailing = await slotNamed(footer, 'trailing')

    await expect(leading.assignedElements()[0].textContent).toBe(args.leading)
    await expect(trailing.assignedElements()[0].textContent).toBe(args.trailing)
  },
}

export const FallsBackToCopyright = {
  // With nothing slotted into `leading`, the <slot>'s own default content
  // (the copyright line baked into component.js) shows through.
  args: { leading: '' },
  play: async ({ canvasElement }) => {
    const footer = canvasElement.querySelector('kb-footer')
    const leading = await slotNamed(footer, 'leading')

    await expect(leading.assignedElements()).toHaveLength(0)
    await expect(leading.textContent).toContain('Todos os direitos reservados')
  },
}
