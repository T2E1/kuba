---
name: codetags
model: haiku
description: Marca o código com tags de comentário padronizadas no formato `// TAG(rule-id): descrição` — TODO, FIXME, OPTIMIZE, REFACTOR, HACK, SECURITY, DEPRECATED e as demais, cada uma com severidade e ação própria. Use ao registrar débito técnico que não será corrigido agora, ao anotar uma violação de rule encontrada em revisão, ao marcar bug conhecido, otimização pendente ou problema de segurança que precise ficar rastreável no código-fonte. Não use como substituto de correção quando corrigir é possível na hora.
---

# Codetags

## O que é

Convenção de marcação no código-fonte para dívida técnica rastreável. Uma codetag tem
formato fixo, aponta a rule violada e explica o impacto — não apenas o sintoma.

```
// TAG(rule-id): descrição do impacto e do caminho de correção
```

A diferença para um comentário livre: a tag é buscável globalmente por tipo e severidade,
e a descrição ensina em vez de apenas sinalizar.

## Quando usar

| Situação | Ação |
|---|---|
| Violação encontrada em revisão que não será corrigida agora | Marcar com a tag da severidade |
| Bug conhecido sem correção imediata | `FIXME` |
| O(n²) aceito por ora, mas `n` pode crescer | `OPTIMIZE` |
| ICP ou CC acima do limite em código que não será tocado agora | `REFACTOR` |
| Solução temporária consciente | `HACK` com a justificativa |
| API pública em vias de sair | `DEPRECATED` com o substituto |

Não marque o que pode ser corrigido agora — a Regra do Escoteiro (rule 039) pede a
correção, não a anotação. Codetag é para o que fica fora do escopo, deliberadamente.

## Como aplicar

### Princípios

| Princípio | O que significa |
|---|---|
| Ensinar | A descrição explica o porquê e o caminho, não só o sintoma |
| Buscável | Tag padronizada permite varredura global por tipo |
| Ação clara | A tag escolhida já indica que tipo de trabalho é |
| Tom de parceiro | Escrita como colega explicando, não como auditoria |

### Regras de aplicação

| Regra | Detalhe |
|---|---|
| Uma tag por violação | A violação principal decide a tag; não empilhe |
| Linha acima | A tag vai imediatamente acima do trecho afetado |
| Sem duplicação | Tag já existente é atualizada, não somada |
| Explicar o impacto | O que pode dar errado por causa disso |
| Uma linha de descrição | Problema e correção sugerida, conciso |

### Escolha da tag pela severidade

A severidade vem do fator de qualidade impactado (skill `quality`), não da impressão:

| Fator McCall | Tag |
|---|---|
| Integrity | `SECURITY` ou `FIXME` |
| Correctness, Reliability | `FIXME` |
| Efficiency | `OPTIMIZE` |
| Maintainability, Flexibility | `REFACTOR` |
| Qualquer um, com prazo definido | `TODO` |

Mapeamento completo em [reviewer-mapping.md](references/reviewer-mapping.md); as 16 tags
com severidade e uso em [tags-reference.md](references/tags-reference.md).

### Fluxo

1. Identificar a violação e a rule correspondente.
2. Localizar a linha exata.
3. Escolher a tag pela severidade do fator impactado.
4. Escrever a descrição explicando impacto e correção.
5. Conferir que não há tag duplicada no mesmo trecho.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Tag que ensina vs. comentário livre e vago | [codetag.valid.js](examples/codetag.valid.js) | [codetag.invalid.js](examples/codetag.invalid.js) |

## Checklist

- [ ] Toda tag tem descrição — nenhuma tag vazia
- [ ] Uma tag por trecho, escolhida pela violação principal
- [ ] A rule está citada entre parênteses
- [ ] A descrição diz o impacto, não só o sintoma
- [ ] `FIXME` reservado para violação crítica de verdade
- [ ] Nada foi marcado que poderia ter sido corrigido no mesmo commit

## Troubleshooting

### O código encheu de `TODO` que ninguém resolve

**Causa:** codetag usada como substituto de correção, e não como registro do que ficou
fora do escopo.
**Solução:** aplicar a rule 023 — acima de 5% de linhas marcadas, o problema deixou de
ser rastreabilidade e virou Lava Flow (rule 056).

### Tudo virou `FIXME`

**Causa:** severidade atribuída por impressão em vez do fator de qualidade impactado.
**Solução:** usar o mapeamento da skill `quality`. `FIXME` é Correctness, Reliability ou
Integrity — o resto tem tag própria.

### A tag não diz o que fazer

**Causa:** descrição registrando o sintoma (`// FIXME: validação não funciona`).
**Solução:** descrever o impacto e o caminho: o que pode dar errado, e qual a correção.

## Referências

- `references/tags-reference.md` — as 16 tags por severidade, com link para cada uma.
- `references/reviewer-mapping.md` — mapeamento de severidade para tag.
- `references/<tag>.md` — uma por tag, com quando usar e quando não usar.

## Rules relacionadas

- [026 — Qualidade de Comentários: o Porquê](../../rules/026_qualidade-comentarios-porque.md): as tags são a exceção explícita — marcação especial permitida, desde que ensine.
- [039 — Regra do Escoteiro](../../rules/039_regra-escoteiro-refatoracao-continua.md): define a fronteira entre corrigir e marcar.
- [023 — Funcionalidade Especulativa](../../rules/023_proibicao-funcionalidade-especulativa.md): limita a 5% as linhas marcadas como pendentes.
- [056 — Proibição de Código Zombie](../../rules/056_proibicao-codigo-zombie-lava-flow.md): tag sem prazo acumulada vira Lava Flow.
- [024 — Proibição de Constantes Mágicas](../../rules/024_proibicao-constantes-magicas.md): o formato padronizado elimina marcação ad-hoc.

## Skills relacionadas

- [quality](../quality/SKILL.md): depends on — o fator McCall impactado decide a tag.
- [anti-pattern](../anti-pattern/SKILL.md): depends on — a tag registra o anti-pattern nomeado que não será refatorado agora.
- [cdd](../cdd/SKILL.md): complements — ICP alto aceito por ora vira `REFACTOR` com o número junto.
- [big-o](../big-o/SKILL.md): complements — O(n²) tolerado vira `OPTIMIZE`; O(n³) vira `FIXME`.
- [clean-code](../clean-code/SKILL.md): complements — registra o que a Regra do Escoteiro deixou fora do escopo.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-09
**Versão**: 2.0
