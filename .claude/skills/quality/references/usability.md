# Usability — Usabilidade

**Dimensão:** Operação
**Severidade Padrão:** 🟡 Sugestão
**Questão-Chave:** É fácil de usar?

## O que é

O esforço necessário para aprender, operar, preparar entradas e interpretar saídas do software. Usabilidade engloba clareza da interface, mensagens de erro compreensíveis, feedback ao usuário e acessibilidade.

## Indicadores de Problema

| Situação | Severidade |
|----------|-----------|
| Ação destrutiva sem confirmação | 🟠 Importante |
| Mensagem de erro técnica exposta ao usuário | 🟠 Importante |
| Indicador de carregamento ausente em operação longa | 🟡 Sugestão |
| Inconsistência visual menor | 🟡 Sugestão |

## Exemplo de Violação

```javascript
// ❌ Inutilizável - mensagem genérica
try {
  await saveUser(data);
} catch (error) {
  showError('Ocorreu um erro'); // O que aconteceu? O que fazer?
}

// ✅ Utilizável - mensagem específica e acionável
try {
  await saveUser(data);
} catch (error) {
  if (error.code === 'EMAIL_TAKEN') {
    showError('Este email já está em uso. Tente outro ou faça login.');
  } else if (error.code === 'NETWORK_ERROR') {
    showError('Sem conexão. Verifique sua internet e tente novamente.');
  } else {
    showError('Não foi possível salvar. Tente novamente em alguns minutos.');
  }
}
```

## Codetags Sugeridas

```javascript
// UX(034): Mensagem de erro deve ser mais específica
// UX: Adicionar feedback visual durante o carregamento
```

## Calibração de Severidade

| Situação | Severidade |
|----------|-----------|
| Ação destrutiva sem confirmação | 🟠 Importante |
| Mensagem de erro técnica exposta ao usuário | 🟠 Importante |
| Indicador de carregamento ausente em operação longa | 🟡 Sugestão |
| Inconsistência visual menor | 🟡 Sugestão |

## Regras Relacionadas

- 006 - Proibição de Nomes Abreviados
- 034 - Nomes de Classes e Métodos Consistentes
- 026 - Qualidade de Comentários
