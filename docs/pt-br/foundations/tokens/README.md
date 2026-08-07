# Design tokens

Design tokens são as variáveis de estilo que ficam entre design e código. Em vez
de um valor solto — `24px`, `#6d5cae` — espalhado pela base, toda decisão visual
ganha um nome semântico e uma única fonte da verdade.

Eles vivem em `packages/pixel/tokens/`, um arquivo CSS por grupo, todos
declarados em `:root` e entregues no `dist/kuba.css`. Os componentes os consomem
por `var(--nome-do-token)` no `style.js` de cada elemento — nunca um valor
fixo.

```css
/* Mude o token, e todo elemento que o usa acompanha */
:root {
  --color-primary: #0b7285;
}
```

## Grupos

| Grupo | Define |
|---|---|
| [Cores](/pt-br/foundations/tokens/colors) | A paleta semântica, com um valor claro e um escuro por token. |
| [Tipografia](/pt-br/foundations/tokens/typography) | Tamanho de fonte, altura de linha, família e peso. |
| [Espaçamento](/pt-br/foundations/tokens/spacing) | Espaçamento de composição e espaçamento interno (`inset`). |
| [Borda](/pt-br/foundations/tokens/border) | Raio e espessura. |
| [Sombras](/pt-br/foundations/tokens/shadows) | Níveis de elevação. |
| [Opacidade](/pt-br/foundations/tokens/opacity) | Níveis de opacidade para estados e sobreposições. |

Todas as páginas abaixo renderizam os tokens ao vivo, lendo da mesma folha de
estilo que sua página carregaria — as amostras mudam quando os valores mudam.

## A regra de nomenclatura

Todo token segue `--{grupo}-{escala}`:

```
--spacing-md
--color-primary-dark
--font-size-xxs
```

**O nome descreve *o que* o token representa, nunca *onde* é usado.** É isso que
permite a `--color-danger` continuar correto colorindo um botão, uma borda ou
uma mensagem de validação — e o que impede a escala de ganhar uma entrada nova a
cada tela desenhada.

## Tokens versus propriedades de componente

Tokens são globais. Cada componente também expõe suas próprias propriedades
`--{componente}-*`, que têm como padrão um token — veja
[Estilização](/pt-br/build-ui/theming) para saber quando usar cada um.

```css
:root { --color-primary: #0b7285 }       /* todo elemento acompanha */
.checkout kb-button { --button-size-height: 56px }  /* só estes botões */
```
