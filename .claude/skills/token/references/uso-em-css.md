# Uso de tokens em CSS

Qual token usar em cada propriedade CSS, e as proibições de escala. Abra este
arquivo ao **escrever ou revisar estilos** — para *nomear* um token novo, use
`niveis.md` e `montagem-e-ordem.md`.

Os tokens do design system vivem em `packages/pixel/tokens/` e são consumidos
como CSS Custom Properties (`var(--token)`).

## Propriedade → categoria de token

| Propriedade CSS | Categoria | Exemplo |
|---|---|---|
| `color` | `--color-*` | `color: var(--color-master-dark)` |
| `background`, `background-color` | `--color-*` | `background: var(--color-master-lightest)` |
| `border-color` | `--color-*` | `border-color: var(--color-master-light)` |
| `border-width` | `--border-width-*` | `border-width: var(--border-width-thin)` |
| `border-radius` | `--border-radius-*` | `border-radius: var(--border-radius-sm)` |
| `padding`, `padding-*` | `--spacing_inset-*` | `padding: var(--spacing_inset-xs)` |
| `margin`, `margin-*` | `--spacing-*` | `margin-bottom: var(--spacing-nano)` |
| `gap`, `row-gap`, `column-gap` | `--spacing-*` | `gap: var(--spacing-nano)` |
| `font-size` | `--font-size-*` | `font-size: var(--font-size-xs)` |
| `font-family` | `--font-family-*` | `font-family: var(--font-family-base)` |
| `font-weight` | `--font-weight-*` | `font-weight: var(--font-weight-regular)` |
| `line-height` | `--line-height-*` | `line-height: var(--line-height-md)` |
| `opacity` | `--opacity-level-*` | `opacity: var(--opacity-level-medium)` |
| `box-shadow` | `--shadow-level-*` | `box-shadow: var(--shadow-level-1)` |
| `fill`, `stroke` (SVG) | `--color-*` | `fill: var(--color-primary)` |

## Escala de cor — o tom define onde usar

Cada paleta tem 5 níveis de intensidade:

| Tom | Uso |
|---|---|
| `*-darker` | Títulos e texto fortemente destacado |
| `*-dark` | Texto principal e interativo |
| `*` (base) | Botões e elementos interativos |
| `*-light` | Ícones e destaques sutis |
| `*-lighter` | Fundos de componentes |

**Regra crítica:** tom `dark` nunca em `background`; tom `light` nunca em `color`
de texto. Quebrar isso destrói o contraste em dark mode, porque as cores usam
`light-dark()` internamente.

## Paletas semânticas

| Paleta | Uso |
|---|---|
| `master` | Escala de cinza — texto neutro, bordas e fundos |
| `primary` | Identidade da marca — ações principais |
| `complete` | Progresso e conclusão |
| `success` | Feedback positivo |
| `warning` | Avisos |
| `danger` | Erros |
| `info` | Informativo neutro |
| `menu` | Navegação em contextos dark |
| `pure-white` / `pure-black` | Contraste absoluto apenas |

## Espaçamento — interno vs. externo

| Contexto | Token | Proibição |
|---|---|---|
| `padding` | `--spacing_inset-*` | Nunca `--spacing-*` |
| `margin` | `--spacing-*` | Nunca `--spacing_inset-*` |
| `gap` | `--spacing-*` | Nunca `--spacing_inset-*` |

`inset` significa espaço *dentro* da caixa. É a distinção que mantém a escala
coerente quando componentes são compostos.

## Token obrigatório por tipo de componente

| Componente | Propriedade | Token |
|---|---|---|
| Botão interativo | `background` | `--color-primary` |
| Botão interativo | `border-radius` | `--border-radius-sm` |
| Input | `border-width` | `--border-width-thin` |
| Input | `border-radius` | `--border-radius-xs` |
| Texto de erro | `color` | `--color-danger-*` |
| Texto de sucesso | `color` | `--color-success-*` |
| Borda neutra | `border-color` | `--color-master-light` |
| Fundo principal | `background` | `--color-master-lightest` |
| Título / header | `font-family` | `--font-family-highlight` |
| Título / header | `font-weight` | `--font-weight-bold` |
| Texto regular | `font-family` | `--font-family-base` |
| Parágrafo | `line-height` | `--line-height-md` |

## Propriedades sem token

Estas aceitam valor direto — não existe token e inventar um seria ruído:

| Propriedade | Valores |
|---|---|
| `display`, `position`, `visibility`, `overflow` | Qualquer valor válido |
| `flex`, `flex-grow`, `flex-shrink`, `order` | Numéricos |
| `z-index` | Numéricos |
| `width`, `height` | `100%`, `auto`, `min-content`, `max-content` |
| `min-width`, `max-width` | `0`, `none`, `100%` |
| `top`, `left`, `right`, `bottom` | `0` |
| `border-style` | `solid`, `dashed`, `dotted` |
| `transition`, `animation` | Duração e timing |
| `transform` | Qualquer função |
| `cursor` | `pointer`, `default`, `not-allowed` |
| `pointer-events`, `user-select` | Qualquer valor válido |

## Proibições

| O que evitar | Razão |
|---|---|
| `color: #000` / `black` | Usar `--color-master-darkest` ou paleta semântica |
| `background: #fff` / `white` | Usar `--color-master-lightest` ou `--color-pure-white` |
| `border: 1px solid #ccc` | Separar em `border-width`, `border-style`, `border-color` com tokens |
| `padding: 16px` | Usar `--spacing_inset-xs` |
| `margin: 8px` | Usar `--spacing-nano` |
| `gap: 24px` | Usar `--spacing-xxs` |
| `font-size: 16px` | Usar `--font-size-xs` |
| `font-weight: 700` | Usar `--font-weight-bold` |
| `opacity: 0.5` | Usar o `--opacity-level-*` mais próximo |
| Tom `dark` em `background` | Usar `*-lighter` ou `*-lightest` |
| Tom `light` em `color` de texto | Usar `*-darker` ou `*-dark` |

Todas caem sob [024 — Proibição de Constantes Mágicas](../../../rules/024_proibicao-constantes-magicas.md).
