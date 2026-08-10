# QUESTION — Dúvida ou Questão

**Severidade:** 🟢 Baixa | Resolver no code review
**Bloqueia PR:** Pode ser 🟡 Média se bloquear corretude

## O Que É

Marca dúvida ou questão sobre abordagem, requisito ou decisão de implementação. Indica incerteza do autor que precisa ser esclarecida por discussão no code review ou sincronização com o time.

## Quando Usar

- Requisito ambíguo (spec não está clara)
- Escolha de abordagem (qual padrão usar?)
- Comportamento esperado (o que fazer neste caso?)
- Validação de entendimento (isto está correto?)

## Quando NÃO Usar

- Código a ser revisado → usar **REVIEW**
- Informação importante → usar **NOTE**
- Bug identificado → usar **FIXME**
- Tarefa pendente → usar **TODO**

## Formato

```typescript
// QUESTION: a questão específica
// QUESTION: questão direcionada a alguém
// QUESTION: opção A vs opção B - qual preferir?
```

## Exemplo

```typescript
// QUESTION: ao cancelar, devemos manter os dados no formulário?
// Spec diz "cancelar operação" mas não especifica estado do formulário
function handleCancel() {
  closeModal();
  // resetForm() ???
}

// QUESTION: Strategy vs Factory para criar processadores de pagamento?
// Strategy: mais flexível, pode trocar em runtime
// Factory: mais simples, decisão no momento de criação
function createPaymentProcessor(type: string) {
  // Implementação pendente de decisão
}

// QUESTION: o que retornar quando a lista está vazia?
// Opções: [], null, lançar EmptyListError
// Impacta contrato da API
function getActiveUsers(): User[] | null {
  const users = db.users.findAll({ active: true });
  if (users.length === 0) {
    return []; // Ou null? Ou lançar?
  }
  return users;
}

// QUESTION: vale otimizar para lookup O(1) ou manter array simples?
// Array: máx 100 itens, lookup O(n) = ~100 comparações
// Map: overhead de criação, lookup O(1)
// Contexto: chamado ~10x por requisição
const config = [
  { key: 'theme', value: 'dark' },
  // ... ~100 itens
];

// QUESTION: falha silenciosa ou lançar exceção em falha de log?
// Silenciosa: não interrompe fluxo principal
// Lançar: garante que problemas sejam notados
async function logEvent(event: Event) {
  try {
    await analytics.track(event);
  } catch (error) {
    console.error('Falha no log', error);
    // throw error; ???
  }
}

// QUESTION: entendi corretamente que o desconto máximo é 50%?
// Email do cliente disse "até metade do valor"
// Confirmar antes do deploy
function applyDiscount(price: number, discountPercent: number): number {
  const maxDiscount = 0.5; // 50%
  const safeDiscount = Math.min(discountPercent, maxDiscount);
  return price * (1 - safeDiscount);
}

// QUESTION: validação de CPF deve aceitar formatado?
// Ex: "123.456.789-00" vs "12345678900"
// Maria definiu os requisitos originais
```

## Resolução

- **Prazo:** Code review ou sincronização com o time
- **Ação:** Formular pergunta clara, oferecer alternativas, direcionar para pessoa certa, discutir, documentar resposta, remover ou converter para NOTE
- **Convertido em:** NOTE (se decisão for importante) ou removido (após resposta)

## Relacionado a

- Rules: [026 - Qualidade de Comentários](../../../.claude/rules/026_qualidade-comentarios-porque.md) (QUESTION é comunicação temporária)
- Tags similares: QUESTION (dúvida do autor) vs REVIEW (precisa de validação externa)
