# Reliability — Confiabilidade

**Dimensão:** Operação
**Severidade Padrão:** 🔴 Crítica
**Questão-Chave:** É preciso?

## O que é

O grau em que o software produz resultados consistentes e precisos sob diferentes condições. Um software confiável funciona corretamente mesmo em situações adversas, falha de forma controlada e se recupera de erros.

## Indicadores de Problema

| Situação | Severidade |
|----------|-----------|
| Erro pode causar perda de dados | 🔴 Blocker |
| Erro pode derrubar o serviço | 🔴 Blocker |
| Erro afeta a experiência do usuário | 🟠 Importante |
| Erro em fluxo secundário | 🟡 Sugestão |

## Exemplo de Violação

```javascript
// ❌ Não confiável - pode falhar silenciosamente
async function fetchUser(id) {
  const response = await api.get(`/users/${id}`);
  return response.data.user; // E se response.data for undefined?
}

// ✅ Confiável - trata erros e valida dados
async function fetchUser(id) {
  if (!id) throw new UserIdRequiredError();

  const response = await api.get(`/users/${id}`);

  if (!response.data?.user) {
    throw new UserNotFoundError(id);
  }

  return response.data.user;
}
```

## Codetags Sugeridas

```javascript
// FIXME: Promise sem tratamento de erro
// FIXME: Adicionar retry para chamada externa
```

## Calibração de Severidade

| Situação | Severidade |
|----------|-----------|
| Erro pode causar perda de dados | 🔴 Blocker |
| Erro pode derrubar o serviço | 🔴 Blocker |
| Erro afeta a experiência do usuário | 🟠 Importante |
| Erro em fluxo secundário | 🟡 Sugestão |

## Regras Relacionadas

- 027 - Qualidade no Tratamento de Erros de Domínio
- 028 - Tratamento de Exceção Assíncrona
- 036 - Restrição de Funções com Efeitos Colaterais
