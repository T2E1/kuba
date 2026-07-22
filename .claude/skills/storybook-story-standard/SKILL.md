---
name: storybook-story-standard
description: Escreve e revisa stories do Storybook (.stories.js) para custom elements do kuba — argTypes espelhando o types.d.ts do componente, conexão de eventos via parameters.actions.handles, convenções de título/hierarquia e defaults de acessibilidade. Use quando o usuário pedir para "criar uma story", "adicionar uma story do Storybook", "escrever stories para este componente", "documentar este componente no Storybook", ou quando um pacote em packages/**/ tiver types.d.ts mas nenhum *.stories.js colocado ao lado.
---

# Storybook Story Standard

Define como um arquivo `.stories.js` é escrito para um custom element do
kuba, e como um exemplo composto com múltiplos componentes ("Guide") é
escrito. Esta skill é o equivalente, no Storybook, das skills
`jsdoc-standard` e `types-standard`: aquelas decidem qual é o contrato
público do componente; esta transforma esse contrato em uma story que um
consumidor consegue ver e manipular.

Leia `references/story-structure.md` antes de escrever qualquer arquivo de
story — cobre onde o arquivo fica, a forma do CSF3, e `args` vs `render`.
Leia `references/argtypes-and-events.md` quando o componente tiver
atributos para expor como controles ou disparar um `CustomEvent`. Leia
`references/accessibility-and-docs.md` para os defaults de a11y/autodocs.

## Os dois fatos que moldam todas as regras aqui

1. **O kuba não tem um Custom Elements Manifest.** A inferência automática
   de `argTypes` do Storybook lê metadados gerados por um analisador de
   código-fonte (ex.: um `custom-elements.json` via
   `@custom-elements-manifest/analyzer`, que escaneia a *implementação* da
   classe), e o kuba não produz isso — o contrato público mora só num
   `types.d.ts` escrito à mão, separado da implementação não tipada.
   Não há nada para um analisador ler. Por isso **todo `argTypes` neste
   repositório é escrito manualmente**, transcrevendo o `types.d.ts`
   irmão, nunca deixado para inferência automática.
2. **O kuba não tem `lit` como dependência, de propósito**
   (`.claude/rules/068_proibicao-martelo-de-ouro.md` — nenhum framework é
   trazido só para renderizar uma story). Stories renderizam markup como
   uma string de template simples retornada por `render()`. Este é um
   padrão de primeira classe, totalmente suportado pelo Storybook, não uma
   gambiarra — ver `references/story-structure.md`.

## Regra 1 — Um arquivo de story por pacote de custom element, colocado

Uma story para `packages/<categoria>/<nome>/` fica em
`packages/<categoria>/<nome>/<nome>.stories.js`, ao lado de `types.d.ts` e
do arquivo de implementação — o mesmo princípio de colocação da
`types-standard` (CCP/CRP: o que muda junto, fica junto). Nunca
centralize stories de componente numa árvore `stories/` separada.

A **única exceção** é um exemplo composto que atravessa mais de um pacote
(ex.: um botão conectado a um redirect) — isso não pertence ao pacote de
nenhum componente individual, então fica em `stories/examples/` na raiz do
repositório. Ver `references/story-structure.md` § "Guides" para quando um
exemplo composto se justifica e como ele é titulado.

## Regra 2 — `argTypes` transcreve o `types.d.ts`, nunca o contrário

Para cada atributo refletido documentado no `types.d.ts` do componente,
escreva uma entrada em `argTypes`, reaproveitando o texto daquele JSDoc para
`description` e a forma documentada para `control`/`options`. Se o
`types.d.ts` ganhar um atributo novo (ou perder um), o `argTypes` da story
precisa ser atualizado na mesma mudança — eles não podem divergir. Ver
`references/argtypes-and-events.md` para a tabela de mapeamento
(`'list'|'grid'` → `select`, `string` sem restrição → `text`, `boolean` →
`boolean`, etc.) e para o que fazer com um tipo de atributo em template
literal (`KUBA<Name>OnAttribute` e afins) que o TypeScript consegue
expressar mas os controles do Storybook não.

## Regra 3 — Um `CustomEvent` disparado é conectado via `parameters.actions.handles`, nunca um listener manual

Se o `types.d.ts` do componente documenta que ele dispara um evento (ex.:
`"clicked"`, `"submitted"`), o meta da story declara:

```js
parameters: {
  actions: { handles: ['clicked'] },
}
```

**Não** recorra a `document.createElement` + `addEventListener` para
observar o evento numa story — esse padrão existe no ecossistema mais
amplo do Storybook para frameworks sem esse atalho, mas os eventos
disparados pelo kuba são sempre `CustomEvent`s simples com bubbling, o que
`actions.handles` já captura declarativamente, condizente com o próprio
modelo do kuba de "o DOM já sabe se comunicar".

## Regra 4 — Defaults de acessibilidade

Todo arquivo de story novo recebe `parameters: { a11y: { test: 'todo' } }`
no nível do meta por padrão — **não** `'error'` — até que o componente
tenha sido deliberadamente auditado (ver `references/accessibility-and-docs.md`
para o caminho de promoção de `'todo'` para `'error'`). Nunca omita o
parâmetro de a11y silenciosamente; um parâmetro omitido não é a mesma coisa
que um `'todo'` deliberado.

## Fluxo de trabalho

1. Leia o `types.d.ts` do componente por inteiro — liste cada atributo
   refletido (com sua forma documentada/`@default`) e cada evento
   disparado documentado.
2. Classifique o alvo (Regra 1): componente único → story colocada;
   demo composta com múltiplos componentes → `stories/examples/`.
3. Escreva o meta (`export default { title, tags: ['autodocs'], render,
   argTypes, args, parameters }`) conforme `references/story-structure.md`.
4. Preencha `argTypes` conforme a Regra 2 /
   `references/argtypes-and-events.md`.
5. Adicione `parameters.actions.handles` conforme a Regra 3, se o
   componente dispara eventos.
6. Adicione o parâmetro de a11y conforme a Regra 4.
7. Escreva pelo menos uma story para cada estado significativamente
   distinto documentado no `types.d.ts` (não toda permutação de atributo —
   ver `references/story-structure.md` § "Quantas stories").
8. Rode `bun run build` (build estático do Storybook) para confirmar que a
   story compila antes de considerar a tarefa concluída.

## Exemplo rápido

Dado que `packages/component/button/types.d.ts` documenta `color: string`,
`variant: string`, `type: 'submit' | 'reset'`, e um método `click()` que
"dispara um evento `clicked`":

```js
export default {
  title: 'Components/Button',
  tags: ['autodocs'],
  parameters: {
    actions: { handles: ['clicked'] },
    a11y: { test: 'todo' },
  },
  render: ({ color, variant, type, label }) =>
    `<kb-button color="${color}" variant="${variant}" type="${type}">${label}</kb-button>`,
  argTypes: {
    color: { control: 'text', description: 'Semantic color, resolved against the `--color-{value}` CSS custom property.' },
    variant: { control: 'text', description: 'Visual style, exposed to CSS as a custom element state.' },
    type: { control: { type: 'select' }, options: ['submit', 'reset'], description: 'Native button behavior inside a `<form>`.' },
    label: { control: 'text' },
  },
  args: { color: 'primary', variant: 'solid', type: 'submit', label: 'Save' },
}

export const Primary = {}
export const Outline = { args: { variant: 'outline' } }
```
