// ✅ O teste que prova que o evento documentado é mesmo disparado.
//
// A página em website/docs/components/ afirma que <kb-button> despacha `clicked`
// carregando o `value`. Esta é a prova. Sem ela, a página documenta uma
// intenção — e uma regressão só apareceria quando um consumidor reclamasse.
//
// Roda num Chromium real via Vitest browser mode: estes componentes dependem
// de ElementInternals, :state(), adoptedStyleSheets e do requestAnimationFrame
// em que @paint adia o primeiro render. Emulação de DOM não tem isso.
//
// Incorreto em: event-interaction.invalid.js

import { expect, test, vi } from 'vitest'
import { clickInner, mount } from '../../../../vitest.helpers.js'

test('dispatches clicked carrying its value', async () => {
  // Arrange — montar o markup e registrar o listener no host.
  const body = mount('<kb-button value="42">Save</kb-button>')
  const button = body.querySelector('kb-button')
  const onClicked = vi.fn()
  button.addEventListener('clicked', onClicked)

  // Act — interação real do usuário.
  //
  // clickInner alcança o <button> dentro do shadow root, porque os listeners
  // registrados por @on vivem no shadowRoot e não veem clique no host. Ele
  // também espera o primeiro render, que @paint adia num requestAnimationFrame.
  await clickInner(button)

  // Assert — o evento saiu do shadow root (composed: true) e o detail carrega
  // o payload documentado. Duas asserções é o teto da rule 032.
  expect(onClicked).toHaveBeenCalledOnce()
  expect(onClicked.mock.calls[0][0].detail).toBe('42')
})

test('submits an owning form', async () => {
  // O comportamento que a seção "When to use" da página promete: type="submit"
  // envia o <form> que contém o botão, via associação de formulário.
  const body = mount('<form><kb-button type="submit">Save</kb-button></form>')
  const onSubmit = vi.fn((event) => event.preventDefault())
  body.querySelector('form').addEventListener('submit', onSubmit)

  await clickInner(body.querySelector('kb-button'))

  expect(onSubmit).toHaveBeenCalledOnce()
})
