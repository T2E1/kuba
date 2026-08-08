# Card

Um card agrupa conteúdo relacionado numa superfície, e pode agir como uma única
unidade clicável — um clique em qualquer lugar dentro dele é absorvido e
redisparado como um único evento `clicked` carregando o `value` do card. É uma
primitiva de agrupamento, não um controle: sozinho, ele não tem anel de foco,
cursor nem papel.

```html preview
<kb-card>
  <kb-text size="xs" weight="bold">Akita</kb-text>
  <kb-text size="xxxs" color="master">Dócil, corajoso, digno</kb-text>
  <kb-button width="fill">Detalhes</kb-button>
</kb-card>
```

## Uso

```html
<kb-card direction="column" variant="filled" value="42">…</kb-card>
```

```js
document.querySelector('kb-card').addEventListener('clicked', (event) => {
  select(event.detail) // o `value` do card
})
```

## Quando usar

- **Agrupando conteúdo relacionado** — um título, um texto, uma ação — numa
  única superfície visualmente contida.
- **Fazendo uma região inteira emitir um único evento `clicked`**, como um
  ladrilho de resultado que se seleciona, ligado a outro elemento com `on` ou
  `<kb-on>`.

## Quando não usar

- **Uma ação única.** Use o `<kb-button>`: um controle de verdade associado a
  formulário, com as affordances certas e comportamento de teclado, e não um
  contêiner que por acaso é clicável.
- **Navegar para uma URL.** Coloque um `<a>` dentro, ou um `<kb-button>` ligado
  a um `<kb-redirect>`. O card não tem conceito de destino.

## Composição

- **Pode conter**: qualquer coisa — o shadow root é um único `<slot>`, e o
  contêiner flex do card o organiza. Um clique em qualquer descendente é
  absorvido e reemitido como o `clicked` do próprio card, então um filho
  interativo e o card competem pelo mesmo gesto. Mantenha um card como grupo
  passivo **ou** como unidade clicável única, nunca os dois.
- **Pode ser filho de**: qualquer coisa. Comumente dentro de uma lista de
  `<kb-render>` ou de uma região de layout.

```html preview
<kb-card direction="row">
  <kb-cover src="https://picsum.photos/id/237/120/120" landscape></kb-cover>
  <kb-stack direction="column" spacing="quarck">
    <kb-text size="xxs" weight="bold">Labrador</kb-text>
    <kb-text size="xxxs" color="master">Gentil, extrovertido, ágil</kb-text>
  </kb-stack>
</kb-card>
```

## Direção

`direction` controla como o conteúdo encaixado é empilhado, não como ele parece.

| Direção | Arranjo | Use para |
|---|---|---|
| `column` (padrão) | Pilha vertical | O caso comum — título sobre corpo sobre ações. |
| `row` | Linha horizontal | Conteúdo feito para ficar lado a lado, como uma miniatura ao lado de um rótulo. |

## Variantes

`variant` é lido diretamente pelo CSS — não existe propriedade `variant` em JS.
Ela expressa tratamento de superfície, não ênfase.

```html preview
<kb-card variant="filled">
  <kb-text size="xxs">Filled — o padrão, numa página comum</kb-text>
</kb-card>
<kb-card variant="outlined">
  <kb-text size="xxs">Outlined — para uso sobre uma superfície preenchida</kb-text>
</kb-card>
```

| Variante | Superfície | Use para |
|---|---|---|
| `filled` (padrão) | Fundo preenchido sutil | O card padrão sobre um fundo de página comum. |
| `outlined` | Fundo branco com borda fina | Um card apoiado **sobre** uma superfície preenchida, onde um card `filled` se misturaria. |

## Atributos

| Atributo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `direction` | `row` \| `column` | `column` | Direção flex do conteúdo encaixado. |
| `variant` | `filled` \| `outlined` | `filled` | Tratamento de superfície. Só CSS; sem propriedade JS. |
| `value` | `string` | `''` | Payload enviado como `detail` do evento `clicked`. |
| `width` | `auto` \| `fill` \| comprimento | `auto` | Como o card preenche o contêiner. |
| `height` | `auto` \| comprimento | `auto` | Altura do card. |
| `hidden` | `boolean` | `false` | Remove o card do layout e da árvore de acessibilidade. |
| `on` | string de arco | — | Ligação do Echo, `origem/evento:tipo/destino`. |

## Eventos

| Evento | Dispara quando | `detail` |
|---|---|---|
| `clicked` | qualquer clique dentro do card | o atributo `value` |

## Estilo

Toda decisão visual é uma custom property `--card-*` com padrão em um token
global. Elas herdam através da fronteira do shadow — defina no elemento ou em
qualquer ancestral, nunca alcance dentro do shadow DOM.

| Custom property | Padrão | Controla |
|---|---|---|
| `--card-color-background` | `var(--color-master-lighter)` | Fundo do card `filled`. |
| `--card-color-background-outlined` | `var(--color-pure-white)` | Fundo da variante `outlined`. |
| `--card-color-border` | `var(--color-master-light)` | Cor da borda do `outlined`. |
| `--card-border-width` | `var(--border-width-hairline)` | Espessura da borda do `outlined`. |
| `--card-border-radius` | `var(--border-radius-md)` | Raio dos cantos, nas duas variantes. |
| `--card-space-gap` | `var(--spacing_inset-xs)` | Espaçamento entre filhos encaixados. |
| `--card-space-inset` | `var(--spacing_inset-xs)` | Padding interno. |

```html preview
<div style="--card-border-radius: 8px; --card-space-inset: 8px;">
  <kb-card>
    <kb-text size="xxs">Mais reto e mais justo, escopado a uma área</kb-text>
  </kb-card>
</div>
```

## Estados e acessibilidade

- `hidden` remove o card do layout e da interação. Prefira isso a não renderizar
  o elemento quando a presença ou ausência deve continuar rastreável.
- **Um card clicável é invisível para a tecnologia assistiva por padrão.** O
  elemento não adiciona `role`, `tabindex` nem tratador de teclado, então o
  `clicked` é só de mouse. Se o card inteiro precisa ser acionável, adicione
  `role="button"` e `tabindex="0"` e ligue a ativação por teclado — ou melhor,
  aninhe um `<kb-button>` de verdade e deixe o card ser um grupo passivo.

## Certo e errado

| Faça | Não faça |
|---|---|
| Manter um card como grupo passivo ou como unidade clicável única | Aninhar um filho interativo *e* contar com o `clicked` do card — os dois brigam pelo mesmo clique |
| Usar `outlined` para um card sobre uma superfície preenchida | Usar `outlined` num fundo comum, onde o `filled` já se lê bem |
| Aninhar um `<kb-button>` ou `<a>` de verdade para um card acionável | Contar com o `clicked` do card como única affordance para quem usa teclado |
| Sobrescrever os tokens `--card-*` para re-skin | Alcançar dentro do shadow DOM para mudar fundo ou padding |
