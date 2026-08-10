---
name: story
model: sonnet
description: Escreve e revisa stories do Storybook (.stories.js), páginas de uso (.mdx) e testes de interação (play) para custom elements do kuba — argTypes transcrevendo o types.d.ts, eventos conectados via parameters.actions.handles, stories com play que exercitam de verdade cada evento disparado, convenções de título e hierarquia, defaults de acessibilidade, e orientação de quando/como usar (hierarquia de variantes, semântica de cor, composição pai/filho, do's/don'ts). Use quando o usuário pedir para "criar uma story", "adicionar uma story do Storybook", "escrever stories para este componente", "documentar este componente no Storybook", "documentar quando usar/quando não usar", "documentar variantes/cores/tamanhos", "testar interação/clique/evento no Storybook", "escrever um play para esta story", ou quando um pacote em packages/**/ tiver types.d.ts mas nenhum *.stories.js ao lado.
---

# Story

## O que é

Define como um arquivo `.stories.js` é escrito para um custom element do kuba, e
como um exemplo composto com múltiplos componentes é escrito. É o equivalente, no
Storybook, das skills `types` e `jsdoc`: aquelas decidem qual é o contrato público
do componente; esta transforma esse contrato em algo que um consumidor consegue ver
e manipular.

Dois fatos deste repositório moldam todas as regras abaixo:

1. **O kuba não tem Custom Elements Manifest.** A inferência automática de `argTypes`
   lê metadados gerados por um analisador de código-fonte (ex.: `custom-elements.json`
   via `@custom-elements-manifest/analyzer`), e o kuba não produz isso — o contrato
   público mora só num `types.d.ts` escrito à mão. Não há nada para um analisador ler.
   Por isso **todo `argTypes` aqui é escrito manualmente**, transcrevendo o `types.d.ts`
   irmão.
2. **O kuba não tem `lit` como dependência, de propósito.** Nenhum framework é trazido
   só para renderizar uma story. Stories renderizam markup como string de template
   retornada por `render()` — padrão de primeira classe, totalmente suportado.

## Quando usar

| Situação | Ação |
|---|---|
| Pacote com `types.d.ts` e sem `*.stories.js` | Criar a story colocada ao lado |
| Componente ganhou atributo novo no `types.d.ts` | Atualizar `argTypes` na mesma mudança |
| Componente dispara `CustomEvent` documentado | Adicionar `actions.handles` + story com `play` |
| Pedido de "quando usar / quando não usar" | Escrever a página `.mdx` de uso (Regra 5) |
| Demo atravessa mais de um pacote | Colocar em `stories/examples/` na raiz |

Não use esta skill para definir o contrato do componente — isso é a skill `types`.
A story transcreve o contrato, nunca o inventa.

## Como aplicar

### Regra 1 — Uma story por pacote, colocada

A story de `packages/<categoria>/<nome>/` fica em
`packages/<categoria>/<nome>/<nome>.stories.js`, ao lado de `types.d.ts` e da
implementação — o que muda junto fica junto. Nunca centralize stories de componente
numa árvore `stories/` separada.

Única exceção: exemplo composto que atravessa mais de um pacote (ex.: um botão
conectado a um redirect). Não pertence a nenhum pacote individual, então vai para
`stories/examples/` na raiz. Ver `references/story-structure.md` § "Guides".

### Regra 2 — `argTypes` transcreve o `types.d.ts`, nunca o contrário

Para cada atributo refletido documentado no `types.d.ts`, escreva uma entrada em
`argTypes`, reaproveitando o texto do JSDoc para `description` e a forma documentada
para `control`/`options`. Se o `types.d.ts` ganhar ou perder um atributo, o `argTypes`
muda na mesma alteração — eles não podem divergir.

Inclua `table.defaultValue.summary` para todo atributo com `@default` documentado;
sem isso a coluna "Default" do painel de Controls fica em branco.

Ver `references/argtypes-and-events.md` para a tabela de mapeamento e para o que fazer
com tipos em template literal que o TypeScript expressa mas os controles não.

### Regra 3 — Evento conectado via `parameters.actions.handles`

Todo evento que o `types.d.ts` documenta como disparado é declarado no meta em
`parameters.actions.handles`, como lista de nomes de evento — ver
[component-story.valid.js](examples/component-story.valid.js).

**Não** use `document.createElement` + `addEventListener` para observar o evento numa
story. Esse padrão existe no ecossistema para frameworks sem o atalho; os eventos do
kuba são `CustomEvent`s simples com bubbling, que `actions.handles` captura
declarativamente.

### Regra 4 — Defaults de acessibilidade

Todo arquivo de story novo recebe `parameters: { a11y: { test: 'todo' } }` no nível do
meta — **não** `'error'` — até que o componente tenha sido deliberadamente auditado.
Nunca omita o parâmetro silenciosamente: omitido não é a mesma coisa que `'todo'`
deliberado. Caminho de promoção em `references/accessibility-and-docs.md`.

### Regra 5 — A página `.mdx` é a evolução do autodocs, não um adendo

Um catálogo de `argTypes` responde "quais atributos existem". Não responde "qual
variante uso aqui", "essa cor é permitida nesse caso", ou "o que pode ser filho disso"
— perguntas que todo design system maduro documenta como prosa ao lado do catálogo,
nunca em vez dele.

Quando o pedido pedir esse nível de orientação, escreva
`packages/<categoria>/<nome>/<nome>.mdx` seguindo `references/usage-doc.md`. Ele
**substitui** a página de autodocs: remova `tags: ['autodocs']` do `.stories.js`
(manter os dois gera erro de índice duplicado no build) e recrie o playground
`<Canvas>`/`<Controls>` no topo, antes da prosa.

Quando um componente tem `.mdx`, o `.stories.js` deixa de ser catálogo. Cada exemplo
visual vira um bloco `<Canvas><Story of={XStories.ClickDispatchesEvent} args={{ … }} /></Canvas>`
dentro da seção que ele ilustra. Repetir a mesma variação como export nomeado *e* como
bloco no `.mdx` é a mesma informação em dois lugares. Nesse caso o `.stories.js` mantém
só `export default` e os cenários de teste da Regra 6.

### Regra 6 — Todo evento documentado ganha uma story com `play`

`actions.handles` só torna o evento *visível* quando alguém clica manualmente. Isso não
prova que o evento funciona — só que, se disparar, o painel mostra.

Para cada evento que o `types.d.ts` documenta como disparado, escreva uma story
exportada normalmente (`export const NomeDoEvento = { … }` — nunca omitida do export,
mesmo sendo "só um teste") cujo `play`:

1. Localiza o elemento renderizado.
2. Registra um `fn()` como listener do evento.
3. Simula a interação real que deveria dispará-lo (`userEvent.click`, `userEvent.type`
   — nunca `element.dispatchEvent(...)` manual, que testaria o event bus e não o
   componente).
4. Faz `expect` de que o listener foi chamado e de que `detail` carrega o valor esperado.

Isso é teste funcional executado na aba Interactions (PASS/FAIL por passo). Foi o que
teria pego, antes de qualquer revisão manual, o bug em que `<kb-button>` não expunha
`internals` publicamente para o mixin `Hidden`: a story `hidden` do Controls
"funcionava" visualmente até alguém clicar em `True` e notar que nada acontecia.

### Fluxo de trabalho

1. Leia o `types.d.ts` por inteiro — liste cada atributo refletido (com `@default`) e
   cada evento disparado documentado.
2. Classifique o alvo (Regra 1): componente único → story colocada; demo composta →
   `stories/examples/`.
3. Escreva o meta (`title`, `tags`, `render`, `argTypes`, `args`, `parameters`).
4. Preencha `argTypes` (Regra 2), incluindo `table.defaultValue.summary`.
5. Adicione `parameters.actions.handles` (Regra 3), se houver eventos.
6. Adicione o parâmetro de a11y (Regra 4).
7. Escreva uma story para cada estado significativamente distinto — não toda
   permutação de atributo.
8. Para cada evento documentado, escreva a story de interação (Regra 6).
9. Se o pedido incluir orientação de uso (Regra 5), escreva o `.mdx` e remova
   `tags: ['autodocs']`.
10. Rode `bun run build` para confirmar que a story (e o `.mdx`) compila.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Meta completo: `argTypes` do `types.d.ts`, evento declarado, a11y explícito | [component-story.valid.js](examples/component-story.valid.js) | [component-story.invalid.js](examples/component-story.invalid.js) |
| Story com `play` provando o evento (Regra 6) | [event-interaction.valid.js](examples/event-interaction.valid.js) | — |

`packages/component/button/` (`types.d.ts` + `button.stories.js` + `button.mdx`) é a
referência viva de todos esses padrões. Use como modelo de forma, não copie a prosa.

## Checklist

- [ ] Arquivo colocado ao lado do `types.d.ts`, não em árvore separada
- [ ] Todo atributo refletido do `types.d.ts` tem entrada em `argTypes`
- [ ] Todo atributo com `@default` tem `table.defaultValue.summary`
- [ ] Eventos disparados declarados em `parameters.actions.handles`
- [ ] `parameters.a11y.test` presente e deliberado (`'todo'` até auditoria)
- [ ] Cada evento documentado tem story com `play` exportada
- [ ] `play` usa interação real, não `dispatchEvent` manual
- [ ] Se há `.mdx`, `tags: ['autodocs']` foi removido do `.stories.js`
- [ ] `bun run build` passa

## Troubleshooting

### Erro de índice duplicado no build do Storybook

**Causa:** o componente tem `.mdx` de uso e o `.stories.js` ainda declara
`tags: ['autodocs']`. Duas páginas de documentação disputam o mesmo id.
**Solução:** remover `tags: ['autodocs']` do meta.

### A coluna "Default" do painel de Controls está em branco

**Causa:** `argTypes` não declara `table.defaultValue.summary`. O Storybook não infere
o default sem manifest.
**Solução:** transcrever o `@default` do `types.d.ts` para `table.defaultValue.summary`.

### O controle aparece mas mudar o valor não faz nada

**Causa:** o atributo é refletido no `types.d.ts` mas o componente não o expõe de fato
— foi o caso de `<kb-button>` com o mixin `Hidden`.
**Solução:** escrever a story com `play` da Regra 6; ela falha e localiza o defeito no
componente, não na story.

## Referências

- `references/story-structure.md` — onde o arquivo fica, forma do CSF3, `args` vs `render`, quantas stories, Guides.
- `references/argtypes-and-events.md` — tabela de mapeamento tipo → control, e tipos em template literal.
- `references/interactions.md` — como escrever o `play` de cada evento.
- `references/accessibility-and-docs.md` — defaults de a11y/autodocs e promoção de `'todo'` para `'error'`.
- `references/usage-doc.md` — estrutura da prosa da página `.mdx` de uso.

## Rules relacionadas

- [068 — Proibição do Martelo de Ouro](../../rules/068_proibicao-martelo-de-ouro.md):
  justifica não trazer `lit` só para renderizar stories.
- [021 — Proibição de Duplicação de Lógica](../../rules/021_proibicao-duplicacao-logica.md):
  a mesma variação não vive como export nomeado e bloco `.mdx` ao mesmo tempo.
- [016 — Princípio do Fechamento Comum](../../rules/016_principio-fechamento-comum.md):
  a story fica colocada porque muda junto com o componente.
- [032 — Cobertura Mínima de Teste e Qualidade](../../rules/032_cobertura-teste-minima-qualidade.md):
  a story com `play` é teste funcional real, seguindo Arrange/Act/Assert.
- [026 — Qualidade de Comentários](../../rules/026_qualidade-comentarios-porque.md):
  a página `.mdx` documenta o porquê da escolha de variante, não o que o atributo é.

## Skills relacionadas

- [prose](../prose/SKILL.md): reinforces — a `description` do controle é lida por quem consome.
- [types](../types/SKILL.md): depends on — o `types.d.ts` é a fonte que `argTypes` transcreve.
- [jsdoc](../jsdoc/SKILL.md): depends on — o texto do JSDoc vira a `description` do controle.
- [token](../token/SKILL.md): complements — as stories mostram visualmente as variantes que os tokens produzem.
- [event](../event/SKILL.md): reinforces — os eventos que a story exercita seguem a convenção de eventos.
- [bdd](../bdd/SKILL.md): complements — cenários Gherkin e stories com `play` descrevem o mesmo comportamento em públicos diferentes.

---

**Criado em**: 2026-08-09
**Atualizado em**: 2026-08-09
**Versão**: 2.0
