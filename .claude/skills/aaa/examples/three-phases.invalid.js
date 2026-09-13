import { inner, mount } from '@test'
import { expect, test, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Viola a rule 032: sem separação de fases, duas ações no mesmo bloco (fill e um
// segundo fill condicional) e `if` decidindo o fluxo dentro do teste.
test('input works', async () => {
  const body = mount('<kb-input name="who"></kb-input>')
  const input = body.querySelector('kb-input')
  const onChanged = vi.fn()
  input.addEventListener('changed', onChanged)
  await userEvent.fill(await inner(input, 'input'), 'ada')
  if (input.value !== 'ada') {
    await userEvent.fill(await inner(input, 'input'), 'ada')
  }
  expect(onChanged).toHaveBeenCalled()
  expect(input.value).toBe('ada')
  expect(input.validity.valueMissing).toBe(false)
})
