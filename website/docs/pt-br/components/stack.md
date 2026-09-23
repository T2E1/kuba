# Stack

Um contêiner flex com espaçamento baseado em token: ele organiza o que for
encaixado nele em uma linha ou uma coluna, alinhado e espaçado por atributo. Uma
primitiva de layout sem superfície própria — sem fundo, sem padding, sem borda —
então ela nunca parece nada por si só.

```html preview
<kb-stack direction="row" spacing="xs">
  <kb-button>Salvar</kb-button>
  <kb-button variant="naked">Cancelar</kb-button>
</kb-stack>
```

## Uso

```html
<kb-stack direction="column" align="stretch" spacing="nano">…</kb-stack>
```

## Quando usar

- **Espaçando um grupo de irmãos de forma consistente** — uma linha de botões,
  uma coluna de campos, uma barra de ferramentas — sem uma regra flex pontual
  por grupo.
- **Ancorando conteúdo em pontas opostas** com `justify="space-between"`.
- **Agrupando conteúdo dentro do slot de outro componente**, onde o pai te dá uma
  região e você precisa de vários elementos organizados nela.

## Quando não usar

- **Uma barra de cabeçalho ou rodapé de página** — `<kb-header>` e `<kb-footer>`
  são as versões com landmark da mesma ideia de linha centralizada, com altura
  fixa e largura máxima. Um stack não tem nenhum dos dois e não expõe landmark.
- **Uma superfície visível** — um agrupamento que precisa de fundo, padding ou
  borda é um `<kb-card>`.
- **Uma grade bidimensional** — esta é uma única linha flex; os filhos nunca
  quebram. Use CSS Grid quando linhas *e* colunas importam.
- **Espaçar texto dentro de um parágrafo** — o `<kb-text>` carrega o próprio
  ritmo.

## Composição

- **Pode conter**: qualquer coisa. O shadow root é um único `<slot>` sem nome,
  então todo filho renderiza na ordem do código como um item flex. Um ou mais
  `<kb-on>` também funcionam como filhos, para arcos extras além do atributo
  único `on` — eles se ligam diretamente ao stack e não renderizam nada,
  então também não contam como itens flex.
- **Pode ser filho de**: qualquer coisa, incluindo outro `kb-stack`. Aninhar uma
  coluna de linhas é a forma normal de construir um layout bidimensional a
  partir desta primitiva, já que um único stack nunca quebra.

```html preview
<kb-stack direction="column" spacing="nano" align="stretch">
  <kb-stack direction="row" justify="space-between">
    <kb-text size="xxs" weight="bold">Total</kb-text>
    <kb-text size="xxs">R$ 240,00</kb-text>
  </kb-stack>
  <kb-button width="fill">Finalizar compra</kb-button>
</kb-stack>
```

Como o host é o contêiner flex, os filhos esticam ou encolhem pelas regras
usuais do flex — um filho com `flex: 1` preenche o espaço que sobra.

## Direção, alinhamento e espaçamento

`direction`, `align`, `justify` e `spacing` aceitam todos um conjunto fechado
de valores. Um valor desconhecido é ignorado e a *propriedade* mantém seu
último valor válido — nunca chega à folha de estilos sem verificação. O
atributo no DOM continua mostrando o que foi escrito; leia a propriedade, não
`getAttribute()`, para ver o que de fato é aplicado.

| Atributo | Age ao longo de | Valores aceitos |
|---|---|---|
| `justify` | a direção do stack (eixo principal) | `normal`, `start`, `end`, `center`, `stretch`, `left`, `right`, `space-between`, `space-around`, `space-evenly`, `flex-start`, `flex-end` |
| `align` | transversal a ela (eixo cruzado) | `normal`, `start`, `end`, `center`, `stretch`, `baseline`, `flex-start`, `flex-end`, `self-start`, `self-end` |

`start`/`end` são a grafia preferida para os dois atributos; `flex-start`/
`flex-end` são aceitos como aliases legados.

Numa `row`, `align="center"` centraliza verticalmente itens de alturas
diferentes; numa `column`, `align="stretch"` faz os filhos preencherem a
largura. Trocar a `direction` inverte qual atributo faz o quê — confira os dois
quando um stack muda de orientação.

```html preview
<kb-stack direction="row" justify="space-between" align="center" style="width: 100%">
  <kb-text size="xxs">Fixado à esquerda</kb-text>
  <kb-button variant="link">Fixado à direita</kb-button>
</kb-stack>
```

`spacing` seleciona um degrau da escala de inset, o que mantém o ritmo entre
grupos previsível ao longo de uma página:

| `spacing` | Espaçamento | Use para |
|---|---|---|
| `quarck` / `nano` | 4 / 8px | Elementos que se leem como uma unidade — ícone e rótulo, campo e helper. |
| `xs` | 16px | O padrão: irmãos dentro de um grupo. |
| `sm` / `md` | 24 / 32px | Separando grupos dentro de uma seção. |
| `lg` / `huge` / `giant` | 40px+ | Separação em nível de seção, onde o `<kb-inset>` pode servir melhor. |

`spacing` aceita apenas esses oito degraus da escala de inset. Um valor
desconhecido é ignorado e o espaçamento mantém seu último degrau válido.

## Atributos

| Atributo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `direction` | `row` \| `column` | `row` | Direção flex aplicada ao host. |
| `align` | conjunto fechado, ver [acima](#direção-alinhamento-e-espaçamento) | `start` | Alinhamento no eixo cruzado. |
| `justify` | conjunto fechado, ver [acima](#direção-alinhamento-e-espaçamento) | `start` | Alinhamento no eixo principal. |
| `spacing` | conjunto fechado, ver [acima](#direção-alinhamento-e-espaçamento) | `xs` | Espaçamento, resolvido contra `--spacing_inset-{valor}`. |
| `width` | `auto` \| `fill` \| comprimento | `auto` | Largura do host. |
| `height` | `auto` \| comprimento | `auto` | Altura do host. |
| `hidden` | `boolean` | `false` | Remove o stack e seus filhos do layout e da árvore de acessibilidade. |
| `on` | string de arco | — | Ligação do Echo, `origem/evento:tipo/destino`. |

Este elemento não dispara eventos.

## Estilo

O espaçamento é a única decisão também exposta como custom property — útil
quando ele precisa responder a uma media query, coisa que um atributo não
consegue fazer.

| Custom property | Padrão | Controla |
|---|---|---|
| `--stack-space-gap` | `var(--spacing_inset-{spacing})` | Espaçamento entre filhos, sobrescrevendo o atributo `spacing`. |

```css
@media (width < 600px) {
  kb-stack.toolbar { --stack-space-gap: var(--spacing_inset-nano); }
}
```

Todo o resto (`align`, `direction`, `justify`, `height`, `width`) é um atributo
aplicado diretamente ao host — defina esses em vez de sobrescrever as mesmas
propriedades no CSS.

## Estados e acessibilidade

- `hidden` adiciona o custom state `hidden` e `display: none`, removendo o stack
  e seus filhos do layout e da árvore de acessibilidade.
- **O host é declarado presentacional** (`role="none"`), então a pilha em si
  não acrescenta nó nenhum à árvore de acessibilidade, e não tem nome
  acessível — não há atributo `alt`. A semântica de grupo tem que vir do que
  você coloca dentro dele — um `<nav>`, uma `<ul>`, um fieldset.
- A ordem visual segue a ordem do código, então a ordem de teclado combina com a
  da tela. Não a inverta com `flex-direction: row-reverse` de fora.

## Certo e errado

| Faça | Não faça |
|---|---|
| Escolher um degrau de `spacing` da escala | Definir um espaçamento pontual em pixels ao lado de uma escala que já serve |
| Aninhar stacks para construir um layout bidimensional | Esperar que os filhos quebrem — um stack é uma única linha flex |
| Recorrer ao `<kb-card>` quando o grupo precisa de superfície | Adicionar fundo e padding a um stack para simular uma |
| Manter a ordem do código igual à ordem de leitura | Reordenar visualmente com `row-reverse` ou `order` |
