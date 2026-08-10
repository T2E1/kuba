# ❌ ADR que não documenta decisão nenhuma

Correto em: `decision-record.valid.md`

## Variante 1 — a decisão que virou comentário de código

```js
// usamos JWT porque é mais simples (autor: João, 2024-01)
// não sei por que não usamos sessions, mas ficou assim
```

Problemas: não é encontrável, não tem contexto, e o próprio autor admite não
saber o que foi descartado. Daqui a um ano a discussão recomeça do zero.

## Variante 2 — o ADR vazio

```markdown
# ADR-025: Usar PostgreSQL

Decidimos usar PostgreSQL.
```

Falta tudo o que dá valor ao registro:

| Seção ausente | O que se perde |
|---|---|
| Contexto | Não dá para julgar se a decisão ainda vale quando o cenário mudar |
| Alternativas | Ninguém sabe se MongoDB foi avaliado e descartado, ou nem considerado |
| Consequências negativas | O time descobre o custo em produção, não no planejamento |
| Status e data | Não se sabe se ainda vigora |

Um ADR sem alternativas não documenta uma decisão — documenta uma preferência.
E preferência não sobrevive à primeira pessoa que discorda.
