import { mount } from '@test'
import { expect, test, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

test('absorbs a click on its content and re-dispatches clicked', async () => {
  // The listener matches events whose retargeted target composes up through
  // the <slot>, so the click has to land on real slotted content — a click on
  // the host itself never reaches it.
  const body = mount(`
    <kb-card value="42">
      <kb-text size="xxs">Affenpinscher</kb-text>
    </kb-card>
  `)
  const card = body.querySelector('kb-card')
  const onClicked = vi.fn()
  card.addEventListener('clicked', onClicked)

  await userEvent.click(card.querySelector('kb-text'))

  await vi.waitFor(() => expect(onClicked).toHaveBeenCalledOnce())
  expect(onClicked.mock.calls[0][0].detail).toBe('42')
})
