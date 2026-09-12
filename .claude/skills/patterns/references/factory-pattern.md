# Factory Pattern

## Problema

Abstrair a criação de um objeto para que o chamador não precise de `new`, de conhecer a
classe concreta, nem de hierarquia — sobretudo quando a configuração varia por ambiente,
por tenant ou por serviço.

## Como funciona

Uma função encapsula o setup e devolve uma interface (objeto com métodos) em vez de
expor a classe. Closures capturam a configuração reutilizada em cada chamada.

```javascript
const createApiClient = ({ baseUrl, auth }) => {
  const request = async (method, path, body) => {
    const res = await fetch(`${baseUrl}${path}`, { method, body });
    return res.json();
  };
  return { get: (p) => request("GET", p), post: (p, b) => request("POST", p, b) };
};
```

## Quando não aplicar

- Quando existe apenas uma implementação concreta e nenhuma variação por ambiente — a
  fábrica só adiciona indireção sem ganho (rule 064).

## Relação com as rules deste repositório

- **011 (OCP)**: a Factory é a exceção explícita da rule — é o lugar correto para
  centralizar o `switch`/`if` por tipo que o resto do código não deveria ter.
- **014 (DIP)**: é o mecanismo padrão para módulos de alto nível obterem uma instância
  sem `new ClasseConcreta()` espalhado pelo código.
- **037 (Argumentos Sinalizadores)**: a Factory que recebe um objeto de opções em vez de
  vários parâmetros posicionais evita, de quebra, a flag argument.
