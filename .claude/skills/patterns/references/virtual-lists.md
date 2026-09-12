# List Virtualization

## Problema

Renderizar milhares de itens de uma lista de uma vez custa caro; a maioria nunca está
visível ao mesmo tempo na tela.

## Como funciona

Mantém uma "janela" que se move durante o scroll: um container com posicionamento
relativo, um elemento de scroll do tamanho total da lista, e apenas os itens visíveis
posicionados absolutamente dentro dessa janela.

## Quando não aplicar

- Listas curtas (dezenas de itens): a complexidade de gerenciar a janela não se paga.
- Quando cada item tem altura muito variável — a matemática da janela fica mais difícil
  de acertar sem medição real do layout.

## Relação com as rules deste repositório

- **069 (Otimização Prematura)**: virtualizar uma lista de 50 itens sem medição é este
  antipadrão aplicado a rendering.
- **004 (Coleções de Primeira Classe)**: a lógica de janela (índice inicial, altura de
  item, offset) é candidata natural a uma classe dedicada em vez de estado solto no
  componente.
