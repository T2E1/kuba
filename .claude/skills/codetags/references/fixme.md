# FIXME — Bug Confirmado que Requer Correção Imediata

**Severidade:** 🔴 Crítica
**Bloqueia PR:** Sim

## O Que É

Marca código com bug confirmado que produz comportamento incorreto e deve ser corrigido imediatamente. Diferente de BUG (que documenta defeito conhecido), FIXME indica que o código precisa ser corrigido agora.

## Quando Usar

- Lógica incorreta descoberta (cálculo retornando valor errado)
- Caso extremo não tratado (divisão por zero, array vazio)
- Comportamento inesperado (função retorna undefined quando não deveria)
- Regressão identificada (código que funcionava e parou)

## Quando NÃO Usar

- Bug conhecido mas não urgente → usar BUG
- Código funciona mas é feio → usar REFACTOR
- Melhoria de performance → usar OPTIMIZE
- Vulnerabilidade de segurança → usar SECURITY

## Formato

```typescript
// FIXME: descrição do problema - causa identificada
// FIXME: [ticket-123] descrição do problema
// FIXME: descrição do problema
```

## Exemplo

```typescript
// FIXME: divisão por zero quando items está vazio
function calculateAverage(items: number[]): number {
  const sum = items.reduce((a, b) => a + b, 0);
  return sum / items.length; // 💥 NaN se items = []
}

// ✅ Corrigido
function calculateAverage(items: number[]): number {
  if (items.length === 0) return 0;
  const sum = items.reduce((a, b) => a + b, 0);
  return sum / items.length;
}
```

## Resolução

- **Prazo:** Antes do commit/merge
- **Ação:** Identificar causa raiz → Corrigir → Testar com casos extremos → Remover comentário
- **Convertido em:** N/A (removido após correção)

## Relacionado a

- Rules: [027](../../../.claude/rules/027_qualidade-tratamento-erros-dominio.md), [039](../../../.claude/rules/039_regra-escoteiro-refatoracao-continua.md)
- Tags similares: FIXME é imediato, BUG é planejado
