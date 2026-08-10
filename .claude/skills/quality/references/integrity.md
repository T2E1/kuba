# Integrity — Integridade

**Dimensão:** Operação
**Severidade Padrão:** 🔴 Crítica (SEMPRE blocker)
**Questão-Chave:** Oferece segurança?

## O que é

O grau em que o acesso ao software ou aos dados pode ser controlado e protegido. Integridade engloba proteção contra ataques, validação de dados, controle de acesso e proteção de informações sensíveis.

## Indicadores de Problema

| Situação | Severidade |
|----------|-----------|
| Qualquer vulnerabilidade de segurança | 🔴 Blocker |
| Possível vulnerabilidade (necessita análise) | 🔴 Blocker |
| Melhoria de segurança (sem vulnerabilidade) | 🟠 Importante |

## Exemplo de Violação

```javascript
// ❌ Vulnerável - SQL Injection
function getUser(username) {
  return db.query(`SELECT * FROM users WHERE username = '${username}'`);
}

// ✅ Seguro - Prepared Statement
function getUser(username) {
  return db.query('SELECT * FROM users WHERE username = ?', [username]);
}
```

## Codetags Sugeridas

```javascript
// SECURITY: Sanitizar entrada antes de usar na query
// FIXME: Vulnerabilidade de SQL injection - usar prepared statement
// FIXME: API key hardcoded - mover para variável de ambiente
```

## Calibração de Severidade

**SEMPRE 🔴 Blocker** - Sem exceções para vulnerabilidades de segurança.

| Situação | Ação |
|----------|------|
| Qualquer vulnerabilidade de segurança | 🔴 Blocker - não fazer merge |
| Possível vulnerabilidade (necessita análise) | 🔴 Blocker até confirmação |
| Melhoria de segurança (sem vulnerabilidade) | 🟠 Importante |

## Regras Relacionadas

- 030 - Proibição de Funções Inseguras
- 042 - Configurações via Ambiente
- 024 - Proibição de Constantes Mágicas
