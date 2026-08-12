# LLD — `kb-rating`

Percorre os 5 passos antes de criar `packages/kb-rating/`.

## Passo 1 — Requisitos

- Consumidor: formulário de avaliação de produto.
- Interativo (usuário seleciona), não somente leitura.
- Precisão de estrela inteira apenas — meia estrela fica fora do MVP (registrado como
  codetag `OPTIMIZE` para revisão futura, não implementado agora).
- Precisa participar de `<form>` — form-associated via `ElementInternals`.
- Precisa de estado `disabled`. Não precisa de `loading`.
- Escala fixa em 5, não configurável no MVP.

## Passo 2 — Contrato público

- Attribute `value` (number, refletido) — a nota selecionada.
- Attribute `disabled` (boolean, refletido) — desabilita interação.
- Attribute `name` (string) — nome do campo no `FormData`.
- Property `max` (number, default 5) — não refletida, uso raro o suficiente para não
  poluir o DOM.
- Event `rating-changed` — `detail: { value: number }`, disparado só por interação do
  usuário, nunca por atribuição programática de `value`.
- Sem slots — o conteúdo é inteiramente gerado internamente (ícones de estrela).
- Part `star` — permite ao consumidor re-estilizar cada estrela via `::part(star)`.

## Passo 3 — Composição

- Mixins: `Echo` (obrigatório), mixin de valor para o contrato form-associated.
- Sem sub-elemento próprio. As estrelas são geradas no Shadow DOM interno via `paint`,
  não como custom elements separados — não há razão de mudança independente para cada
  estrela que justifique uma tag própria.

## Passo 4 — Estado

- `#value` — campo privado, fonte de verdade quando não controlado.
- `value` é **controlado**: se o consumidor seta o attribute, o componente reflete e para
  de gerenciar sozinho a partir dali; se nunca é setado, o componente inicializa em `0` e
  passa a governar internamente, emitindo `rating-changed` a cada seleção.
- `#hoveredIndex` — estado derivado de interação, não refletido em attribute, não
  disparado como evento; existe só para o cálculo de qual estrela pintar durante o hover.
- `disabled` vira estado de `ElementInternals` (`:state(disabled)`), acessível ao CSS.

## Passo 5 — Edge cases

- `value` não definido ou `0`: nenhuma estrela preenchida.
- `value` acima de `max`: clampa em `max`, não lança erro.
- Teclado: setas esquerda/direita decrementam/incrementam em 1; `Home` vai a `0`;
  `End` vai a `max`.
- Leitor de tela: `role="radiogroup"` no host, cada estrela é um `role="radio"`
  individual anunciando "estrela N de 5, selecionada" ou "não selecionada".
- `disabled`: estrelas não respondem a clique nem a teclado; foco pula o componente.
