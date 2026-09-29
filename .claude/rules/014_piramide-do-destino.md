---
title: "Pirâmide do Destino (Pyramid of Doom / Arrow Anti-Pattern)"
category: "Anti-Patterns"
type: reference
id: "STRUCTURAL-014"
severity: "🟠 High"
tags: [anti-patterns]
---

# Pirâmide do Destino (Pyramid of Doom / Arrow Anti-Pattern)

## Explanation

### O que é

Pirâmide do Destino (ou Arrow Anti-Pattern) ocorre quando há aninhamento excessivo de condicionais (`if`/`else`) e loops que cria uma estrutura visual de pirâmide ou seta. Cada nível de [aninhamento](../skills/cdd/SKILL.md) adiciona complexidade cognitiva e aumenta o Índice de [Complexidade Ciclomática](../skills/complexity/SKILL.md). O caminho feliz está enterrado profundamente dentro em vez de no nível zero. Versão síncrona de [009 — Callback Hell](009_inferno-callbacks.md).

### Por que importa

- Leitura não-linear: desenvolvedores não conseguem seguir fluxo de cima para baixo; precisam rastrear aninhamento
- Bugs em casos extremos: caminhos aninhados raramente testados; bugs frequentemente encontrados em níveis profundos
- Dificuldade de adicionar condições: cada nova validação aumenta aninhamento; refatoração requer reindentação
- Inflação de complexidade: validações simples se transformam em estruturas complexas com ifs aninhados
- Alta Complexidade Ciclomática: cada nível dobra o número de caminhos de execução possíveis

## How-to

### Como aplicar

- Aplicar guard clauses: tratar os casos de erro/saída primeiro e devolver cedo, deixando o caminho feliz no nível zero

### Exemplo

```javascript
// ❌ Pirâmide — caminho feliz enterrado no nível 4
function processOrder(order) {
  if (order) {
    if (order.items.length > 0) {
      if (order.user.isActive) {
        if (order.payment.isValid) {
          return fulfill(order); // caminho feliz no nível 4
        } else {
          return { error: 'Pagamento inválido' };
        }
      } else {
        return { error: 'Usuário inativo' };
      }
    } else {
      return { error: 'Pedido vazio' };
    }
  } else {
    return { error: 'Pedido não encontrado' };
  }
}
```

```javascript
// ✅ Guard clauses — caminho feliz no nível zero
function processOrder(order) {
  if (!order) return { error: 'Pedido não encontrado' };
  if (order.items.length === 0) return { error: 'Pedido vazio' };
  if (!order.user.isActive) return { error: 'Usuário inativo' };
  if (!order.payment.isValid) return { error: 'Pagamento inválido' };

  return fulfill(order);
}
```

Codetag sugerido:

```typescript
// FIXME: Pyramid of Doom — 4 níveis de aninhamento
// TODO: Aplicar Guard Clauses para linearizar o fluxo
```

## Reference

### Critérios Objetivos

- [ ] Código com 4+ níveis de aninhamento de if/else/loops
- [ ] `if` dentro de `if` dentro de `for` dentro de `if` — padrão de pirâmide visual
- [ ] Complexidade Ciclomática > 10 na mesma função
- [ ] Caminho feliz está no nível de aninhamento 3+ em vez de nível zero
- [ ] Múltiplos statements `else` sem early return/guard clauses

### Exceções Permitidas

- **Código Legado**: Quando a refatoração imediata traria alto risco sem ganho claro.
- **Parsers e Máquinas de Estado**: Complexidade imposta por especificação externa de parsing ou de estados.
- **Validações Obrigatórias**: Que não podem ser extraídas do handler sem quebrar a ordem.

### Como Detectar

#### Manual

- Varredura visual: procurar código com formato de seta com aninhamento
- Buscar código onde adicionar nova validação requer reindentar tudo abaixo
- Identificar funções onde nunca fazem early return; todos os caminhos aninhados em else

#### Automático

- Biome: `complexity/noExcessiveCognitiveComplexity`, `style/noUselessElse`

## Related to

- [ELSE Clause](../skills/calisthenics/references/clausula-else.md): reinforces
- [Single-Level Indentation Rule](../skills/calisthenics/references/nivel-unico-indentacao.md): reinforces
- [003 — Spaghetti Code](003_codigo-spaghetti.md): complements
- [009 — Callback Hell](009_inferno-callbacks.md): complements
- [Domain Error Handling Quality](../skills/clean-code/references/qualidade-tratamento-erros-dominio.md): reinforces
- [Aninhamento (Nesting)](../skills/cdd/SKILL.md): reinforces — métrica cognitiva usada para detectar objetivamente a pirâmide
- [Complexidade Ciclomática](../skills/complexity/SKILL.md): reinforces — cresce diretamente com o aninhamento de condicionais
- [Testability — Testabilidade](../skills/quality/references/testability.md): contrasts — caminhos aninhados profundos são difíceis de cobrir com testes
