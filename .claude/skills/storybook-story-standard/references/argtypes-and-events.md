# argTypes e eventos — transcrevendo o types.d.ts em controles

## Por que manual, nunca inferido

A inferência automática de `argTypes` do Storybook lê metadados gerados por
um analisador em nível de código-fonte (ex.: um `custom-elements.json`
gerado via `@custom-elements-manifest/analyzer`, que escaneia o JSDoc da
*implementação* da classe). Os arquivos de implementação do kuba são
propositalmente pouco documentados (nível de código interno da
`jsdoc-standard`) — o contrato completo mora só no `types.d.ts` irmão. Não
há nada para um analisador ler. Por isso `argTypes` é sempre escrito à mão,
e é escrito *a partir* do `types.d.ts`, tratando-o como fonte única da
verdade — nunca invente um controle que não seja um atributo documentado, e
nunca deixe de fora do `argTypes` um atributo documentado.

## Tabela de mapeamento tipo → controle

| Forma no `types.d.ts` | Entrada em `argTypes` |
|---|---|
| `color: string` (sem restrição) | `{ control: 'text' }` |
| `type: 'submit' \| 'reset'` (união fechada) | `{ control: { type: 'select' }, options: ['submit', 'reset'] }` |
| `disabled: boolean` | `{ control: 'boolean' }` |
| `value: string \| undefined` | `{ control: 'text' }` — o `\| undefined` não precisa de controle próprio; uma string vazia no painel de Controls já representa "não definido" para um controle de texto |
| `KUBA<Name><Attr>Attribute \| (string & {})` (forma em template literal, ex.: `KUBARedirectHrefAttribute`) | `{ control: 'text' }` — a checagem em tempo de compilação do template literal não tem equivalente em controle de runtime; um controle de texto livre é a representação honesta. Coloque a restrição da forma (ex.: "deve começar com `/`, `#`, `?`, ou um esquema") em `description` |
| `readonly internals: ElementInternals` / outros membros que são detalhe interno de implementação, não atributo | **não é exposto de jeito nenhum** — ver abaixo |

## O que nunca vira um `argType`

Membros no `types.d.ts` que não são atributos HTML refletidos —
acessores `readonly` que sustentam conexões internas (`internals`, um
getter de cache privado), métodos que não são feitos para serem disparados
por um atributo controlado via Controls (ex.: `go(params)`,
`render(data)`) — não ganham `argType`. Um controle só faz sentido para
algo configurável via atributo/propriedade que muda o que é renderizado.
Métodos são exercitados por uma função `play` ou por um exemplo em
`Guides/`, nunca simulados como controle.

## `description`

Reaproveite o texto do JSDoc do `types.d.ts` ao pé da letra (ou uma versão
resumida dele) — não escreva prosa nova que possa divergir do contrato
documentado. Se a entrada do `types.d.ts` tiver um `@default`, esse valor
vai no `args` do meta (ver `story-structure.md`), não duplicado em
`description`.

## Eventos → `parameters.actions.handles`

Todo nome de evento documentado como disparado no `types.d.ts` (procure no
JSDoc de nível de classe ou de método por "dispatches a ... event") é
declarado uma vez, no nível do meta:

```js
parameters: {
  actions: { handles: ['clicked'] },
}
```

Liste todo nome de evento distinto que o componente pode disparar — ex.,
`<kb-form>` dispara tanto `submitted` quanto `resetted`:

```js
parameters: {
  actions: { handles: ['submitted', 'resetted'] },
}
```

Não adicione uma conexão em estilo `control: 'action'` como `argType` para
esses casos — `actions.handles` é o mecanismo completo e correto; adicionar
os dois seria configuração redundante para o mesmo comportamento.

## Uma nota sobre `packages/behavior/*`

Elementos headless (mixin `Headless`, ex.: `<kb-on>`, `<kb-redirect>`) não
renderizam nada — não há `argTypes`/estado visual para expor como controle
convencional, então **não ganham a story de catálogo padrão** (meta com
`argTypes`/`args` transcritos do `types.d.ts`). Isso não significa que
ficam sem story: como o valor de todo `packages/behavior/*` é o papel que
exerce no barramento pub/sub do `Echo` (ver `stories/foundations/dataflow.mdx`
e `.claude/rules/`), a story desses pacotes é sempre uma demonstração de
wiring — o elemento aparece conectado a pelo menos um publisher real via
`on`/`<kb-on>`, com a prosa explicando qual segmento do arco faz o quê. Ver
`packages/behavior/on/on.stories.js` e `packages/behavior/redirect/redirect.stories.js`
como referência de forma. Um elemento que mixa `Echo` mas ainda renderiza
conteúdo visível (ex.: `<kb-render>`, `<kb-form>`) *ganha* uma story de
componente normal (meta com `argTypes`), além de, quando fizer sentido, uma
story adicional de wiring — o atributo `on` que herda do `Echo` continua
seguindo a linha de template literal da tabela de mapeamento acima
(`control: 'text'`, restrição explicada em `description`).

Se o `render()` de um elemento só produz efeito depois do pintura inicial
(ex.: `<kb-render>`/`<kb-form>` usam `@repaint`, guardado por um estado
interno "já pintado" que só fica verdadeiro após `connectedCallback`),
chamar esse método a partir de um nó criado mas ainda não inserido no DOM é
um no-op silencioso — e um `<script>` dentro da string retornada por
`render()` nunca executa (inserção via `innerHTML` não roda `<script>`).
Para semear dados de forma que realmente dispare o efeito, use a função
`play` do CSF3 (`play: async ({ canvasElement }) => { ... }`), que roda
depois que Storybook já montou o markup da story no canvas real — ver
`packages/behavior/render/render.stories.js` e
`stories/examples/user-crud.stories.js`.
