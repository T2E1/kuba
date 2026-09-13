import { inner, mount } from '@test'
import { expect, test, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

test('dispatches changed on every keystroke', async () => {
  const body = mount('<kb-input name="who"></kb-input>')
  const input = body.querySelector('kb-input')
  // Spy: observa se o evento foi disparado, sem alterar o comportamento real.
  const onChanged = vi.fn()
  input.addEventListener('changed', onChanged)

  await userEvent.fill(await inner(input, 'input'), 'ada')

  await vi.waitFor(() => expect(onChanged).toHaveBeenCalled())
})
