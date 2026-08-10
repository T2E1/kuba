# Lava Flow (Dead Code / Zombie Code)

**Severidade:** 🟠 Alta
**Regra Associada:** Regra 056

## O Que É

Código que não é mais utilizado mas permanece no sistema porque ninguém tem certeza se pode ser removido com segurança. Como lava que solidifica e endurece, este código se torna um obstáculo permanente à manutenção. Código abandonado, comentado ou nunca chamado.

## Sintomas

- Funções, classes ou módulos nunca chamados/executados
- Código comentado com marcadores (`// versão antiga`, `// deprecated`, `// TODO remover`)
- Imports de módulos/pacotes que nunca são referenciados
- Branches de `if` ou `switch` que nunca são executados (cobertura de teste = 0%)
- Variáveis declaradas e nunca lidas
- Arquivos inteiros que ninguém sabe para que servem

## ❌ Exemplo (violação)

```javascript
// ❌ Funções que ninguém chama, código comentado acumulado
function calculateOldDiscount(price) { // deprecated - use calculateDiscount
  return price * 0.1;
}

// function formatUserV1(user) {
//   return user.name + ' (' + user.email + ')';
// }

function getUser(id) {
  // const cache = loadCache(); // removido em 2023 mas mantido por segurança
  return db.find(id);
}
```

## ✅ Refatoração

```javascript
// ✅ Só existe o que é usado no código
function getUser(id) {
  return db.find(id);
}

// Código morto eliminado — o controle de versão guarda o histórico
```

## Codetag Sugerido

```typescript
// FIXME: Lava Flow — calculateOldDiscount nunca chamado, código comentado acumulado
// TODO: Remover código morto; o git guarda o histórico
```
