---
title: "Mudança Divergente (Divergent Change)"
category: "Code Smells"
type: reference
id: "STRUCTURAL-036"
severity: "🟠 High"
tags: [code-smells]
---

# Mudança Divergente (Divergent Change)

## Explanation

### O que é

Mudança Divergente (Divergent Change) ocorre quando uma única classe é modificada por múltiplas razões diferentes e não relacionadas. Cada novo tipo de mudança requer editar a mesma classe por uma razão completamente diferente da anterior. Oposto complementar de Shotgun Surgery: aqui, uma classe muda por N razões.

### Por que importa

- Violação do Princípio de Responsabilidade Única (SRP): classe com múltiplas responsabilidades
- Alto risco de regressão: alterar uma preocupação (ex: banco de dados) pode quebrar acidentalmente outra (ex: regra de negócio)
- Manutenção difícil: desenvolvedores não sabem quais partes da classe são seguras de editar
- Testes complexos: é difícil testar cada responsabilidade isoladamente quando estão misturadas
- Histórico de commits confuso: commits de features totalmente diferentes sempre tocam o mesmo arquivo

## How-to

### Exemplo

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

```typescript
// FIXME: Divergent Change — OrderService tem 3 responsabilidades: persistência, cálculo, formatação
// TODO: Extrair OrderRepository, TaxCalculator, OrderReportFormatter
```

## Reference

### Critérios Objetivos

- [ ] Classe possui seções separadas por comentários (`// lógica do banco`, `// regras de negócio`, `// formatação ui`)
- [ ] Histórico de commits mostra commits de features diferentes sempre modificando o mesmo arquivo
- [ ] Testes unitários precisam mockar múltiplas responsabilidades para testar uma única funcionalidade
- [ ] Múltiplas razões-para-mudar documentadas ou discutidas em code reviews
- [ ] Classe cresce continuamente porque cada nova feature adiciona +1 método para responsabilidade diferente

### Exceções Permitidas

- **Classes Pequenas**: Abaixo de 100 linhas, com responsabilidades estreitamente relacionadas.
- **[DTOs](../skills/poeaa/references/data-transfer-object.md) e [Value Objects](../skills/poeaa/references/value-object.md)**: Agrupam dados por definição — é o propósito deles.
- **Adapters Multi-Interface**: Quando as interfaces implementadas pertencem ao mesmo paradigma.
- **Código Legado**: Quando a refatoração imediata traria risco inaceitável.

### Como Detectar

#### Manual

- Ler comentários que delimitam seções claramente distintas na mesma classe
- Analisar histórico de commits: identificar commits de features diferentes editando o mesmo arquivo
- Verificar testes: se testar uma responsabilidade requer preparar/mockar outras, pode ser mudança divergente
- Buscar classes que respondem a múltiplos tipos de requisitos (banco de dados, ui, domínio, infraestrutura)

#### Automático

- Análise de commits (`git log --stat`): detectar arquivos com commits de múltiplas categorias/labels
- Sem regra nativa de Biome para acoplamento por múltiplas razões-para-mudar — avaliar via revisão de arquitetura

## Related to

- [Single Responsibility Principle (SRP)](../skills/solid/SKILL.md): reinforces
- [038 — Shotgun Surgery](038_shotgun-surgery.md): complements
- [Maximum Lines per Class File](../skills/calisthenics/references/limite-maximo-linhas-classe.md): reinforces
- [001 — The Blob Anti-Pattern](001_anti-pattern-the-blob.md): complements
- [First-Class Collections](../skills/calisthenics/references/colecoes-primeira-classe.md): reinforces
- [Dependency Inversion Principle (DIP)](../skills/solid/SKILL.md): complements
