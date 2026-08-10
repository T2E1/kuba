# Técnicas de Refatoração para Reduzir CC

## Técnicas por Problema

| CC Alto Causado Por | Técnica | Como Aplicar |
|---------------------|---------|--------------|
| Condicionais aninhados | Guard clauses | Inverter condição e retornar antecipadamente |
| Switch/if-else de tipos | Polimorfismo | Criar subclasses ou padrão Strategy |
| Lógica complexa em método longo | Extração de método | Nomear subproblemas como métodos |
| Loops com lógica interna | Funções de ordem superior | Usar `.filter()`, `.map()`, `.reduce()` |
| Múltiplas condições booleanas | Encapsulamento | Criar método `isX()` que encapsula a condição |
| Recursão complexa | Iteração com pilha | Substituir por loop explícito |

## Exemplo: Guard Clauses

```typescript
// ❌ Antes — CC = 6 (aninhamento profundo)
function process(order: Order): string {
  if (order !== null) {
    if (order.status === 'active') {
      if (order.items.length > 0) {
        if (order.total > 0) {
          return calculateFee(order)
        }
      }
    }
  }
  return 'invalid'
}

// ✅ Depois — CC = 4 (guard clauses)
function process(order: Order): string {
  if (order === null) return 'invalid'
  if (order.status !== 'active') return 'invalid'
  if (order.items.length === 0) return 'invalid'
  if (order.total <= 0) return 'invalid'
  return calculateFee(order)
}
```

## Exemplo: Extração de Método

```typescript
// ❌ Antes — CC = 7 em um único método
function validate(user: User): boolean {
  if (!user.name || user.name.length < 2) return false
  if (!user.email || !user.email.includes('@')) return false
  if (!user.age || user.age < 18 || user.age > 120) return false
  // ... mais condições
}

// ✅ Depois — CC ≤ 3 por método
function validate(user: User): boolean {
  return hasValidName(user) && hasValidEmail(user) && hasValidAge(user)
}
function hasValidName(user: User): boolean {
  return Boolean(user.name && user.name.length >= 2)
}
```
