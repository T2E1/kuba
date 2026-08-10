# Aninhamento — Profundidade de Indentação

## Definição

Aninhamento mede a **profundidade máxima de indentação** — quantos níveis de blocos de controle estão aninhados.

## Tabela de Pontuação

| Profundidade máxima | Pontos ICP |
|---------------------|------------|
| 1 nível | 0 |
| 2 níveis | 1 |
| 3 níveis | 2 |
| 4+ níveis | 3 |

## Por Que Importa

Cada nível adiciona um **contexto que deve ser mantido na memória de trabalho**:
- Nível 1: "estamos dentro do if"
- Nível 2: "estamos dentro do if E dentro do for"
- Nível 3: "estamos dentro do if E dentro do for E dentro do if"
- Nível 4+: **Pyramid of Doom** — impossível rastrear mentalmente

## Exemplos

```javascript
// 1 nível → +0 ICP (Guard Clauses)
function createOrder(user, items) {
  if (!user) throw new UserRequiredError();     // Nível 1
  if (!items.length) throw new EmptyCartError(); // Nível 1
  return orderRepository.create({ user, items });
}

// 2 níveis → +1 ICP (Aceitável)
function processActiveItems(items) {
  const results = [];
  for (const item of items) {   // Nível 1
    if (item.isActive) {        // Nível 2
      results.push(transform(item));
    }
  }
  return results;
}

// 3 níveis → +2 ICP (Preocupante)
function getShippedItems(orders) {
  const result = [];
  for (const order of orders) {       // Nível 1
    if (order.isPaid) {               // Nível 2
      for (const item of order.items) { // Nível 3
        result.push(item);
      }
    }
  }
  return result;
}

// 4+ níveis → +3 ICP (Pyramid of Doom)
function syncData(userId) {
  if (userId) {                           // Nível 1
    const user = db.find(userId);
    if (user) {                           // Nível 2
      if (user.needsSync) {              // Nível 3
        const data = api.fetch(user.id);
        if (data) {                       // Nível 4
          for (const item of data) {      // Nível 5 — crítico!
            user.update(item);
          }
        }
      }
    }
  }
}
```

## Estratégias de Redução

### Guard Clauses (Inversão de Condição)

```javascript
// Antes: 4 níveis → +3 ICP
function syncData(userId) {
  if (userId) {
    const user = db.find(userId);
    if (user) {
      if (user.needsSync) {
        const data = api.fetch(user.id);
        if (data) {
          for (const item of data) {
            user.update(item);
          }
        }
      }
    }
  }
}

// Depois: 1–2 níveis → +0/1 ICP
function syncData(userId) {
  if (!userId) return;
  const user = db.find(userId);
  if (!user || !user.needsSync) return;
  const data = api.fetch(user.id);
  if (!data) return;

  for (const item of data) {  // Nível 1
    user.update(item);
  }
}
```

### Extração de Método

```javascript
// Antes: 3 níveis
function processOrders(orders) {
  const results = [];
  for (const order of orders) {
    if (order.isPaid) {
      for (const item of order.items) {
        results.push(ship(item));
      }
    }
  }
  return results;
}

// Depois: 1 nível em cada função
function processOrders(orders) {
  return orders
    .filter(order => order.isPaid)
    .flatMap(order => shipOrderItems(order));
}

function shipOrderItems(order) {
  return order.items.map(item => ship(item)); // Nível 1
}
```
