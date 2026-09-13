import { inner, mount } from '@test'
import { expect, test, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

test('dispatches changed on every keystroke', async () => {
  // Arrange
  const body = mount('<kb-input name="who"></kb-input>')
  const input = body.querySelector('kb-input')
  const onChanged = vi.fn()
  input.addEventListener('changed', onChanged)

  // Act
  await userEvent.fill(await inner(input, 'input'), 'ada')

  // Assert
  await vi.waitFor(() => expect(onChanged).toHaveBeenCalled())
  expect(onChanged.mock.calls.at(-1)[0].detail).toBe('ada')
})
