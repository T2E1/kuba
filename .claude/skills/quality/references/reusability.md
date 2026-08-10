# Reusability — Reusabilidade

**Dimensão:** Transição
**Severidade Padrão:** 🟠 Importante
**Questão-Chave:** Pode ser usado em outro contexto?

## O que é

O grau em que um módulo ou componente pode ser reutilizado em outros sistemas ou contextos além daquele para o qual foi originalmente desenvolvido. Alta reusabilidade significa que os componentes são genéricos, bem documentados e possuem interfaces claras.

## Indicadores de Problema

| Situação | Severidade |
|----------|-----------|
| Lógica de negócio duplicada | 🟠 Importante |
| Utilitário acoplado ao domínio | 🟠 Importante |
| Componente de UI muito específico | 🟡 Sugestão |
| Nomenclatura específica de contexto | 🟡 Sugestão |

## Exemplo de Violação

```javascript
// ❌ Não reutilizável - lógica duplicada
// file1.js
function validateUserEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// file2.js
function checkEmailFormat(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ✅ Reutilizável - função única compartilhada
// shared/validators.js
export function isValidEmail(email) {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return EMAIL_REGEX.test(email);
}
```

## Codetags Sugeridas

```javascript
// DRY(021): Esta lógica está duplicada em outro arquivo
// REUSE: Componente muito específico - generalizar
```

## Calibração de Severidade

| Situação | Severidade |
|----------|-----------|
| Lógica de negócio duplicada | 🟠 Importante |
| Utilitário acoplado ao domínio | 🟠 Importante |
| Componente de UI muito específico | 🟡 Sugestão |
| Nomenclatura específica de contexto | 🟡 Sugestão |

## Regras Relacionadas

- 021 - Proibição da Duplicação de Lógica
- 003 - Encapsulamento de Primitivos
- 010 - Princípio da Responsabilidade Única
