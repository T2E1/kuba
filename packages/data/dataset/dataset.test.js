import { inner, mount } from '@test'
import { expect, test, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

test('merges records sharing an upsert key instead of duplicating', async () => {
  const body = mount('<kb-dataset name="ds-merge" upsert="id"></kb-dataset>')
  const dataset = body.querySelector('kb-dataset')

  dataset.push({ id: 1, name: 'Ada', role: 'Mathematician' })
  dataset.push({ id: 1, role: 'Countess' })

  expect(dataset.value).toEqual([{ id: 1, name: 'Ada', role: 'Countess' }])
})

test('publishes changed with the whole collection after each mutation', async () => {
  const body = mount('<kb-dataset name="ds-events" upsert="id"></kb-dataset>')
  const dataset = body.querySelector('kb-dataset')
  const onChanged = vi.fn()
  dataset.addEventListener('changed', onChanged)

  dataset.push([
    { id: 1, name: 'Ada' },
    { id: 2, name: 'Grace' },
  ])
  await vi.waitFor(() => expect(onChanged).toHaveBeenCalled())
  expect(onChanged.mock.calls.at(-1)[0].detail).toHaveLength(2)

  dataset.delete(1)
  await vi.waitFor(() =>
    expect(onChanged.mock.calls.at(-1)[0].detail).toHaveLength(1),
  )

  dataset.reset()
  await vi.waitFor(() =>
    expect(onChanged.mock.calls.at(-1)[0].detail).toHaveLength(0),
  )
})

test('drives a full add-and-delete screen through arcs alone', async () => {
  // The composed example the Storybook guide demonstrated: a form feeds the
  // dataset, the dataset feeds the list, and the list's buttons feed the
  // dataset again — with no listener written by the page.
  const body = mount(`
    <kb-form name="crud-form" autorender>
      <template>
        <kb-input name="name" required><kb-label>Name</kb-label></kb-input>
        <kb-button type="submit">Add</kb-button>
      </template>
    </kb-form>

    <kb-render>
      <kb-on value="crud-users/changed:method/render"></kb-on>
      <template>
        <kb-button name="crud-delete" value="{id}">Delete {name}</kb-button>
      </template>
    </kb-render>

    <kb-dataset name="crud-users" upsert="id">
      <kb-on value="crud-form/submitted:method/push"></kb-on>
      <kb-on value="crud-delete/clicked:method/delete"></kb-on>
    </kb-dataset>
  `)
  const form = body.querySelector('kb-form')
  const list = body.querySelector('kb-render')
  const dataset = body.querySelector('kb-dataset')

  const field = await inner(form, 'kb-input')
  await userEvent.fill(await inner(field, 'input'), 'Ada')
  await userEvent.click(await inner(await inner(form, 'kb-button'), 'button'))

  await vi.waitFor(() => expect(list.textContent).toContain('Delete Ada'))
  expect(dataset.value).toHaveLength(1)

  // Every row's delete button shares one name, so a single arc covers rows
  // rendered after it was connected.
  const row = await vi.waitFor(() => {
    const found = list.shadowRoot.querySelector('[name="crud-delete"]')
    if (!found) throw new Error('no row yet')
    return found
  })
  await userEvent.click(await inner(row, 'button'))

  await vi.waitFor(() => expect(dataset.value).toHaveLength(0))
})
