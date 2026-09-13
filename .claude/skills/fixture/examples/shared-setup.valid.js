import { inner, mount } from '@test'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

let input

beforeEach(() => {
  // Setup: comum a todo teste deste arquivo.
  const body = mount('<kb-input name="who"></kb-input>')
  input = body.querySelector('kb-input')
})

afterEach(() => {
  // Teardown: desfaz exatamente o que o Setup criou.
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

test('dispatches changed on every keystroke', async () => {
  const onChanged = vi.fn()
  input.addEventListener('changed', onChanged)

  await userEvent.fill(await inner(input, 'input'), 'ada')

  await vi.waitFor(() => expect(onChanged).toHaveBeenCalled())
})

test('reset() clears the value', async () => {
  await userEvent.fill(await inner(input, 'input'), 'ada')

  input.reset()

  await vi.waitFor(() => expect(input.value).toBe(''))
})
