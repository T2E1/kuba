import { expect, test, vi } from 'vitest'
import { clickInner, inner, mount } from '../../../vitest.helpers.js'

test('projects src and alt onto its internal image', async () => {
  const body = mount(
    '<kb-cover src="https://picsum.photos/800/450" alt="Product banner"></kb-cover>',
  )

  const img = await inner(body.querySelector('kb-cover'), 'img')

  expect(img.src).toBe('https://picsum.photos/800/450')
  expect(img.alt).toBe('Product banner')
})

test('swaps its source from another element through an arc', async () => {
  const body = mount(`
    <kb-button id="source" value="https://picsum.photos/450/560">Swap</kb-button>
    <kb-cover id="target" src="https://picsum.photos/800/450" alt="Banner" on="#source/clicked:setter/src"></kb-cover>
  `)
  const target = body.querySelector('#target')

  expect(target.src).toBe('https://picsum.photos/800/450')

  await clickInner(body.querySelector('#source'))

  await vi.waitFor(() =>
    expect(target.src).toBe('https://picsum.photos/450/560'),
  )
})
