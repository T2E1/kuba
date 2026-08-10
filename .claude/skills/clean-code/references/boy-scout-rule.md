# Boy Scout Rule (Regra 039)

## Regra

- **039**: Sempre deixar o código melhor do que o encontrou

## Checklist

- [ ] Pequenos code smells corrigidos no escopo da alteração
- [ ] Arquivos modificados com CC>5 → refatorar
- [ ] Nomes ruins → renomear durante a alteração
- [ ] Guard clauses ausentes → adicionar
- [ ] Diff do PR mostra melhorias além do solicitado

## Filosofia

> "Deixe o acampamento mais limpo do que o encontrou."

A refatoração contínua e emergente previne o acúmulo de débito técnico. Não espere um "sprint de refatoração" — melhore sempre que tocar no código.

## Exemplos

```typescript
// Antes (encontrado)
function processOrder(order) {
  if (order.status == 'pending') {
    if (order.items.length > 0) {
      if (order.payment === 'card') {
        if (order.amount > 1000) {
          return applyDiscount(order)
        } else {
          return processPayment(order)
        }
      } else if (order.payment === 'pix') {
        return processPix(order)
      }
    }
  }
  return false;
}

// Depois (melhorado ao passar pelo código)
function processOrder(order: Order): boolean {
  // Guard clauses adicionadas
  if (order.status !== OrderStatus.PENDING) return false;
  if (order.total <= 0) return false;
  if (!order.user) return false;

  // Lógica principal
  order.status = OrderStatus.PROCESSING;
  saveOrder(order);
  return true;
}

function processCardPayment(order: Order): string {
  return order.amount > 1000 ? applyDiscount(order) : processPayment(order);
}

// Enums criados onde havia strings mágicas
enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed'
}
```

## Oportunidades de Escotismo

| Encontrado | Ação de Escotismo |
|-----------|-------------------|
| `if (x) { if (y) { ... } }` | Aplicar guard clause ou extrair método |
| `strName`, `bIsActive` | Remover notação húngara |
| `const val = 100` | Criar constante nomeada (`MAX_RETRIES`) |
| Método com CC=6 | Extrair condicionais em métodos privados |
| Comentário redundante | Remover ou transformar em POR QUÊ |
| `return null` | Lançar exceção de domínio |

## Quando NÃO Aplicar

- **Hotfixes Críticos**: Risco de refatoração > ganho imediato
- **Código Sem Testes**: Sem testes, refatoração pode introduzir bugs
- **Escopo muito distante**: Não refatorar arquivos não relacionados ao PR

## Relação com ICP

- Reduz débito técnico incrementalmente
- Mantém CC_base e Responsabilidades sob controle
- Previne a formação de Blob e Lava Flow
