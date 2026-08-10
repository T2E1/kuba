# Stories com `play` — testando eventos de verdade

Isto é a Regra 6 do `SKILL.md`. `packages/component/button/button.stories.js`
(story `ClickDispatchesEvent`) é a implementação de referência.

## Por que isso existe além de `actions.handles`

`actions.handles` (Regra 3) só *exibe* um evento quando alguém interage
manualmente com a story — não prova que o evento dispara, nem que carrega
o valor certo. Uma story com `play` roda sozinha, na aba Interactions,
com PASS/FAIL por passo, e é isso que teria pego o bug real encontrado
neste repositório: `<kb-button>` não expunha `internals` publicamente, o
mixin `Hidden` lançava um erro engolido (`@around` deferido) tentando
`this.internals.states`, e o atributo `hidden` simplesmente não fazia
nada — invisível numa inspeção de código, óbvio no primeiro `expect` que
afirma o estado depois da interação.

## Imports

```js
import { expect, fn, userEvent, waitFor } from 'storybook/test'
```

`storybook/test` é um subpath do próprio pacote `storybook` (não
`@storybook/test`, pacote separado de versões antigas) — reexporta
`@testing-library/user-event`, `@vitest/expect`, e o `fn()` de mock do
Vitest. Só importe `waitFor` quando o componente tiver paint assíncrono
(ver seção abaixo).

## O roteiro padrão

```js
export const ClickDispatchesEvent = {
  args: { value: '42' },
  play: async ({ canvasElement, args }) => {
    const button = canvasElement.querySelector('kb-button')
    const onClicked = fn()
    button.addEventListener('clicked', onClicked)

    await userEvent.click(button)

    await expect(onClicked).toHaveBeenCalledOnce()
    await expect(onClicked.mock.calls[0][0].detail).toBe(args.value)
  },
}
```

1. **Localize o elemento** via `canvasElement.querySelector(...)` — não
   `within(canvasElement).getByRole(...)`: as *queries* do Testing Library
   operam em light DOM e não atravessam `shadowRoot`, e a maior parte do
   markup interessante de um custom element kuba vive dentro da shadow
   DOM do próprio componente (não do slot).
2. **Registre um spy real** (`fn()`) via `addEventListener` no próprio
   elemento, antes de interagir — não use `actions.handles`/o decorator
   de Actions para a asserção; ele existe para exibição humana no painel,
   não para o `play` consultar.
3. **Simule a interação real**, nunca `element.dispatchEvent(new
   CustomEvent(...))` manual — isso testaria se um listener genérico
   reage a um evento fabricado, não se a interação do usuário (`click`,
   `type`, `keyboard`) realmente aciona o comportamento do componente.
4. **Afirme o `detail`**, não só a contagem de chamadas — todo evento
   kuba é um `CustomEvent` cujo payload mora em `.detail`
   (`packages/echo/dispatchEvent.js`); `toHaveBeenCalledOnce()` sozinho
   não pega um evento disparado com o valor errado.

## Cliques em elementos com Shadow DOM

O `click()` de um componente kuba normalmente reage a um listener
registrado em `this.shadowRoot` (delegação — ver `packages/event/listen.js`),
não no host. Um clique sintético despachado diretamente no elemento host
(`userEvent.click(hostElement)`) **não** atravessa para dentro da shadow
DOM — o clique precisa mirar o nó real dentro dela:

```js
const innerButton = button.shadowRoot.querySelector('button')
await userEvent.click(innerButton)
```

O evento (`clicked`, redespachado com `bubbles: true, composed: true`)
ainda assim atravessa de volta para fora da shadow DOM e chega ao listener
registrado no host — só o *clique de entrada* precisa mirar certo.

## Esperando o primeiro paint

O `@paint` da kuba (`packages/dom/paint/render.js`) escreve o HTML/CSS
inicial da shadow DOM dentro de um `requestAnimationFrame`, não
sincronamente em `connectedCallback`. Um `play` roda assim que a story
monta — pode rodar antes desse frame, e `shadowRoot.querySelector(...)`
retorna `null` nesse instante (não lança; só não acha nada, e o clique
seguinte falha com `userEvent.click(null)`). Espere o nó existir:

```js
const innerButton = await waitFor(
  () => button.shadowRoot.querySelector('button') ?? Promise.reject(),
)
```

`waitFor` (de `@testing-library/dom`, reexportado por `storybook/test`)
tenta repetidamente o callback até resolver ou estourar o timeout padrão —
mais robusto que um `requestAnimationFrame`/`setTimeout` fixo, que
assumiria que um único frame sempre basta.

## O que não fazer

- Não escreva um `play` que só afirma o estado inicial sem interagir — se
  não há `userEvent`, não é um teste de interação, é uma asserção de
  render que pertence a outro tipo de teste (fora do escopo desta skill).
- Não use `play` para simular o que `argTypes`/Controls já cobre (trocar
  `color`, `variant`, etc. via args) — `play` é para *comportamento*
  disparado por interação do usuário, não para varrer combinações de
  atributos (isso é `.claude/rules/023_proibicao-funcionalidade-especulativa.md`
  de novo, agora em forma de teste).
- Não esqueça de exportar a story normalmente (`export const NomeDoEvento
  = { ... }`) — um `play` "escondido" numa story não exportada nunca roda.
