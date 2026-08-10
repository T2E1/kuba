# Tratamento de Erros (Regras 027, 028)

## Regras

- **027**: Usar exceções de domínio (não `return null`)
- **028**: Tratar todas as Promises com `await` ou `.catch()`

## Checklist

- [ ] Métodos de negócio retornam tipos válidos ou lançam exceção
- [ ] Proibido `return null` ou `return undefined` na lógica de negócio
- [ ] Exceções customizadas para o domínio (`UserNotFoundError`)
- [ ] Todas as Promises seguidas por `await` ou `.catch()`
- [ ] Sem `catch` vazio ou que apenas loga

## Exemplos

```typescript
// ❌ Violações
function findUser(id) {
  const user = db.find(id);
  return user || null; // cliente deve verificar null
}

async function handleRequest(req) {
  saveToDatabase(req.body); // Promise flutuante!
}

try { await operation(); } catch (e) {} // catch vazio

// ✅ Conformidade
class UserNotFoundError extends BaseDomainError {
  constructor(id: string) {
    super(`Usuário ${id} não encontrado`);
  }
}

function findUser(id: string): User {
  const user = db.find(id);
  if (!user) throw new UserNotFoundError(id);
  return user;
}

async function handleRequest(req: Request) {
  await saveToDatabase(req.body); // await explícito
}

// ou com .catch()
promise.catch(err => logger.error('Falhou', err));
```

## Relação com ICP

Exceções eliminam ramificações de verificação de null espalhadas pelo código (reduz CC_base).
