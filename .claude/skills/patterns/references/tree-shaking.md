# Tree Shaking

## Problema

Eliminar código morto do bundle final, reduzindo tempo de download, parsing e execução.

## Como funciona

O bundler trata o código como grafo de dependências a partir do ponto de entrada,
mantendo só o que é alcançável. Funciona exclusivamente com ES Modules
(`import`/`export`) — módulos CommonJS ou globais não são analisáveis estaticamente.

```javascript
// utilities.js
export function read(props) { return props.book; }
export function nap(props) { return props.winks; } // nunca importado — eliminado

// index.js
import { read } from "@util/utilities";
```

## Quando não aplicar

- Módulo com efeito colateral na importação (polyfill, registro global, injeção de CSS)
  não pode ser eliminado mesmo sem uso aparente — o bundler preserva por segurança.

## Relação com as rules deste repositório

- **056 (Código Zombie)**: tree shaking automatiza a detecção do sintoma desta rule em
  nível de bundle, mas não substitui a remoção manual do export não usado no
  código-fonte — o export continua no repositório mesmo que saia do bundle.
- **031 (Imports Relativos)**: só funciona com `import`/`export` ES — a base que este
  repositório já usa via path alias.
