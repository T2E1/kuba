# Provider Pattern

## Problema

Evitar *prop drilling* — passar um valor por múltiplas camadas de componentes que não o
usam, apenas para repassá-lo adiante — tornando refatoração difícil e o fluxo de dados
opaco.

## Como funciona

Em frameworks com árvore de componentes (React `Context`, ou um Provedor customizado), um
nó da árvore disponibiliza um valor que qualquer descendente pode consumir sem que os
nós intermediários o conheçam.

Em Web Components puros — o paradigma deste repositório, sem framework de árvore — o
equivalente é o *dependency injection* via atributo/propriedade explícita no elemento
mais próximo, ou o event bus declarativo (skill `dataflow`) quando o consumidor está
distante na árvore.

## Quando não aplicar

- Quando o valor só é usado por um ou dois níveis de distância: passar via atributo ou
  propriedade é mais direto que um provider genérico.
- Todo consumidor de um provider re-renderiza a cada mudança do valor provido — para
  muitos consumidores independentes, providers segmentados por escopo evitam
  atualizações desnecessárias.

## Relação com as rules deste repositório

- **009 (Tell, Don't Ask)** e **057 (Feature Envy)**: um provider que expõe estado bruto
  para o consumidor decidir o que fazer é o mesmo problema que essas rules cobrem — o
  provider deveria expor comportamento, não só dado.
- **dataflow** (skill): é o mecanismo real deste repositório para comunicação entre
  componentes distantes, sem herdar o modelo de Context de frameworks com árvore.
