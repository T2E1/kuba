# ❌ §05 misturando níveis e descendo a código

Correto em: `building-block-view.valid.md`

```markdown
# §05 — Visão de Blocos de Construção

O sistema tem vários componentes. O `button` usa um mixin chamado `On`
que registra listeners com o decorator `@on.click`, e o construtor chama
`super()` antes de tudo, seguido de `attachShadow({ mode: 'open' })`.
O `style.js` exporta uma função que recebe o elemento e retorna um
template literal com os tokens de cor.

Tem também o `checkbox`, que é parecido, mas usa `Valuable` no lugar de
só `On`, e o atributo `checked` é sincronizado via `attributeChangedCallback`.
```

## Por que não serve

- **Sem nível.** Sistema, container e código aparecem na mesma frase —
  quem quer a visão geral não consegue parar antes do detalhe de
  implementação.
- **Não é reutilizável como blocos.** Não há tabela, não há fronteira
  nomeada — é prosa livre que não vira diagrama nem índice.
- **Duplica o que o código já diz.** `@on.click` e `attachShadow` já
  estão documentados no próprio `component.js` (JSDoc); repetir aqui é
  o mesmo conteúdo com risco de divergir quando o código mudar.
- **Não decompõe.** "Tem também o `checkbox`, que é parecido" não diz
  qual é a responsabilidade do bloco — só que existe e se parece com
  outro.
