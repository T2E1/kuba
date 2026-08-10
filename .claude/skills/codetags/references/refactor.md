# REFACTOR — Código Violando Princípios de Design

**Severidade:** 🟠 Alta
**Bloqueia PR:** Não (mas deve ser priorizado)

## O Que É

Marca código que viola princípios de design ou boas práticas e precisa ser reestruturado. O código funciona corretamente mas sua estrutura dificulta manutenção, testes ou evolução.

## Quando Usar

- Violação SOLID (classe com múltiplas responsabilidades)
- God Class/Function (arquivo com 500+ linhas)
- Alto acoplamento (dependências circulares)
- Código duplicado (mesma lógica em vários lugares)
- Complexidade excessiva (CC > 10)

## Quando NÃO Usar

- Código com bug → usar FIXME
- Solução temporária → usar HACK
- Otimização de performance → usar OPTIMIZE
- Código a ser removido → usar DEPRECATED

## Formato

```typescript
// REFACTOR: princípio violado - ação sugerida
// REFACTOR: [SRP] descrição - extrair para classe X
// REFACTOR: CC=15 - dividir em funções menores
```

## Exemplo

```typescript
// REFACTOR: [SRP] classe faz validação + persistência + notificação
// Extrair: OrderValidator, OrderRepository, OrderNotifier
class OrderService {
  createOrder(data: OrderData): Order {
    // Validação (deveria estar em OrderValidator)
    if (!data.items) throw new Error('Items obrigatórios');
    if (!data.customer) throw new Error('Cliente obrigatório');

    // Persistência (deveria estar em OrderRepository)
    const order = db.orders.create(data);

    // Notificação (deveria estar em OrderNotifier)
    emailService.send(order.customer.email, 'Pedido criado');

    return order;
  }
}

// REFACTOR: [DRY] lógica de formatação duplicada em 5 arquivos
// Extrair para utils/formatters.ts
function formatUserName(user: User): string {
  return `${user.firstName} ${user.lastName}`.trim().toUpperCase();
}

// Mesmo código em outro arquivo...
function formatCustomerName(customer: Customer): string {
  return `${customer.firstName} ${customer.lastName}`.trim().toUpperCase();
}

// REFACTOR: [DIP] depende de implementação concreta
// Injetar interface IEmailService em vez de SendGridService
class NotificationService {
  constructor() {
    this.emailService = new SendGridService(); // ❌ Acoplamento forte
  }
}

// ✅ Após refatoração
class NotificationService {
  constructor(private emailService: IEmailService) {}
}
```

## Resolução

- **Prazo:** Sprint atual (God class crítica) ou próxima sprint (duplicação) ou backlog (melhoria incremental)
- **Ação:** Identificar princípio violado → Documentar refatoração → Estimar esforço → Priorizar backlog técnico → Executar com testes → Remover comentário
- **Convertido em:** Removido após refatoração completa

## Relacionado a

- Rules: [010](../../../.claude/rules/010_principio-responsabilidade-unica.md), [011](../../../.claude/rules/011_principio-aberto-fechado.md), [021](../../../.claude/rules/021_proibicao-duplicacao-logica.md), [025](../../../.claude/rules/025_proibicao-anti-pattern-the-blob.md)
- Tags similares: REFACTOR muda estrutura, CLEANUP remove ruído, HACK é temporário
