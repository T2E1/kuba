// ✅ Regra 6 — story com play que prova que o evento é disparado de verdade.
//
// actions.handles só torna o evento visível quando alguém clica manualmente.
// Isto executa na aba Interactions, com PASS/FAIL por passo, e roda em CI.
// É o padrão Arrange/Act/Assert da rule 032 aplicado ao componente.

import { expect, fn, userEvent, within } from 'storybook/test'

export const ClickDispatchesEvent = {
  play: async ({ canvasElement }) => {
    // Arrange — localizar o elemento e registrar o listener.
    const canvas = within(canvasElement)
    const card = canvasElement.querySelector('kb-card')
    const onClicked = fn()
    card.addEventListener('clicked', onClicked)

    // Act — interação real do usuário.
    // NUNCA card.dispatchEvent(...): isso testaria o event bus do DOM, não o
    // componente. O clique é o que exercita o caminho de verdade.
    await userEvent.click(canvas.getByText('Card content'))

    // Assert — o evento saiu, e o detail carrega o payload esperado.
    await expect(onClicked).toHaveBeenCalled()
    await expect(onClicked.mock.calls[0][0].detail).toBe('42')
  },
}

// Este é o teste que teria pego, sem revisão manual, o bug em que <kb-button>
// não expunha `internals` publicamente para o mixin Hidden: o controle do
// painel "funcionava" visualmente, mas um assert sobre o estado teria falhado
// na primeira execução.
