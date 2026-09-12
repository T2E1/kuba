# Flyweight Pattern

## Problema

Reduzir consumo de memória e pressão no garbage collector quando muitos objetos
similares são criados, compartilhando o que é idêntico entre eles.

## Como funciona

Separa o objeto em **estado intrínseco** (idêntico entre instâncias, armazenado uma
única vez) e **estado extrínseco** (variável por consumidor, passado externamente). Uma
fábrica garante a invariante "uma chave → um objeto".

```javascript
const authorPool = new Map();

function getAuthor(user) {
  let flyweight = authorPool.get(user.id);
  if (flyweight) return flyweight;
  flyweight = Object.freeze({ id: user.id, name: user.name });
  authorPool.set(user.id, flyweight);
  return flyweight;
}
```

## Quando não aplicar

- Sem medição prévia de que a alocação repetida é de fato um gargalo — aplicar o
  Flyweight sem profiling é otimização prematura (rule 069).
- Quando o pool não tem estratégia de evicção: memória economizada por objeto vira
  memória presa para sempre no `Map`.

## Relação com as rules deste repositório

- **029 (Imutabilidade)**: `Object.freeze` no valor compartilhado é o que torna seguro
  reusar a mesma referência entre múltiplos consumidores.
- **069 (Otimização Prematura)**: este é o pattern mais fácil de aplicar sem medir —
  a tabela de prós/contras não substitui o profiling.
