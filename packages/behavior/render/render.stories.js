import { expect, userEvent, waitFor } from 'storybook/test'

export default {
  title: 'Behavior/Render',
  parameters: {
    a11y: { test: 'todo' },
  },
  argTypes: {
    layout: {
      control: { type: 'select' },
      options: ['list', 'grid'],
      description:
        "`'list'` stacks slotted content in a single flex column, `'grid'` arranges it in a two-column grid.",
      table: { defaultValue: { summary: 'list' } },
    },
    template: {
      control: 'text',
      description:
        'Id reference to a `<template>` element elsewhere in the document, resolved once and cached. When left unset, the element looks for its own `<template>` child instead.',
      table: { defaultValue: { summary: '' } },
    },
    on: {
      control: 'text',
      description:
        "Arc string wiring an event from another element to this host, in the form `source/event:type/sink` (optionally `|filter=value`). Inherited from the `Echo` mixin — commonly used to wire a data source's `change` event to `render()`.",
    },
  },
  args: {
    layout: 'list',
    template: '',
    on: '',
  },
}

// Handed to `docs.source.code` as-is (Regra: docs mostra exatamente esta
// string, sem re-formatar) — o painel "Show code" do addon-docs, quando
// não recebe um `code` explícito, extrai o DOM já renderizado e o passa
// por um beautifier HTML que não entende elementos inline (`<strong>`,
// texto direto), quebrando cada um em três linhas.
const wiredToAFetchMarkup = `<kb-stack direction="column">
  <kb-input name="dog" width="fill">
    <kb-label>Dog Breed Search</kb-label>
  </kb-input>

  <kb-render layout="grid">
    <template>
      <kb-card>
        <kb-inset side="top">
          <kb-cover src="{image.url}"></kb-cover>
        </kb-inset>
        <kb-text family="highlight" weight="medium" size="xs" color="primary">{name}</kb-text>
        <kb-stack direction="column" spacing="quarck">
          <kb-text size="xxxs"><strong>Bred for:</strong> {bred_for}</kb-text>
          <kb-text size="xxxs"><strong>Life span:</strong> {life_span}</kb-text>
          <kb-text size="xxxs"><strong>Temperament:</strong> {temperament}</kb-text>
        </kb-stack>
      </kb-card>
    </template>
    <kb-on value="api/ok:method/render"></kb-on>
    <kb-on value="api/error:method/clear"></kb-on>
  </kb-render>
</kb-stack>

<kb-fetch name="api" url="https://api.thedogapi.com/v1/breeds/search?q={}">
  <kb-headers key="x-api-key" value="DEMO-API-KEY"></kb-headers>
  <kb-on value="dog/changed:method/get"></kb-on>
</kb-fetch>`

export const WiredToAFetch = {
  render: () => wiredToAFetchMarkup,
  parameters: {
    docs: {
      source: { code: wiredToAFetchMarkup },
    },
  },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('kb-input')
    const innerInput = await waitFor(
      () => input.shadowRoot.querySelector('input') ?? Promise.reject(),
    )

    await userEvent.type(innerInput, 'american')

    const render = canvasElement.querySelector('kb-render')
    await waitFor(() => expect(render.textContent).toContain('American'), {
      timeout: 10000,
    })
  },
}
