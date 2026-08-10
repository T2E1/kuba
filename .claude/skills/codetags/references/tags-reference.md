# Codetags — Índice de Tags

16 tags organizadas por severidade. Cada tag possui seu próprio arquivo com definição completa, exemplos e orientações de resolução.

---

## 🔴 Crítico — Resolver antes do commit

| Tag | Significado | Arquivo |
|-----|-------------|---------|
| `FIXME` | Bug confirmado — correção imediata | [fixme.md](fixme.md) |
| `BUG` | Defeito rastreado com ticket | [bug.md](bug.md) |
| `SECURITY` | Vulnerabilidade de segurança | [security.md](security.md) |
| `XXX` | Código perigoso ou extremamente frágil | [xxx.md](xxx.md) |

## 🟠 Alta — Resolver antes do merge

| Tag | Significado | Arquivo |
|-----|-------------|---------|
| `HACK` | Solução temporária que funciona mas não é correta | [hack.md](hack.md) |
| `DEPRECATED` | Código obsoleto em processo de remoção | [deprecated.md](deprecated.md) |
| `REFACTOR` | Viola princípios de design — precisa de reestruturação | [refactor.md](refactor.md) |
| `CLEANUP` | Código desorganizado — código morto, imports não utilizados | [cleanup.md](cleanup.md) |

## 🟡 Média — Resolver na sprint

| Tag | Significado | Arquivo |
|-----|-------------|---------|
| `TODO` | Tarefa planejada ainda não implementada | [todo.md](todo.md) |
| `OPTIMIZE` | Oportunidade de otimização (teórica, sem problema atual) | [optimize.md](optimize.md) |
| `PERF` | Gargalo de performance medido causando problema real | [perf.md](perf.md) |
| `REVIEW` | Precisa de revisão especializada antes do merge | [review.md](review.md) |

## 🟢 Baixa — Informativa

| Tag | Significado | Arquivo |
|-----|-------------|---------|
| `NOTE` | Contexto importante de alta relevância | [note.md](note.md) |
| `INFO` | Detalhe técnico ou referência explicativa | [info.md](info.md) |
| `IDEA` | Sugestão não validada para exploração futura | [idea.md](idea.md) |
| `QUESTION` | Dúvida ou ambiguidade que precisa de resolução | [question.md](question.md) |

---

## Distinções importantes

| Par confundido | Diferença |
|----------------|-----------|
| `FIXME` vs `BUG` | FIXME = corrigir agora sem ticket; BUG = defeito rastreado |
| `HACK` vs `REFACTOR` | HACK = funciona mas é incorreto; REFACTOR = funciona mas viola design |
| `OPTIMIZE` vs `PERF` | OPTIMIZE = oportunidade teórica; PERF = problema medido |
| `NOTE` vs `INFO` | NOTE = alta importância, ler antes de modificar; INFO = detalhe opcional |
| `IDEA` vs `TODO` | IDEA = não validado; TODO = confirmado para implementação |

---

## Formato de marcação

```typescript
// TAG: descrição da violação — ação necessária
// TAG: #ticket descrição quando rastreado
// SECURITY: possível SQL injection — usar prepared statements
```
