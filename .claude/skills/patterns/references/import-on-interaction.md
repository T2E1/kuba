# Import On Interaction

## Problema

Recursos não críticos carregados de largada bloqueiam a thread principal e atrasam
métricas de interatividade — o pattern adia o carregamento até o usuário de fato
interagir com o gatilho.

## Como funciona

Um elemento simples (o "facade") fica pronto de imediato; o módulo pesado só é
importado no evento que o exige.

```javascript
const btn = document.querySelector("button");
btn.addEventListener("click", async (e) => {
  e.preventDefault();
  const { sortBy } = await import("./sort.js");
  sortBy(items);
});
```

## Quando não aplicar

- Quando a interação exige o recurso instantaneamente e qualquer latência de rede é
  inaceitável — nesse caso o custo deve ser pago antes, não no clique.

## Relação com as rules deste repositório

- Irmão de [import-on-visibility.md](import-on-visibility.md); ambos são gatilhos
  específicos de [dynamic-import.md](dynamic-import.md).
