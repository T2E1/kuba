# Card

Um card agrupa conteúdo relacionado num contêiner flex, estilizado por tokens
`--card-*`. É uma primitiva de layout, não um controle — não tem ação própria.
Qualquer clique, navegação ou interação por teclado pertence inteiramente ao
conteúdo encaixado, como um `<kb-button>` ou `<a>` de verdade, nunca ao card.

```html preview
<kb-card>
  <kb-text size="xs" weight="bold">Akita</kb-text>
  <kb-text size="xxxs" color="master">Dócil, corajoso, digno</kb-text>
  <kb-button width="fill">Detalhes</kb-button>
</kb-card>
```

## Uso

```html
<kb-card direction="row">
  <kb-text>Conteúdo</kb-text>
</kb-card>
```

## Quando usar

- **Agrupando conteúdo relacionado** — um título, um texto, uma ação — numa
  única superfície visualmente contida.
- **Organizando uma linha ou coluna de conteúdo** com espaçamento e padding
  consistentes, guiados por tokens de design em vez de CSS solto.

## Quando não usar

- **Esperando um evento `clicked` do próprio card.** O card não despacha nada
  — coloque um `<kb-button>` ou `<a>` de verdade no slot e escute nele.
- **Esperando que o card seja focável ou anunciado por leitor de tela.** O
  card não adiciona papel, `tabindex` nem nome acessível — é transparente
  para a árvore de acessibilidade. Só o conteúdo encaixado é alcançável por
  teclado ou tecnologia assistiva.

## Composição

- **Pode conter**: qualquer coisa — o shadow root é um único `<slot>`, e o
  contêiner flex do card o organiza. Nada é interceptado: um filho interativo
  mantém seu próprio clique, foco e comportamento de teclado intactos.
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

Um valor não reconhecido é ignorado — a propriedade mantém o último
`direction` válido que teve (ou o padrão, se nenhum foi definido ainda).

## Atributos

| Atributo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `direction` | `row` \| `column` | `column` | Direção flex do conteúdo encaixado. Um valor não reconhecido é ignorado — a propriedade mantém o último direction válido que teve. |
| `width` | `auto` \| `fill` \| `hug` \| comprimento | `auto` | Como o card preenche o contêiner. |
| `height` | `auto` \| `fill` \| `hug` \| comprimento | `auto` | Altura do card. |
| `hidden` | `boolean` | `false` | Remove o card do layout e da árvore de acessibilidade. |
| `on` | string de arco | — | Ligação do Echo, `origem/evento:tipo/destino`. |

## Eventos

Nenhum. O card não despacha nada próprio — só o conteúdo encaixado despacha.

## Estilo

Toda decisão visual é uma custom property `--card-*` com padrão em um token
global. Elas herdam através da fronteira do shadow — defina no elemento ou em
qualquer ancestral, nunca alcance dentro do shadow DOM.

| Custom property | Padrão | Controla |
|---|---|---|
| `--card-color-background` | `var(--color-master-lighter)` | Fundo do card. |
| `--card-border-radius` | `var(--border-radius-md)` | Raio dos cantos. |
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

- `hidden` remove o card do layout e da interação. Prefira isso a não
  renderizar o elemento quando a presença ou ausência deve continuar
  rastreável.
- O card não adiciona `role`, `tabindex` nem nome acessível — nunca recebe
  foco, e um leitor de tela vê exatamente o conteúdo encaixado, como se o
  card não existisse.

## Certo e errado

| Faça | Não faça |
|---|---|
| Aninhar um `<kb-button>` ou `<a>` de verdade para qualquer coisa acionável | Esperar que o card emita `clicked` ou aja por conta própria |
| Contar com o próprio foco e comportamento de teclado do controle encaixado | Adicionar `tabindex` ou papel ao card para fazê-lo "parecer" interativo |
| Sobrescrever os tokens `--card-*` para re-skin | Alcançar dentro do shadow DOM para mudar fundo ou padding |
