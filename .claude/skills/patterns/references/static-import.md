# Static Import

## Problema

Entender o efeito de `import` estático sobre o bundle inicial: por padrão, tudo que é
estaticamente importado entra no bundle de entrada, mesmo o que só é usado em um caminho
raro de execução.

## Como funciona

`import` é resolvido e executado assim que o motor atinge a linha de importação, e o
bundler inclui o módulo no grafo do bundle inicial.

```javascript
import { UserInfo } from "./components/UserInfo.js";
import { ChatList } from "./components/ChatList.js";
```

Ambos entram no `main.bundle.js`, ainda que `ChatList` só seja necessário depois de uma
interação do usuário.

## Quando não aplicar

- Para tudo que não é necessário na renderização inicial: nesse caso o pattern correto é
  o oposto — `dynamic-import` (ver [dynamic-import.md](dynamic-import.md)).

## Relação com as rules deste repositório

- **031 (Proibição de Imports Relativos)**: static import via path alias é a forma
  padrão de import deste repositório — a pergunta de performance é apenas *quando*
  importar, não *como*.
- Ver [dynamic-import.md](dynamic-import.md), [bundle-splitting.md](bundle-splitting.md)
  e [tree-shaking.md](tree-shaking.md) para as técnicas que atenuam o custo do import
  estático quando ele não é a escolha certa.
