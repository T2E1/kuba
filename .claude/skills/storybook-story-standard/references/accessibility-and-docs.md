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

## MDX vs autodocs — não duplique

`tags: ['autodocs']` já gera uma página de docs completa a partir de
`args`, `argTypes`, e a lista de stories — não escreva também uma página
`.mdx` à mão para o mesmo componente que só reafirma a mesma tabela de
controles. Escreva `.mdx` só para prosa que não tem lugar natural numa
página de docs gerada: `stories/introduction.mdx` (hub/getting started) e
`stories/foundations/*.mdx` (conceitos — posicionamento, arquitetura HDA,
o bus `Echo`, princípios de design, mapa de pacotes) são os usos atuais de
`.mdx` neste repositório. `title: 'Foundations/<Nome>'`, sempre com prosa
que assume nenhum conhecimento prévio e termina apontando para as páginas
relacionadas (Foundations se referenciam entre si e para as categorias de
componentes) — cada página nova de Foundations deve ser adicionada também
à lista "Read this next" de `stories/introduction.mdx`, senão fica
inalcançável a partir do hub.
