# Estilização

Toda decisão visual no kuba é uma CSS custom property, e toda propriedade tem
como padrão um design token. Você re-estiliza um componente definindo
propriedades de fora — nunca alcançando seu shadow DOM, o que aliás você não
conseguiria.

Existem exatamente duas camadas, e saber qual usar é a maior parte desta página.

## As duas camadas

**Design tokens** são globais: `--color-primary`, `--spacing_inset-xs`,
`--font-size-md`. Mude um e todo componente que o usa acompanha. São o seu tema.

**Propriedades de componente** são locais: `--button-size-height`,
`--card-space-inset`, `--input-color-focus`. Cada uma tem como padrão um token.
Mude uma e só aquele componente muda.

```css
/* Camada 1 — o produto inteiro ganha outro acento */
:root {
  --color-primary: #0b7285;
}

/* Camada 2 — só os botões do checkout ficam mais altos */
.checkout kb-button {
  --button-size-height: 56px;
}
```

Use o token quando a mudança é uma decisão sobre o produto. Use a propriedade de
componente quando é uma decisão sobre um lugar.

## Por que funciona: herança atravessa o shadow boundary

Custom properties herdam, e a herança passa por shadow roots. Esse é o mecanismo
sobre o qual o sistema inteiro se apoia: um valor definido em `:root`, num
ancestral ou no próprio elemento alcança o CSS **dentro** do componente, mesmo
que sua folha de estilo não consiga selecionar nada lá.

```css
kb-button { --button-color-accent: rebeccapurple; }
```

A regra interna do componente lê `var(--button-color-accent, var(--color-primary))`,
encontra seu valor e o usa. Sem `::part`, sem `!important`, sem furar o shadow.

?> Isso também significa que um override num ancestral cascateia para todo
descendente correspondente — `.panel-dark { --text-color: white }` re-estiliza
todo `<kb-text>` daquele painel de uma vez.

## A escala de tokens

Tudo vem no `dist/kuba.css`. Os valores são os mesmos que o design usa; os nomes
são o contrato entre os dois lados.

| Grupo | Passos |
|---|---|
| `--color-*` | `primary`, `master`, `success`, `warning`, `danger`, `info`, `complete`, `menu`, cada um com variantes `-light` / `-lighter` / `-dark` / `-darker`, mais `pure-white` e `pure-black` |
| `--spacing-*` | `quarck` 4px → `giant` 200px — para gaps e margens entre coisas |
| `--spacing_inset-*` | `quarck` 4px → `giant` 56px — para padding dentro de uma superfície |
| `--font-size-*` | `xxxs` 12px → `giant` 96px |
| `--font-weight-*` | `regular` 400, `medium` 500, `bold` 700 |
| `--line-height-*` | `default` 100% → `xxl` 200% |
| `--font-family-*` | `base` (Roboto), `highlight` (Roboto Condensed) |
| `--border-radius-*` | `none`, `sm` 8px, `md` 16px, `lg` 24px, `pill`, `circular` |
| `--border-width-*` | `none`, `hairline`, `thin`, `thick`, `heavy` |
| `--opacity-level-*` | `semitransparent` 0.08 → `semiopaque` 0.72 |

As duas escalas de espaçamento são separadas de propósito: `--spacing-*` mede a
distância *entre* elementos, `--spacing_inset-*` o padding *dentro* de um. Usar a
escala inset para um gap funciona, mas desvia do ritmo que os próprios
componentes mantêm.

## Nomenclatura das propriedades de componente

Elas seguem `--{componente}-{grupo}-{nome}`:

| Padrão | Exemplos |
|---|---|
| `--{c}-color-*` | `--button-color-accent`, `--input-color-focus` |
| `--{c}-size-*` | `--button-size-height`, `--main-size-max-width` |
| `--{c}-space-*` | `--card-space-inset`, `--stack-space-gap` |
| `--{c}-font-*` | `--text-font-size`, `--label-font-weight` |
| `--{c}-border-*` | `--card-border-radius`, `--input-border-radius` |

O sufixo `_disabled` marca uma variante de estado:
`--input-color-background_disabled`.

Cada página de componente lista sua tabela completa. Os nomes são API estável —
trate-os como qualquer outra superfície pública.

## Temas

Um tema é um bloco de overrides de token. Coloque em `:root` para o produto
inteiro, ou num contêiner para uma região:

```css
:root {
  --color-primary: #0b7285;
  --color-primary-dark: #095c6b;
  --font-family-base: 'Inter', sans-serif;
  --border-radius-sm: 2px;
}
```

Essa última linha merece atenção: mudar `--border-radius-sm` deixa retos os
cantos de botões, inputs, imagens de capa e os cantos internos dos cards de uma
vez, porque todos têm ele como padrão. É a alavanca que os tokens dão — e a razão
para mexer neles de forma deliberada, não componente a componente.

### Uma marca é uma folha de tokens

Como todo elemento consome cor, tipografia e espaçamento exclusivamente por
`var(--nome-do-token)` — nunca um literal no seu `style.js` — **uma marca é um
conjunto de valores, não de componentes.**

Criar uma significa trocar a folha, não bifurcar nada. No repositório é
`packages/pixel/tokens/color.css` (e `fontFamily.css`, se a marca tem outra voz
tipográfica) substituído por um arquivo equivalente com os mesmos nomes de
variável e valores diferentes. Como consumidor, é uma folha carregada depois do
`kuba.css`:

```html
<link rel="stylesheet" href=".../kuba.css" />
<link rel="stylesheet" href="/brand/acme.css" />
```

Nenhum componente sabe que a marca mudou, porque nenhum componente jamais soube
qual marca estava renderizando.

### Vários temas por marca

O mesmo mecanismo cobre variações sazonais e aparências por tier. Uma campanha de
Black Friday, ou uma distinção prata/ouro, é um bloco de overrides de cor com
escopo num contêiner — sem Elements duplicados, sem inventar atributo `variant`:

```css
.tier-gold {
  --color-primary: #b8860b;
  --color-primary-dark: #8b6508;
}
```

Dê ao escopo a largura que a mudança merece: `:root` para o produto, uma seção
para uma campanha, um único elemento para uma exceção.

### Modo escuro

Todo token de cor já é declarado com `light-dark()` do CSS, carregando um valor
claro e um escuro:

```css
--color-master-dark: light-dark(#2c2c2c, #c9c9c9);
```

Qual deles se aplica é decidido pelo `color-scheme` da página, não pelo kuba.
Nada na folha publicada o declara, então uma página assume claro e os valores
escuros nunca aparecem. **Você liga o modo escuro declarando o esquema:**

```css
:root {
  color-scheme: light dark; /* seguir a preferência do sistema */
}
```

Essa única linha vira a paleta inteira — sem override de token, sem segunda folha
de estilo, sem classe para alternar. Force um modo com `color-scheme: dark` ou
`color-scheme: light`.

Dois componentes ainda assumem superfície clara, porque seus padrões nomeiam uma
cor fixa em vez de um passo da rampa: o trilho do `<kb-progress>` é
`--color-pure-white`, e o `<kb-card variant="outlined">` preenche com branco.
Sobrescreva esses dois por superfície até que seus padrões migrem para a rampa.

## O que você não consegue estilizar

- **Qualquer coisa selecionada de fora do shadow root.** `kb-button button { … }`
  não casa com nada. Se um componente não expõe uma propriedade para o que você
  quer mudar, isso é uma lacuna do componente, não uma técnica que falta a você —
  abra uma issue em vez de contornar.
- **`::part()`** — nenhum componente expõe parts hoje.
- **Conteúdo slotted por dentro.** Regras `::slotted()` vivem dentro do
  componente; conteúdo slotted você estiliza pela sua própria folha, já que ele
  está no seu DOM.

## Atributos de layout versus CSS

Algumas coisas que parecem estilo são atributos, não propriedades — `width`,
`height`, `align`, `justify`, `direction`, `spacing`. Elas são aplicadas
diretamente ao host, então definir a propriedade CSS equivalente de fora briga
com elas.

```html
<!-- Faça -->
<kb-stack direction="column" spacing="md" width="fill">

<!-- Não faça: o atributo vence, e a intenção passa a viver em dois lugares -->
<kb-stack style="flex-direction: column; gap: 32px">
```

A regra prática: se o componente documenta um atributo para aquilo, use o
atributo. Custom properties são para o que atributo não cobre — e para valores
que precisam responder a media query, o que um atributo não faz.

## Depois

- **[Componentes](/pt-br/components/)** — a seção Styling de cada página lista
  sua tabela completa de propriedades.
- **[Design tokens](/pt-br/foundations/tokens/)** — a escala completa.
