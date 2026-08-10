// ❌ Testes que passam sem provar que o componente funciona.
//
// Violam a rule 032 (o teste deve provar comportamento) e, no caso 1, tornam
// a documentação uma promessa sem lastro.
//
// Correto em: event-interaction.valid.js

import { expect, test, vi } from 'vitest'
import { mount } from '../../../../vitest.helpers.js'

// ─────────────────────────────────────────────────────────────────────────────
// 1. Despachar o evento à mão em vez de provocá-lo
// ─────────────────────────────────────────────────────────────────────────────
test('dispatches clicked', async () => {
  const body = mount('<kb-button value="42">Save</kb-button>')
  const button = body.querySelector('kb-button')
  const onClicked = vi.fn()
  button.addEventListener('clicked', onClicked)

  // Isto testa o event bus do DOM, não o componente. Passa mesmo se o botão
  // nunca despachar nada sozinho — que é exatamente o bug que importa.
  button.dispatchEvent(new CustomEvent('clicked', { detail: '42' }))

  expect(onClicked).toHaveBeenCalled()
})

// ─────────────────────────────────────────────────────────────────────────────
// 2. Clicar no host em vez do controle interno
// ─────────────────────────────────────────────────────────────────────────────
test('clicking the button emits', async () => {
  const body = mount('<kb-button>Save</kb-button>')
  const button = body.querySelector('kb-button')
  const onClicked = vi.fn()
  button.addEventListener('clicked', onClicked)

  // Os listeners de @on vivem no shadowRoot e só veem eventos originados lá
  // dentro. Clicar no host é no-op — o teste falha, e quem escreveu conclui
  // que o componente está quebrado.
  button.click()

  expect(onClicked).toHaveBeenCalled()
})

// ─────────────────────────────────────────────────────────────────────────────
// 3. Alcançar o shadow root antes do primeiro render
// ─────────────────────────────────────────────────────────────────────────────
test('renders a native button', () => {
  const body = mount('<kb-button>Save</kb-button>')
  const button = body.querySelector('kb-button')

  // @paint adia a primeira escrita no shadow root para um requestAnimationFrame,
  // então nada existe aqui ainda. Use inner(), que espera.
  expect(button.shadowRoot.querySelector('button')).not.toBeNull()
})

// ─────────────────────────────────────────────────────────────────────────────
// 4. Testar detalhe interno em vez da superfície pública
// ─────────────────────────────────────────────────────────────────────────────
test('sets the internal field', async () => {
  const body = mount('<kb-button variant="naked">Save</kb-button>')
  const button = body.querySelector('kb-button')

  // Campo privado e estrutura interna não são contrato. Este teste quebra numa
  // refatoração que não muda nada para o consumidor — custo sem proteção.
  expect(button.shadowRoot.querySelector('button').className).toBe('naked')
})
