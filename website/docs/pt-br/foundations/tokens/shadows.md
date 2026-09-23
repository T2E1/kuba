# Sombras

Níveis de elevação, definidos em `packages/pixel/tokens/shadow.css`.

| Token | Deslocamento Y | Blur | Amostra |
|---|---|---|---|
| `--shadow-level-0` | — | `none` | <span class="box" style="background: var(--color-pure-white); box-shadow: var(--shadow-level-0)"></span> |
| `--shadow-level-1` | 1px | 3px | <span class="box" style="background: var(--color-pure-white); box-shadow: var(--shadow-level-1)"></span> |
| `--shadow-level-2` | 3px | 8px | <span class="box" style="background: var(--color-pure-white); box-shadow: var(--shadow-level-2)"></span> |
| `--shadow-level-3` | 6px | 18px | <span class="box" style="background: var(--color-pure-white); box-shadow: var(--shadow-level-3)"></span> |
| `--shadow-level-4` | 8px | 14px | <span class="box" style="background: var(--color-pure-white); box-shadow: var(--shadow-level-4)"></span> |
| `--shadow-level-5` | 12px | 22px | <span class="box" style="background: var(--color-pure-white); box-shadow: var(--shadow-level-5)"></span> |

Cada nível é um `box-shadow` **composto** — três camadas empilhadas em
deslocamentos e opacidades diferentes, não um valor único. É isso que faz a
profundidade parecer luz caindo sobre um objeto, e não um borrão cinza atrás.

Quanto mais alto o nível, mais o elemento deve parecer estar acima da superfície:

| Nível | Para |
|---|---|
| 0 | O padrão em repouso. A maioria dos componentes nunca sai dele. |
| 1–2 | Algo elevado da página mas ainda parte dela — um card sob hover, uma barra destacada. |
| 3–4 | Flutuando sobre o conteúdo — um dropdown, um popover. |
| 5 | Descolado da página por completo — um modal, uma gaveta. |

?> **Nenhum componente do kuba usa sombra hoje.** Cards, botões e inputs são
planos por design, distinguidos por preenchimento e borda. Estes tokens existem
para o produto que você constrói em cima — use-os quando um elemento genuinamente
flutua sobre os outros, não para dar peso visual a algo que não flutua.

```html preview
<kb-stack direction="row" spacing="xs">
  <kb-card style="box-shadow: var(--shadow-level-2)">
    <kb-text size="xxs">Nível 2</kb-text>
  </kb-card>
  <kb-card style="box-shadow: var(--shadow-level-4)">
    <kb-text size="xxs">Nível 4</kb-text>
  </kb-card>
</kb-stack>
```

!> As sombras são calibradas para superfícies claras — são pretas em opacidade
baixa. Sobre fundo escuro ficam quase invisíveis, já que uma sombra não consegue
escurecer o que já está escuro. Elevação no modo escuro vem de uma cor de
superfície mais clara: suba um passo na rampa `master` em vez de somar sombra.
