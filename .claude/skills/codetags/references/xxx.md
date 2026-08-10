# XXX — Alerta para Código Perigoso ou Frágil

**Severidade:** 🔴 Crítica
**Bloqueia PR:** Sim (ou justificativa forte)

## O Que É

Marca código que requer atenção crítica imediata — indica algo perigoso, problemático ou que pode causar problemas graves. É um "grito de alerta" no código que não deve ser ignorado.

## Quando Usar

- Código extremamente frágil (pode quebrar com qualquer mudança)
- Lógica perigosa não óbvia (comportamento contra-intuitivo)
- Dependência crítica de ordem (sequência que não pode ser alterada)
- Armadilha para desenvolvedores (código que parece OK mas não é)

## Quando NÃO Usar

- Bug confirmado → usar FIXME ou BUG
- Vulnerabilidade de segurança → usar SECURITY
- Código temporário → usar HACK
- Código a ser refatorado → usar REFACTOR

## Formato

```typescript
// XXX: ALERTA - descrição do perigo
// XXX: NÃO ALTERAR - razão crítica
// XXX: CUIDADO - explicação do risco
```

## Exemplo

```typescript
// XXX: ORDEM CRÍTICA - estas linhas DEVEM executar nesta sequência
// Inverter causa race condition que corrompe dados do usuário
await lockAccount(userId);
await processPayment(userId, amount);
await unlockAccount(userId);
// Se unlockAccount executar antes de processPayment, ocorre cobrança dupla

// XXX: CUIDADO - esta função MODIFICA o array original
// Parece retornar novo array mas muta in-place por performance
// NÃO passar array que precisa ser preservado
function processItems<T>(items: T[]): T[] {
  items.sort((a, b) => a.priority - b.priority);
  items.splice(0, Math.floor(items.length / 2));
  return items; // Mesmo array, modificado!
}

// XXX: FRÁGIL - depende de timing específico do browser
// Funciona porque o DOM atualiza em ~16ms
// Qualquer mudança pode quebrar silenciosamente
setTimeout(() => {
  element.classList.add('visible');
}, 20); // NÃO ALTERAR este valor
```

## Resolução

- **Prazo:** Antes do merge (código novo) ou planejar refatoração (código legado)
- **Ação:** Ler aviso com atenção → Entender o risco completamente → Consultar autor → Testar exaustivamente → Documentar → Remover XXX somente quando reescrito com segurança
- **Convertido em:** Removido ou convertido para REFACTOR se migração planejada

## Relacionado a

- Rules: [022](../../../.claude/rules/022_priorizacao-simplicidade-clareza.md), [026](../../../.claude/rules/026_qualidade-comentarios-porque.md)
- Tags similares: XXX é alerta de perigo, FIXME é bug para corrigir, SECURITY é vulnerabilidade, HACK é temporário
