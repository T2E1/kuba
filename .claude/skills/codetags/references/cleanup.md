# CLEANUP — Código Desorganizado ou Elementos Desnecessários

**Severidade:** 🟠 Alta
**Bloqueia PR:** Não (mas deve ser tratado)

## O Que É

Marca código desorganizado ou elementos desnecessários que precisam ser limpos. Diferente de REFACTOR (que muda a estrutura), CLEANUP remove ruído e organiza sem alterar comportamento.

## Quando Usar

- Código morto (funções nunca chamadas)
- Imports não utilizados (dependências órfãs)
- Comentários obsoletos (documentação desatualizada)
- console.logs esquecidos (debug deixado para trás)
- Variáveis não utilizadas (declarações órfãs)

## Quando NÃO Usar

- Código a ser reestruturado → usar REFACTOR
- Bug a ser corrigido → usar FIXME
- Feature a implementar → usar TODO
- Código oficialmente obsoleto → usar DEPRECATED

## Formato

```typescript
// CLEANUP: tipo de limpeza necessária
// CLEANUP: remover código morto após confirmar não uso
// CLEANUP: organizar imports/remover não utilizados
```

## Exemplo

```typescript
// CLEANUP: função não utilizada - verificar e remover
function oldCalculation(value: number): number {
  // Esta função era usada na v1, não é mais chamada
  return value * 1.5;
}

// CLEANUP: remover logs de debug antes do merge
function processOrder(order: Order): Result {
  console.log('DEBUG: pedido recebido', order);
  console.log('DEBUG: processando...', { timestamp: Date.now() });

  const result = calculate(order);

  console.log('DEBUG: resultado', result);
  return result;
}

// CLEANUP: imports não utilizados - remover
import { attributeChanged, define } from '@directive';
import { paint, repaint, retouch } from '@dom';
import Echo from '@echo';
import { Hidden, Value, Width } from '@mixin';

// Apenas define, paint, Echo e Value são usados
@define('kb-sample')
class Sample extends Value(Echo(HTMLElement)) {
  @paint
  render() {
    return this.value;
  }
}

// CLEANUP: comentários desatualizados - atualizar ou remover
function calculateDiscount(order: Order): number {
  // Retorna 10% de desconto para pedidos acima de R$100
  // NOTA: agora retorna 15% (alterado em 2023)
  // TODO: verificar com marketing (já verificado, manter 15%)
  return order.total > 100 ? order.total * 0.15 : 0;
}

// CLEANUP: código comentado - remover (está no histórico do git)
function getCurrentPrice(product: Product): number {
  // const oldPrice = product.basePrice * 1.1;
  // const discount = calculateOldDiscount(product);
  // return oldPrice - discount;

  return product.basePrice * 1.2;
}
```

## Resolução

- **Prazo:** Antes do commit (console.logs) ou antes do PR (imports) ou próxima sprint (código morto)
- **Ação:** Identificar tipo de limpeza → Verificar se remoção é segura → Remover código/imports/comentários → Testar que nada quebrou → Commitar
- **Convertido em:** N/A (removido após limpeza)

## Relacionado a

- Rules: [023](../../../rules/023_proibicao-funcionalidade-especulativa.md), [039](../../../rules/039_regra-escoteiro-refatoracao-continua.md)
- Tags similares: CLEANUP remove ruído, REFACTOR muda estrutura
