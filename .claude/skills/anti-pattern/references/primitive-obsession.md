# Primitive Obsession

**Severidade:** 🔴 Crítica
**Regra Associada:** Regra 003

## O Que É

Usar tipos primitivos (`string`, `number`, `boolean`) para representar conceitos de domínio que deveriam ser objetos com comportamento próprio. CEP como `string`, dinheiro como `number`, status como `boolean`.

## Sintomas

- Parâmetros como `(string email, string phone, string zipCode)` em vez de objetos
- Validação do mesmo formato espalhada em vários lugares (`/\d{8}/` para CEP)
- Magic Numbers representando estados: `status === 1`, `type === 'A'`
- Arrays de primitivos onde objetos seriam mais descritivos

## ❌ Exemplo (violação)

```javascript
// ❌ CPF como string solta — validação duplicada em N lugares
function createUser(name, cpf, email) {
  if (!/^\d{11}$/.test(cpf)) throw new Error('CPF inválido');
  // ... mesma validação em updateUser, validateDocument, etc.
}
```

## ✅ Refatoração

```javascript
// ✅ CPF como Value Object — validação encapsulada uma única vez
class CPF {
  constructor(value) {
    if (!/^\d{11}$/.test(value)) throw new Error('CPF inválido');
    this.value = value;
  }
  format() { return `${this.value.slice(0,3)}.${this.value.slice(3,6)}.${this.value.slice(6,9)}-${this.value.slice(9)}`; }
}

function createUser(name, cpf, email) {
  // CPF já validado — quem instancia CPF garante a validade
}
```

## Codetag Sugerido

```typescript
// FIXME: Primitive Obsession — CPF como string sem encapsulamento
// TODO: Criar CPF Value Object com validação no construtor
```
