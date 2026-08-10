# Funções (Regras 033, 037)

## Regras

- **033**: Máximo de 3 parâmetros por função
- **037**: Proibição de argumentos sinalizadores (boolean flags)

## Checklist

- [ ] Funções com ≤3 parâmetros
- [ ] Parâmetros >3 → criar Parameter Object (DTO)
- [ ] Sem boolean flags que alteram o fluxo principal
- [ ] Ramificações → métodos separados com nomes claros

## Exemplos

```typescript
// ❌ Violações
function createOrder(userId, productId, quantity, discount, coupon, address) { } // 6 parâmetros
function render(user, isAdmin) { // boolean flag
  if (isAdmin) return renderAdminView(user);
  return renderUserView(user);
}

// ✅ Conformidade
interface CreateOrderInput {
  userId: string;
  productId: string;
  quantity: number;
  discount: number;
  couponCode?: string;
  deliveryAddress: string;
}

function createOrder(input: CreateOrderInput) { }

// Métodos separados em vez de flag
function renderUser(user: User) { }
function renderAdminUser(user: User) { }
```

## Relação com ICP

Menos parâmetros = menor acoplamento e responsabilidades mais claras.
