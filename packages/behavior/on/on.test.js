import { clickInner, mount } from '@test'
import { expect, test, vi } from 'vitest'

test('attaches more than one arc to the same host', async () => {
  // A host carries a single `on` attribute, so any additional subscription
  // has to be a <kb-on> child. Here one arc serves every button via `*`.
  const body = mount(`
    <kb-button name="approve" value="Approved">Approve</kb-button>
    <kb-button name="reject" value="Rejected" variant="naked">Reject</kb-button>

    <kb-render>
      <template>Last action: {}</template>
      <kb-on value="*/clicked:method/render"></kb-on>
    </kb-render>
  `)
  const output = body.querySelector('kb-render')

  await clickInner(body.querySelector('[name="approve"]'))
  await vi.waitFor(() =>
    expect(output.textContent).toBe('Last action: Approved'),
  )

  await clickInner(body.querySelector('[name="reject"]'))
  await vi.waitFor(() =>
    expect(output.textContent).toBe('Last action: Rejected'),
  )
})
