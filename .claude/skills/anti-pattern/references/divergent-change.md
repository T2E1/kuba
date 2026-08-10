# Divergent Change

**Severidade:** 🟠 Alta
**Regra Associada:** Regra 054

## O Que É

Uma única classe muda por múltiplas razões diferentes e não relacionadas. Cada novo tipo de mudança exige editar a mesma classe por uma razão completamente diferente da anterior. Oposto complementar do Shotgun Surgery: aqui, uma classe muda por N razões.

## Sintomas

- Classe possui seções separadas por comentários (`// lógica do banco`, `// regras de negócio`, `// formatação ui`)
- Histórico de commits mostra commits de features completamente diferentes sempre modificando o mesmo arquivo
- Testes unitários precisam mockar múltiplas responsabilidades para testar uma única funcionalidade
- Múltiplas razões para mudar: "mudei porque trocamos de banco... e porque a regra de desconto mudou... e porque o relatório mudou"

## ❌ Exemplo (violação)

```javascript
// ❌ OrderService muda quando: o banco muda, a regra de imposto muda, o formato do relatório muda
class OrderService {
  // Camada de dados
  async findOrders(filters) { return db.query('SELECT ...', filters); }

  // Regra de negócio
  calculateTax(order) { return order.subtotal * TAX_RATES[order.region]; }

  // Formatação
  formatForReport(orders) { return orders.map(o => ({ id: o.id, total: formatCurrency(o.total) })); }
}
```

## ✅ Refatoração

```javascript
// ✅ Cada classe muda por apenas uma razão (Extract Class)
class OrderRepository {
  async findOrders(filters) { ... }  // muda quando o banco muda
}

class TaxCalculator {
  calculateTax(order) { ... }        // muda quando a lei muda
}

class OrderReportFormatter {
  formatForReport(orders) { ... }    // muda quando o relatório muda
}
```

## Codetag Sugerido

```typescript
// FIXME: Divergent Change — OrderService tem 3 responsabilidades: persistência, cálculo, formatação
// TODO: Extrair OrderRepository, TaxCalculator, OrderReportFormatter
```
