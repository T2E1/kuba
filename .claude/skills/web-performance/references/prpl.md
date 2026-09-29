# PRPL

**Categoria:** Carregamento
**Intenção:** Um conjunto de quatro decisões de entrega que se reforçam — enviar o
mínimo da rota pedida, declarar cedo o que ela precisa, renderizar o quanto antes, e
buscar o resto na ociosidade.

---

## Quando Usar

- Como grade de leitura ao desenhar a estratégia de entrega de uma aplicação inteira. Não
  é um mecanismo: é o arranjo dos outros quatro.
- Quando as decisões de carregamento já foram tomadas isoladamente e não se sabe se
  cooperam.

## Quando NÃO Usar

- Como receita a aplicar de uma vez. Cada letra é um pattern com o próprio critério e o
  próprio custo; adotar as quatro sem medir é quatro otimizações prematuras
  ([rule 012](../../../rules/012_otimizacao-prematura.md)).
- Em aplicação pequena, onde a carga inicial já é irrelevante.

## Estrutura Mínima

| Letra | Decisão | Pattern |
|---|---|---|
| **P**ush | Entregar cedo o que a rota precisa | [preload.md](preload.md) |
| **R**ender | Renderizar a rota inicial o quanto antes | [server-side-rendering.md](../../react/references/server-side-rendering.md), [streaming-ssr.md](../../react/references/streaming-ssr.md) |
| **P**re-cache | Buscar as demais rotas na ociosidade | [prefetch.md](prefetch.md) |
| **L**azy-load | Carregar o restante sob demanda | [route-based-splitting.md](route-based-splitting.md), [dynamic-import.md](dynamic-import.md) |

O valor do conjunto é a coerência: declarar cedo o que se dividiu, e adiar só o que não
é da rota atual. Aplicar uma letra contra a outra — dividir e não declarar — produz a
cascata que o conjunto existe para evitar.

## O que custa

- Quatro mecanismos a manter e a manter coerentes entre si.
- A coerência é frágil: uma mudança de rota que não atualiza as declarações desfaz o
  arranjo silenciosamente.

## Relacionado a

- [preload.md](preload.md): depende
- [prefetch.md](prefetch.md): depende
- [route-based-splitting.md](route-based-splitting.md): depende
- [loading-sequence.md](loading-sequence.md): complementa — a ordem concreta que o conjunto pressupõe
- [rule 012 — Proibição de Otimização Prematura](../../../rules/012_otimizacao-prematura.md): reforça

---

**Fonte:** patterns.dev — /vanilla/prpl
