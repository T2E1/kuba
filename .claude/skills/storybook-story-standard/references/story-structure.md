# Estrutura da story — localização, forma CSF3, args vs render

## Localização e nomenclatura do arquivo

- Story de componente: `packages/<categoria>/<nome>/<nome>.stories.js` — colocada com `types.d.ts`, `<nome>.ts`, `style.js`, `component.js`.
- Exemplo composto com múltiplos componentes ("Guide"): `stories/examples/<slug>.stories.js` na raiz do repositório — só quando o exemplo de fato atravessa mais de um custom element de pacotes diferentes (a story de um componente sozinho nunca vai para cá).
- Páginas narrativas/de apresentação (sem componente vivo): `stories/<slug>.mdx` — ex.: `stories/introduction.mdx`. Não escreva um `.mdx` para algo que uma `.stories.js` com `tags: ['autodocs']` já cobre; MDX é para prosa que não tem lugar natural numa página de docs gerada.

## Título / hierarquia

- Stories de componente: `title: 'Components/<PascalName>'` para `packages/component/*`, `'Form/<PascalName>'` para `packages/form/*`, `'Layout/<PascalName>'` para `packages/layout/*`, `'Typography/<PascalName>'` para `packages/typography/*` — o segmento antes da barra bate com a categoria do `packages/`, em inglês simples, para que o sidebar agrupe pela mesma taxonomia da árvore de código-fonte.
- `packages/behavior/*` e outros elementos headless/não-visuais geralmente não ganham story de componente (não há estado visual para pré-visualizar) — ver a nota sobre elementos headless em `references/argtypes-and-events.md` antes de escrever uma mesmo assim.
- Exemplos compostos: `title: 'Guides/<descrição em Title Case>'`, ex.: `'Guides/Declarative navigation'`.
- Nunca invente uma hierarquia mais profunda (`'Components/Buttons/Primary/Solid'`) — um nível abaixo da categoria já basta para o tamanho atual deste repositório; aninhar mais fundo é prematuro (`.claude/rules/064_proibicao-overengineering.md`).

## Forma do meta em CSF3

```js
export default {
  title: 'Components/Button',
  tags: ['autodocs'],
  parameters: { /* actions.handles, a11y — ver outras referências */ },
  render: (args) => `...`,
  argTypes: { /* uma entrada por atributo do types.d.ts */ },
  args: { /* um valor default por argType */ },
}

export const NomeDaStory = {
  args: { /* só os overrides que diferem do args do meta */ },
}
```

- `tags: ['autodocs']` é obrigatório no meta de toda story de componente — é o que transforma a story numa página de docs (este Storybook é o site de documentação do kuba, não só uma ferramenta de preview).
- Exports de story são UpperCamelCase e nomeados pelo *estado* que mostram (`Primary`, `Outline`, `Danger`, `Disabled`), nunca só pelo valor do atributo se o valor sozinho não for significativo para quem está escaneando o sidebar.
- Não repita `args` entre stories — uma story só define o que é *diferente* do `args` do meta. Se duas stories precisam do mesmo override exato, é sinal de que esse override pertence ao meta em vez de a cada story.

## `render` sem `lit`

Stories do kuba retornam uma string de template simples — sem import de
`lit-html` (`.claude/rules/068_proibicao-martelo-de-ouro.md`, e ver a
racional no `SKILL.md`). Isso é totalmente suportado pelo
`@storybook/web-components-vite`, não é gambiarra:

```js
render: ({ color, variant, type, label }) =>
  `<kb-button color="${color}" variant="${variant}" type="${type}">${label}</kb-button>`,
```

Interpolar `args` na string é seguro aqui porque os valores de `args` vêm
do painel de Controls do Storybook (entrada confiável, voltada a
desenvolvedores), não de entrada de usuário não confiável — não é o mesmo
modelo de ameaça da preocupação de
`.claude/rules/030_proibicao-funcoes-inseguras.md` sobre concatenar string
não confiável em comandos/consultas.

Para uma story que precisa de markup filho via slot em vez de só
atributos, interpole o conteúdo do slot da mesma forma:

```js
render: ({ direction, value, content }) =>
  `<kb-card direction="${direction}" value="${value}">${content}</kb-card>`,
```

## Quantas stories

Escreva uma story por estado que seja significativo para alguém decidindo
como usar o componente — não uma varredura combinatória de todo valor de
atributo. Para `<kb-button>` (`color`, `variant`, `type`): `Primary` (o
default), `Outline` (a outra `variant`), e `Danger` (um `color`
semanticamente distinto) já basta; uma matriz
`PrimarySolidSubmit`/`PrimarySolidReset`/`PrimaryOutlineSubmit`/... é
cobertura especulativa que ninguém pediu
(`.claude/rules/023_proibicao-funcionalidade-especulativa.md`). Adicione
uma story nova quando um caso de uso real precisar dela, não
preventivamente.
