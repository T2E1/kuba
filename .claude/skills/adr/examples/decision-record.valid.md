# ✅ ADR completo

```markdown
# ADR-019: Autenticação via JWT

**Status:** Accepted
**Date:** 2024-01-15

## Contexto

O sistema precisa de autenticação stateless para escalar horizontalmente.
Usuários acessam de múltiplos dispositivos simultaneamente.
Previsão de 100 mil usuários simultâneos no primeiro ano.

## Decisão

Usar JWT com refresh tokens armazenados em Redis.
Não usar sessions em memória do servidor.

## Alternativas consideradas

| Alternativa | Prós | Contras |
|---|---|---|
| JWT (escolhida) | Stateless, escala horizontal, sem lookup no banco por request | Revogação exige blacklist em Redis |
| Sessions em memória | Simples, revogação imediata | Não escala sem sticky sessions |
| OAuth 2.0 completo | Padrão da indústria, suporte a SSO | Complexidade alta para o caso de uso atual |

## Consequências

### Positivas
- Escalabilidade horizontal sem sticky sessions
- Baixa latência: nenhuma query no banco por request
- Suporte a web e mobile sem configuração adicional

### Negativas
- Revogação exige blacklist em Redis, adicionando uma dependência de infra
- O token cresce se muitos claims forem incluídos
- Sem controle de sessão ativa em tempo real sem infraestrutura extra

## Relacionado a

- ADR-003: Redis como cache distribuído (depende)
- arc42 §8: Crosscutting Concepts — Authentication and Authorization
```

## O que faz este ADR funcionar

| Elemento | Por quê |
|---|---|
| Contexto com números | "100 mil simultâneos" é o que torna a decisão revisável: se o número mudar de ordem de grandeza, o ADR pede revisão |
| Alternativas com contras | Mostra que foram avaliadas de verdade, e impede que a discussão recomece |
| Consequências negativas explícitas | A dependência do Redis foi aceita conscientemente, não descoberta em produção |
| Status e data | Diz se ainda vigora |
| Ligação com o arc42 | Conecta a decisão à documentação da estrutura que ela produziu |

Quando esta decisão for revista, o caminho é um **ADR-0NN novo** com
`Supersedes: ADR-019`, e este recebe `Superseded by`. O ADR aceito nunca é
editado — o histórico é o valor.
