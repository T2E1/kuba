# HACK — Solução Temporária ou Contorno

**Severidade:** 🟠 Alta
**Bloqueia PR:** Não (mas deve ser documentado)

## O Que É

Marca solução temporária ou contorno que funciona mas não é a implementação correta. HACKs são conscientemente sub-ótimos e precisam ser reescritos adequadamente.

## Quando Usar

- Contorno para bug externo (contornando bug de biblioteca)
- Solução rápida para deadline (precisa de refatoração depois)
- Código de compatibilidade (suporte temporário para versão antiga)
- Gambiarra que funciona (solução não elegante mas funcional)

## Quando NÃO Usar

- Bug no próprio código → usar FIXME
- Código precisando de melhoria → usar REFACTOR
- Otimização pendente → usar OPTIMIZE
- Código permanente → não usar codetag

## Formato

```typescript
// HACK: razão do contorno - quando remover
// HACK: [ticket] descrição - remover quando X
// HACK: contornando bug na lib Y - issue #123
```

## Exemplo

```typescript
// HACK: Safari não suporta `gap` em flexbox < 14.1
// Remover quando abandonar suporte ao Safari 14
const styles = {
  display: 'flex',
  // gap: '16px', // Não funciona no Safari antigo
  margin: '-8px',
  '& > *': { margin: '8px' }
};

// HACK: API v1 retorna datas como string, v2 como timestamp
// Remover quando migração para v2 estiver completa
function parseDate(value: string | number): Date {
  if (typeof value === 'string') {
    return new Date(value); // API v1
  }
  return new Date(value * 1000); // API v2
}

// HACK: validação inline por ora - extrair para classe validadora
// TODO: Criar OrderValidator após release 2.0
function createOrder(data: OrderData): Order {
  if (!data.items?.length) throw new Error('Items obrigatórios');
  if (!data.customer?.email) throw new Error('Email obrigatório');
  if (data.total < 0) throw new Error('Total inválido');
  // ... resto da função
}
```

## Resolução

- **Prazo:** Próxima sprint (deadline) ou quando correção disponível (bug externo)
- **Ação:** Documentar claramente a razão → Especificar quando remover → Criar ticket → Revisar periodicamente → Remover quando solução correta implementada
- **Convertido em:** Removido ou convertido para código permanente após refatoração

## Relacionado a

- Rules: [022](../../../.claude/rules/022_priorizacao-simplicidade-clareza.md), [039](../../../.claude/rules/039_regra-escoteiro-refatoracao-continua.md)
- Tags similares: HACK funciona mas mal, FIXME não funciona (bug)
