import { mount } from '@test'
import { expect, test, vi } from 'vitest'

test('dispatches found on the parent with the matching record', async () => {
  const body = mount(`
    <kb-dataset upsert="id">
      <kb-find key="id" value="1"></kb-find>
    </kb-dataset>
  `)
  const dataset = body.querySelector('kb-dataset')
  const onFound = vi.fn()
  dataset.addEventListener('found', onFound)

  dataset.push([
    { id: '1', name: 'Ada' },
    { id: '2', name: 'Grace' },
  ])

  await vi.waitFor(() =>
    expect(onFound.mock.calls.at(-1)?.[0].detail).toEqual({
      id: '1',
      name: 'Ada',
    }),
  )
})

test('never dispatches found on the kb-find element itself', async () => {
  const body = mount(`
    <kb-dataset upsert="id">
      <kb-find key="id" value="1"></kb-find>
    </kb-dataset>
  `)
  const find = body.querySelector('kb-find')
  const onFound = vi.fn()
  find.addEventListener('found', onFound)

  find.value = '2'

  await new Promise((resolve) => setTimeout(resolve, 150))
  expect(onFound).not.toHaveBeenCalled()
})

test('dispatches found with null detail when no record matches', async () => {
  const body = mount(`
    <kb-dataset upsert="id">
      <kb-find key="id" value="99"></kb-find>
    </kb-dataset>
  `)
  const dataset = body.querySelector('kb-dataset')
  const onFound = vi.fn()
  dataset.addEventListener('found', onFound)

  dataset.push({ id: '1', name: 'Ada' })

  await vi.waitFor(() => expect(onFound).toHaveBeenCalled())
  expect(onFound.mock.calls.at(-1)[0].detail).toBeNull()
})

test('two writes to value within the debounce window collapse into one pass', async () => {
  const body = mount(`
    <kb-dataset upsert="id">
      <kb-find key="id" value="1"></kb-find>
    </kb-dataset>
  `)
  const dataset = body.querySelector('kb-dataset')
  const find = body.querySelector('kb-find')
  const onFound = vi.fn()
  dataset.addEventListener('found', onFound)
  dataset.push({ id: '1', name: 'Ada' })

  await vi.waitFor(() => expect(onFound).toHaveBeenCalledTimes(1))
  onFound.mockClear()

  find.value = '2'
  find.value = '1'

  await vi.waitFor(() => expect(onFound).toHaveBeenCalledTimes(1))
  expect(onFound.mock.calls.at(-1)[0].detail).toEqual({
    id: '1',
    name: 'Ada',
  })
})

test('changing key alone does not schedule a search', async () => {
  const body = mount(`
    <kb-dataset upsert="id">
      <kb-find key="id"></kb-find>
    </kb-dataset>
  `)
  const dataset = body.querySelector('kb-dataset')
  const find = body.querySelector('kb-find')
  const onFound = vi.fn()
  dataset.push({ id: '1', name: 'Ada' })
  await vi.waitFor(() => expect(dataset.value).toHaveLength(1))
  dataset.addEventListener('found', onFound)

  find.key = 'name'

  await new Promise((resolve) => setTimeout(resolve, 150))
  expect(onFound).not.toHaveBeenCalled()
})
