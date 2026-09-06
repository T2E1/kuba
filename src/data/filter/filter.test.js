import { mount } from '@test'
import { expect, test, vi } from 'vitest'

test('dispatches filtered on the parent with the matching records', async () => {
  const body = mount(`
    <kb-dataset upsert="id">
      <kb-filter key="active" value="true"></kb-filter>
    </kb-dataset>
  `)
  const dataset = body.querySelector('kb-dataset')
  const onFiltered = vi.fn()
  dataset.addEventListener('filtered', onFiltered)

  dataset.push([
    { id: 1, active: 'true' },
    { id: 2, active: 'false' },
  ])

  await vi.waitFor(() => expect(onFiltered).toHaveBeenCalled())
  expect(onFiltered.mock.calls.at(-1)[0].detail).toEqual([
    { id: 1, active: 'true' },
  ])
})

test('never dispatches filtered on the kb-filter element itself', async () => {
  const body = mount(`
    <kb-dataset upsert="id">
      <kb-filter key="active" value="true"></kb-filter>
    </kb-dataset>
  `)
  const filter = body.querySelector('kb-filter')
  const onFiltered = vi.fn()
  filter.addEventListener('filtered', onFiltered)

  filter.value = 'false'

  await new Promise((resolve) => setTimeout(resolve, 150))
  expect(onFiltered).not.toHaveBeenCalled()
})

test('publishes an empty array when no record matches', async () => {
  const body = mount(`
    <kb-dataset upsert="id">
      <kb-filter key="active" value="unknown"></kb-filter>
    </kb-dataset>
  `)
  const dataset = body.querySelector('kb-dataset')
  const onFiltered = vi.fn()
  dataset.addEventListener('filtered', onFiltered)

  dataset.push({ id: 1, active: 'true' })

  await vi.waitFor(() => expect(onFiltered).toHaveBeenCalled())
  expect(onFiltered.mock.calls.at(-1)[0].detail).toEqual([])
})

test('two writes to value within the debounce window collapse into one pass', async () => {
  const body = mount(`
    <kb-dataset upsert="id">
      <kb-filter key="active" value="true"></kb-filter>
    </kb-dataset>
  `)
  const dataset = body.querySelector('kb-dataset')
  const filter = body.querySelector('kb-filter')
  const onFiltered = vi.fn()
  dataset.addEventListener('filtered', onFiltered)
  dataset.push({ id: 1, active: 'true' })

  filter.value = 'false'
  filter.value = 'true'

  await vi.waitFor(() => expect(onFiltered).toHaveBeenCalledTimes(1))
  expect(onFiltered.mock.calls.at(-1)[0].detail).toEqual([
    { id: 1, active: 'true' },
  ])
})

test('changing key alone also schedules a filtering pass', async () => {
  // Unlike `kb-find`, `kb-filter` decorates both the `key` and `value`
  // setters with `@around(dispatch)` (filter.ts:17-18), so `key` alone
  // re-triggers filtering too.
  const body = mount(`
    <kb-dataset upsert="id">
      <kb-filter key="active" value="true"></kb-filter>
    </kb-dataset>
  `)
  const dataset = body.querySelector('kb-dataset')
  const filter = body.querySelector('kb-filter')
  const onFiltered = vi.fn()
  dataset.push({ id: 1, active: 'true', role: 'admin' })
  await vi.waitFor(() => expect(dataset.value).toHaveLength(1))
  dataset.addEventListener('filtered', onFiltered)

  filter.key = 'role'

  await vi.waitFor(() => expect(onFiltered).toHaveBeenCalled())
  expect(onFiltered.mock.calls.at(-1)[0].detail).toEqual([])
})
