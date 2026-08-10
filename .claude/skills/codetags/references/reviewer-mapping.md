# Mapeamento @architect → Codetags

## Severidade da Violação → Tag

| Severidade | Tag a usar | Bloqueia PR? |
|------------|------------|--------------|
| 🔴 Crítica (rules 001-003, 007, 010...) | `FIXME` | Sim |
| 🟠 Alta (rules 004-006, 011-020...) | `TODO` | Não — deve corrigir |
| 🟡 Média (rules 023, 026, 039...) | `XXX` | Não — melhoria esperada |
| 🔐 Segurança crítica (CWE Injection, Auth) | `FIXME` | Sim |
| 🔐 Segurança alta (CWE Crypto, SSRF) | `TODO` | Não |
| 🔐 Segurança média (CWE Exposure) | `XXX` | Não |
| ⚡ Performance (ICP, Big-O) | `OPTIMIZE` | Não |
| ❓ Decisão não óbvia | `NOTE` | Não |
| 🔄 Precisa verificação | `REVIEW` | Não |

## Fluxo do @architect

```
@architect analisa o arquivo
    ↓
Violação encontrada → seleciona tag conforme tabela acima
    ↓
Insere na linha ACIMA da seção violada:
// TAG: descrição da violação — correção sugerida
    ↓
Reporta veredicto: Aprovado / Atenção / Rejeitado
```
