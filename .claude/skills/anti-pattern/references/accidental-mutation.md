# Accidental Mutation

**Severidade:** 🟠 Alta
**Regra Associada:** Regra 052

## O Que É

Uma função recebe um objeto ou array como parâmetro e o modifica diretamente, sem que o chamador espere ou queira essa alteração. O efeito colateral é invisível na assinatura da função — o nome sugere uma operação de leitura ou transformação, mas o estado original é silenciosamente alterado.

## Sintomas

- Função nomeada como `getX`, `filterX` ou `calculateX` que também modifica o parâmetro
- Bugs que aparecem apenas após chamar uma função específica
- Arrays que mudam de ordem inesperadamente (`Array.sort` opera in-place)
- Objetos com propriedades alteradas sem que o módulo chamador o faça explicitamente
- Testes dependentes da ordem de execução

## ❌ Exemplo (violação)

```javascript
// ❌ .sort() opera in-place — modifica o array original
function getTopUsers(users) {
  return users
    .sort((a, b) => b.score - a.score) // MUTA users!
    .slice(0, 5);
}

const users = [{ name: 'Alice', score: 80 }, { name: 'Bob', score: 95 }];
const top = getTopUsers(users);
console.log(users); // [Bob, Alice] — ordem original destruída
```

## ✅ Refatoração

```javascript
// ✅ Cópia rasa com spread — preserva o array original
function getTopUsers(users) {
  return [...users]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

// ✅ Para objetos: retornar novo objeto
function deactivate(user) {
  return { ...user, active: false };
}

// ✅ Para clone profundo: structuredClone (Node 17+)
const copy = structuredClone(order);
```

## Codetag Sugerido

```typescript
// FIXME: Accidental Mutation — getTopUsers modifica o array original via .sort()
// TODO: Clonar users antes de ordenar: [...users].sort(...)
```
