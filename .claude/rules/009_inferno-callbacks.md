---
title: "Inferno de Callbacks (Callback Hell)"
category: "Anti-Patterns"
type: reference
id: "BEHAVIORAL-009"
severity: "🟠 High"
tags: [anti-patterns]
---

# Inferno de Callbacks (Callback Hell)

## Explanation

### O que é

Callback Hell ocorre quando código assíncrono é escrito usando aninhamento profundo de callbacks, criando fluxo de controle difícil de seguir. Múltiplos callbacks aninhados criam código em forma de seta com indentação progredindo para a direita, tornando o código quase impossível de ler e manter. Versão assíncrona do [014 — Pyramid of Doom](014_piramide-do-destino.md).

### Por que importa

- Dificuldade de leitura: desenvolvedores perdem o rastro dos níveis; não sabem em qual callback estão
- Difícil debugar erros: tratamento de erros espalhado por múltiplos níveis
- Dificuldade de teste: testar cada callback isoladamente é impossível
- Erros comuns: esquecer de chamar próximo callback, tratamento de erro adequado ou retorno antecipado
- Problema específico de linguagens/paradigmas sem async/await ou promises

## How-to

### Como aplicar

- Migrar para `async`/`await` com `try/catch` centralizado
- Tratar cada operação assíncrona como um passo sequencial, não um nível de aninhamento

### Exemplo

```javascript
// ❌ Pirâmide do destino — cada nível é uma operação assíncrona
getUser(userId, (err, user) => {
  if (err) return handleError(err);
  getOrders(user.id, (err, orders) => {
    if (err) return handleError(err);
    getProducts(orders[0].id, (err, products) => {
      if (err) return handleError(err);
      calculateTotal(products, (err, total) => {
        if (err) return handleError(err);
        sendInvoice(user, total, (err) => {
          if (err) return handleError(err);
          console.log('done');
        });
      });
    });
  });
});
```

```javascript
// ✅ async/await — fluxo sequencial e legível
async function processInvoice(userId) {
  try {
    const user = await getUser(userId);
    const orders = await getOrders(user.id);
    const products = await getProducts(orders[0].id);
    const total = await calculateTotal(products);
    await sendInvoice(user, total);
  } catch (err) {
    handleError(err); // tratamento centralizado
  }
}
```

Codetag sugerido:

```typescript
// FIXME: Callback Hell — 5 níveis de aninhamento de callbacks
// TODO: Migrar para async/await com try/catch
```

## Reference

### Critérios Objetivos

- [ ] Mais de 3 níveis de aninhamento de callbacks
- [ ] Funções de callback definidas inline em vez de funções nomeadas
- [ ] Tratamento de erro repetido em cada nível de callback (try/catch dentro de cada callback)
- [ ] Padrão de `}) })` no final do arquivo — marcadores de callback hell
- [ ] Variáveis capturadas em closures de múltiplos níveis, criando estado difícil de raciocinar

### Exceções Permitidas

- **Runtime sem Promises**: Linguagem ou runtime sem suporte a promise e `async`/`await`.
- **APIs de Callback Obrigatório**: De terceiro, sem alternativa em promise.
- **Aninhamento de Nível Único**: Um único nível, com uma só operação assíncrona.

### Como Detectar

#### Manual

- Varredura visual: procurar código com indentação derivando para direita em callbacks multi-nível
- Identificar funções passando callbacks que por sua vez passam callbacks
- Verificar stack traces ao debugar: stack frames profundamente aninhados com funções de callback

#### Automático

- Biome: `complexity/noExcessiveCognitiveComplexity` (aninhamento profundo eleva a complexidade cognitiva)

## Related to

- [Single-Level Indentation Rule](../skills/calisthenics/references/nivel-unico-indentacao.md): reinforces
- [Async Exception Handling](../skills/clean-code/references/tratamento-excecao-assincrona.md): reinforces
- [003 — Spaghetti Code](003_codigo-spaghetti.md): reinforces
- [Domain Error Handling Quality](../skills/clean-code/references/qualidade-tratamento-erros-dominio.md): reinforces
- [Simplicity and Clarity (KISS)](../skills/clean-code/references/priorizacao-simplicidade-clareza.md): reinforces
- [Aninhamento (Nesting)](../skills/cdd/SKILL.md): reinforces — métrica cognitiva que quantifica objetivamente o aninhamento de callbacks
- [Testability — Testabilidade](../skills/quality/references/testability.md): contrasts — callbacks aninhados dificultam isolar cada passo em teste
