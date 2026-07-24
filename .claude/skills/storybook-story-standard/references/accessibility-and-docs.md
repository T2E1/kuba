# Defaults de acessibilidade e autodocs

## a11y: comece em `'todo'`, promova para `'error'` deliberadamente

Todo meta de story novo recebe:

```js
parameters: {
  a11y: { test: 'todo' },
}
```

`'todo'` mostra violações no painel de Acessibilidade sem falhar um build —
o default certo para um componente que ninguém auditou ainda. `'error'` é
uma promoção deliberada, feita depois que alguém revisou os achados do
painel para aquele componente específico e ou os corrigiu, ou confirmou
que são falsos positivos (documentado via `parameters.a11y.config.rules`,
não silenciosamente ignorado). Nunca comece uma story nova em `'error'` —
isso trata "eu não verifiquei" como se fosse a mesma coisa que "eu
verifiquei e está limpo", o que não é. Também nunca omita o parâmetro
`a11y` — um parâmetro ausente soa como descuido, não como um `'todo'`
intencional.

Caminho de promoção para uma story existente:
1. Abra a story no Storybook, veja a aba Violations do painel de
   Acessibilidade.
2. Corrija o que for corrigível no markup/atributos do componente.
3. Para um falso positivo genuíno (comum: componentes isolados disparando
   a regra de landmark "region"), desabilite aquela regra específica com
   um comentário explicando o motivo:
   ```js
   parameters: {
     a11y: {
       test: 'error',
       config: { rules: [{ id: 'region', enabled: false }] },
     },
   },
   ```
4. Só então mude `test` para `'error'`.

## Autodocs

`tags: ['autodocs']` é definido por meta (não globalmente em
`preview.js`), para que um componente possa optar por sair
deliberadamente com `tags: ['!autodocs']` se estiver em meio a uma
refatoração e não devesse aparecer no site de docs publicado ainda —
habilitação global tornaria esse override por componente o único sinal, o
que é fácil de passar batido em revisão. Toda story de componente
finalizada mantém `autodocs` ligado; este Storybook *é* a documentação do
kuba, então um componente sem página de docs é, na prática, um componente
não documentado para quem consome.

## MDX vs autodocs — duas formas, nunca as duas ao mesmo tempo no mesmo componente

`tags: ['autodocs']` gera uma página de docs a partir de `args`,
`argTypes`, e a lista de stories — suficiente enquanto a única pergunta
que a página precisa responder é "quais atributos existem". Isso continua
sendo o **default** para um componente novo (Regra 4 do `SKILL.md`).

Um componente pode evoluir para um `<name>.mdx` colocado (Regra 5 do
`SKILL.md`, `references/usage-doc.md`) quando o pedido for por orientação
de uso — hierarquia de variantes, semântica de cor, composição
pai/filho, do's/don'ts — que não cabe em `description` de `argTypes`. O
`.mdx` se conecta ao mesmo arquivo de stories via `<Meta of={XStories} />`
(`import * as XStories from './x.stories.js'`) e reconstrói o mesmo
playground com `<Canvas of={XStories.Primary} />` + `<Controls />` antes
da prosa — a página nunca perde a tabela de controles, só ganha contexto
ao redor dela. Quando isso acontece, **remova** `tags: ['autodocs']` do
meta do `.stories.js`: Storybook trata uma página com `<Meta of={...}/>`
mais um CSF marcado `autodocs` como duas páginas conflitantes para o mesmo
título e falha o build com "you created a component docs page [...] but
also tagged the CSF file with 'autodocs'". Ver `packages/component/button/`
(`button.mdx` + `button.stories.js`) como referência.

Prosa conceitual sem componente vivo continua em `stories/introduction.mdx`
(hub/getting started) e `stories/foundations/*.mdx` (posicionamento,
arquitetura HDA, o bus `Echo`, princípios de design, mapa de pacotes) —
`title: 'Foundations/<Nome>'`, sempre assumindo nenhum conhecimento prévio
e terminando por apontar para as páginas relacionadas; cada página nova de
Foundations deve ser adicionada também à lista "Read this next" de
`stories/introduction.mdx`, senão fica inalcançável a partir do hub. A
diferença para um `<name>.mdx` de componente: Foundations não tem
`<Meta of={...}/>` apontando pra um CSF (é uma página autônoma, sem
`argTypes` para reconstruir), enquanto um `.mdx` de componente sempre tem.
