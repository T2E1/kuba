# DEPRECATED — Código Obsoleto a Ser Removido

**Severidade:** 🟠 Alta
**Bloqueia PR:** Não (mas deve seguir o cronograma)

## O Que É

Marca código ou funcionalidade obsoleta que será removida em versão futura. Indica que existe uma alternativa melhor e o uso atual deve ser migrado.

## Quando Usar

- API sendo descontinuada (endpoint v1 sendo substituído por v2)
- Função com substituto melhor (helper antigo com nova implementação)
- Padrão abandonado (abordagem que não é mais mantida)
- Dependência a ser removida (biblioteca sendo trocada)

## Quando NÃO Usar

- Código com bug → usar FIXME ou BUG
- Código temporário → usar HACK
- Código a melhorar → usar REFACTOR
- Código removido → deletar, não marcar

## Formato

```typescript
// DEPRECATED: usar X em vez disso - remover na vY.Z
// @deprecated desde v1.2 - usar novaFuncao()
// DEPRECATED: [cronograma] descrição da migração
```

## Exemplo

```typescript
// DEPRECATED: usar calculateTotalV2() - remover na v3.0
// Esta função não considera impostos regionais
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Nova função recomendada
function calculateTotalV2(items: Item[], region: string): number {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  return applyRegionalTax(subtotal, region);
}

/**
 * @deprecated desde v2.0 - usar newFunction() em vez disso
 * @see newFunction
 */
function oldFunction(): void {
  if (process.env.NODE_ENV === 'development') {
    console.warn('oldFunction() está obsoleto. Use newFunction().');
  }
  // ...
}

// DEPRECATED: configuração JSON - migrar para variáveis de ambiente
// Configuração JSON será removida na v4.0 (conformidade twelve-factor)
const config = require('./config.json');

// Novo padrão
const config = {
  apiUrl: process.env.API_URL,
  apiKey: process.env.API_KEY,
};
```

## Resolução

- **Prazo:** Anúncio → Período de carência (avisos em dev) → Aviso (avisos opcionais em prod) → Remoção
- **Ação:** Documentar alternativa → Definir cronograma → Comunicar consumidores → Adicionar aviso em runtime (dev) → Migrar usos internos → Remover após período
- **Convertido em:** Código removido após período de deprecação

## Relacionado a

- Rules: [023](../../../.claude/rules/023_proibicao-funcionalidade-especulativa.md), [015](../../../.claude/rules/015_principio-equivalencia-lancamento-reuso.md)
- Tags similares: DEPRECATED tem cronograma e alternativa, código morto é deletado imediatamente
