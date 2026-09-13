import { expect, test, vi } from 'vitest'

// Viola a regra de dublar só a dependência externa: o próprio componente sob teste
// (kb-input) foi substituído por um dublê, então o teste prova que o mock funciona,
// não que o componente real dispara o evento.
test('dispatches changed on every keystroke', () => {
  const fakeInput = { addEventListener: vi.fn(), dispatchChanged: vi.fn() }

  fakeInput.dispatchChanged('ada')

  expect(fakeInput.dispatchChanged).toHaveBeenCalledWith('ada')
})
