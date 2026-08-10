# Callback Hell

**Severidade:** 🟠 Alta
**Regra Associada:** Regra 063

## O Que É

Aninhamento excessivo de callbacks assíncronos que cria uma estrutura triangular ("pirâmide") no código. Cada operação assíncrona é passada como callback da anterior, tornando o fluxo impossível de acompanhar. Versão assíncrona do Pyramid of Doom.

## Sintomas

- Mais de 3 níveis de aninhamento de callbacks
- Indentação crescendo a cada operação assíncrona
- Tratamento de erros duplicado em cada nível de aninhamento
- Padrão `}) })` no final do arquivo — marcadores de callback hell
- Variáveis capturadas em closures em múltiplos níveis
- Impossível ler o fluxo de cima para baixo

## ❌ Exemplo (violação)

```javascript
// ❌ Pirâmide do destino — cada nível é uma operação assíncrona
getUser(userId, (err, user) => {
  if (err) return handleError(err);
  getOrders(user.id, (err, orders) => {
    if (err) return handleError(err);
    getProducts(orders[0].id, (err, products) => {
      if (err) return handleError(err);
      calculateTotal(products, (err, total) => {
        if (err) return handleError(err);
        sendInvoice(user, total, (err) => {
          if (err) return handleError(err);
          console.log('done');
        });
      });
    });
  });
});
```

## ✅ Refatoração

```javascript
// ✅ async/await — fluxo sequencial e legível
async function processInvoice(userId) {
  try {
    const user = await getUser(userId);
    const orders = await getOrders(user.id);
    const products = await getProducts(orders[0].id);
    const total = await calculateTotal(products);
    await sendInvoice(user, total);
  } catch (err) {
    handleError(err); // tratamento centralizado
  }
}
```

## Codetag Sugerido

```typescript
// FIXME: Callback Hell — 5 níveis de aninhamento de callbacks
// TODO: Migrar para async/await com try/catch
```
