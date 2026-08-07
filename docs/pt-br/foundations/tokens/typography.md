# Tipografia

A tipografia carrega hierarquia. Todo texto da interface deve usar um destes
tokens conforme sua importância — nunca um `font-size` livre.

Definidos em `packages/pixel/tokens/fontSize.css`, `lineHeight.css`,
`fontFamily.css` e `fontWeight.css`.

## Tamanho de fonte

| Token | Valor | Amostra |
|---|---|---|
| `--font-size-xxxs` | 12px | <span style="font-size: var(--font-size-xxxs)">Ag</span> |
| `--font-size-xxs` | 14px | <span style="font-size: var(--font-size-xxs)">Ag</span> |
| `--font-size-xs` | 16px | <span style="font-size: var(--font-size-xs)">Ag</span> |
| `--font-size-sm` | 20px | <span style="font-size: var(--font-size-sm)">Ag</span> |
| `--font-size-md` | 24px | <span style="font-size: var(--font-size-md)">Ag</span> |
| `--font-size-lg` | 32px | <span style="font-size: var(--font-size-lg)">Ag</span> |
| `--font-size-xl` | 40px | <span style="font-size: var(--font-size-xl)">Ag</span> |
| `--font-size-xxl` | 48px | <span style="font-size: var(--font-size-xxl)">Ag</span> |
| `--font-size-xxxl` | 64px | <span style="font-size: var(--font-size-xxxl)">Ag</span> |
| `--font-size-display` | 80px | <span style="font-size: var(--font-size-display)">Ag</span> |
| `--font-size-giant` | 96px | <span style="font-size: var(--font-size-giant)">Ag</span> |

`<kb-text>`, `<kb-label>` e `<kb-icon>` resolvem o atributo `size` contra esta
escala, e é por isso que um ícone dimensionado como o texto ao lado se alinha a
ele.

```html preview
<kb-stack direction="column" spacing="quarck" align="start">
  <kb-text size="xxxs">xxxs — legendas e metadados</kb-text>
  <kb-text size="xxs">xxs — o tamanho padrão de corpo</kb-text>
  <kb-text size="xs">xs — corpo de texto confortável</kb-text>
  <kb-text size="md">md — título de componente</kb-text>
</kb-stack>
```

## Altura de linha

| Token | Valor |
|---|---|
| `--line-height-default` | 100% |
| `--line-height-xs` | 115% |
| `--line-height-sm` | 120% |
| `--line-height-md` | 133% |
| `--line-height-lg` | 150% |
| `--line-height-xl` | 170% |
| `--line-height-xxl` | 200% |

Valores mais apertados servem a tipos de display grandes, onde 100% mantém um
título compacto. Corpo de texto pede `lg` ou `xl` — quanto maior a medida, mais
entrelinha ele precisa para continuar legível.

## Família de fonte

| Token | Valor |
|---|---|
| `--font-family-base` | `"Roboto", sans-serif` |
| `--font-family-highlight` | `"Roboto Condensed", sans-serif` |

`base` é a família padrão de corpo; `highlight` é reservada a títulos e ênfase.
Trocar esses dois tokens basta para dar a uma marca outra voz tipográfica sem
tocar em nenhum componente.

!> As famílias são nomeadas, não empacotadas. Nenhuma das duas fontes vem no
pacote — carregue-as você (Google Fonts, um `@font-face` próprio), ou sobrescreva
os tokens com famílias que você já serve. Sem isso, o navegador cai em
`sans-serif`.

## Peso de fonte

| Token | Valor | Amostra |
|---|---|---|
| `--font-weight-regular` | 400 | <span style="font-weight: var(--font-weight-regular)">O rato roeu a roupa</span> |
| `--font-weight-medium` | 500 | <span style="font-weight: var(--font-weight-medium)">O rato roeu a roupa</span> |
| `--font-weight-bold` | 700 | <span style="font-weight: var(--font-weight-bold)">O rato roeu a roupa</span> |

Três passos, de propósito. `medium` é o que separa um `<kb-label>` de um
`<kb-helper>` no mesmo tamanho — contraste suficiente para ler como rótulo, não o
bastante para ler como título.
