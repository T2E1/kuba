# Cut-and-Paste Programming

**Severidade:** 🔴 Crítica
**Regra Associada:** Regra 021

## O Que É

Reutilização de código por cópia e colagem de blocos entre arquivos ou funções em vez de criar abstrações reutilizáveis. A lógica existe em múltiplos lugares sem uma única fonte de verdade. Violação direta do princípio DRY (Don't Repeat Yourself).

## Sintomas

- Cópia direta de blocos de código com mais de 5 linhas entre classes ou métodos é proibida
- Lógica complexa usada em mais de 2 locais sem extração
- Blocos de código idênticos ou quase idênticos em arquivos diferentes
- Bug corrigido em um lugar mas presente nos clones
- `// copiado de UserService` como comentário
- Funções com nomes como `processOrderV2`, `processOrderFinal`, `processOrderFixed`

## ❌ Exemplo (violação)

```javascript
// ❌ Mesma validação copiada em três lugares
function createUser(data) {
  if (!data.email || !data.email.includes('@')) throw new Error('Email inválido');
  if (!data.name || data.name.length < 2) throw new Error('Nome inválido');
  return db.users.create(data);
}

function updateUser(id, data) {
  if (!data.email || !data.email.includes('@')) throw new Error('Email inválido');
  if (!data.name || data.name.length < 2) throw new Error('Nome inválido');
  return db.users.update(id, data);
}
```

## ✅ Refatoração

```javascript
// ✅ Validação extraída para única fonte de verdade (Extract Function)
function validateUserData(data) {
  if (!data.email || !data.email.includes('@')) throw new Error('Email inválido');
  if (!data.name || data.name.length < 2) throw new Error('Nome inválido');
}

function createUser(data) {
  validateUserData(data);
  return db.users.create(data);
}

function updateUser(id, data) {
  validateUserData(data);
  return db.users.update(id, data);
}
```

## Codetag Sugerido

```typescript
// FIXME: Cut-and-Paste Programming — validação duplicada em create/update/patch
// TODO: Extract Function — criar validateUserData() reutilizável
```
