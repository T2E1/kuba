# Speculative Generality

**Severidade:** 🟡 Média
**Regra Associada:** Regra 023

## O Que É

Código criado para suportar casos de uso hipotéticos que "podem" ser necessários no futuro: hooks, parâmetros, classes abstratas e configurações que não têm uso atual. Fowler: *"Oh, acho que vamos precisar da capacidade de fazer esse tipo de coisa algum dia."*

## Sintomas

- Classes ou métodos vazios que visam ser placeholders para funcionalidades futuras
- Parâmetros de função que sempre recebem o mesmo valor e nunca variam
- Classes abstratas com um único implementador
- Hooks e callbacks nunca invocados ("para extensibilidade futura")
- Métodos públicos que nenhum código externo chama
- Herança criada "para quando tivermos mais tipos"
- Código com mais de 5% das linhas marcadas como desabilitadas ou com `// TODO: implementação futura`

## ❌ Exemplo (violação)

```javascript
// ❌ Parâmetro "options" nunca usado com valores diferentes
function getUser(id, options = { includeDeleted: false, format: 'full' }) {
  // options.includeDeleted nunca é true em nenhum chamador
  // options.format nunca é diferente de 'full'
  return db.users.find(id);
}

// ❌ Classe abstrata com único implementador
class BaseNotifier { notify(message) { throw new Error('Não implementado'); } }
class EmailNotifier extends BaseNotifier { notify(message) { sendEmail(message); } }
// EmailNotifier é o único implementador que existirá pelos próximos 2 anos
```

## ✅ Refatoração

```javascript
// ✅ Simples e direto — adicionar flexibilidade quando houver caso de uso real (YAGNI)
function getUser(id) {
  return db.users.find(id);
}

function sendNotification(message) {
  sendEmail(message);
}

// Quando houver um SMSNotifier real, então criar a abstração
```

## Codetag Sugerido

```typescript
// FIXME: Speculative Generality — options nunca usado, BaseNotifier tem 1 implementação
// TODO: Remover abstração até existir 2º implementador REAL
```
