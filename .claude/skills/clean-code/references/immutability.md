# Imutabilidade e Estado (Regras 029, 036, 038)

## Regras

- **029**: Value Objects e Entidades imutáveis (`Object.freeze()`)
- **036**: Funções puras (sem efeitos colaterais em Queries)
- **038**: Separação Comando-Consulta (CQS)

## Checklist

- [ ] Value Objects congelados com `Object.freeze()`
- [ ] Queries não modificam estado
- [ ] Objetos mutáveis clonados antes de modificar
- [ ] Comandos com nomes verbais (`update`, `save`, `delete`)
- [ ] Métodos são Query OU Command (nunca híbridos)

## Exemplos

```typescript
// ❌ Violações
// Mutabilidade (029)
function createProduct(data) {
  return { id: data.id, price: data.price }; // mutável!
}
const product = createProduct({ id: 1, price: 50 });
product.price = 0; // mutação acidental

// Efeito colateral oculto (036)
function getActiveUsers(users) {
  return users.filter(u => {
    if (!u.active) u.lastChecked = Date.now(); // efeito colateral!
    return u.active;
  });
}

// CQS violado (038)
function getAndActivateUser(id) { // híbrido Query+Command
  const user = db.find(id);
  user.active = true;
  db.save(user);
  return user;
}

// ✅ Conformidade
// Imutabilidade
function createProduct(data: ProductData) {
  return Object.freeze({ id: data.id, price: data.price });
}

interface Product {
  readonly id: number;
  readonly price: number;
}

// Query pura
function getActiveUsers(users: User[]): User[] {
  return users.filter(u => u.active);
}

// Comando explícito
function markInactiveUsers(users: User[]) {
  users.filter(u => !u.active).forEach(u => {
    u.lastChecked = Date.now();
  });
}

// CQS: Query e Command separados
function findUser(id: string): User { // Query
  return db.find(id);
}

function activateUser(id: string): void { // Command
  const user = db.find(id);
  user.active = true;
  db.save(user);
}
```

## Relação com ICP

- Imutabilidade elimina responsabilidades de mutação
- Funções puras têm CC_base menor (sem ramificações de estado)
- CQS separa responsabilidades (Query ≠ Command)
