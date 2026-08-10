# Interoperability — Interoperabilidade

**Dimensão:** Transição
**Severidade Padrão:** 🟠 Importante
**Questão-Chave:** Integra bem com outros sistemas?

## O que é

O esforço necessário para acoplar o software a outros sistemas. Alta interoperabilidade significa que o sistema usa padrões abertos, protocolos comuns e formatos de dados bem definidos para comunicação com sistemas externos.

## Indicadores de Problema

| Situação | Severidade |
|----------|-----------|
| API pública sem versionamento | 🔴 Blocker |
| Webhook sem idempotência | 🟠 Importante |
| Formato de erro inconsistente | 🟠 Importante |
| Contrato não documentado | 🟡 Sugestão |

## Exemplo de Violação

```javascript
// ❌ Não interoperável - formato proprietário
function exportData() {
  return `USER|${user.id}|${user.name}|${user.email}|END`;
  // Formato customizado que apenas este sistema entende
}

// ✅ Interoperável - formato padrão
function exportData() {
  return JSON.stringify({
    type: 'user',
    data: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
}
```

## Codetags Sugeridas

```javascript
// API: Endpoint precisa de versionamento
// CONTRACT: Documentar formato de resposta
```

## Calibração de Severidade

| Situação | Severidade |
|----------|-----------|
| API pública sem versionamento | 🔴 Blocker |
| Webhook sem idempotência | 🟠 Importante |
| Formato de erro inconsistente | 🟠 Importante |
| Contrato não documentado | 🟡 Sugestão |

## Regras Relacionadas

- 043 - Serviços de Apoio como Recursos
- 014 - Princípio de Inversão de Dependência
- 042 - Configurações via Ambiente
