---
name: cdd
model: opus
description: Cognitive-Driven Development — mede a carga cognitiva de um método pela métrica ICP (complexidade ciclomática + aninhamento + responsabilidades + acoplamento), com limiares de ação e processo de revisão em três passos. Use ao avaliar se um método é complexo demais e precisar de número em vez de opinião, ao priorizar qual código refatorar primeiro entre vários candidatos, ou ao justificar objetivamente a aprovação ou rejeição de um PR. Não use como substituto da contagem de CC — a skill complexity calcula o componente base que esta consome.
---

# CDD (Cognitive-Driven Development)

## O que é

Metodologia que mede o que a complexidade ciclomática sozinha não captura: quanto um
método custa para um humano **entender**. Dois métodos com CC = 5 podem ter cargas
cognitivas muito diferentes se um deles aninha três níveis e depende de seis colaboradores.

A métrica é o **ICP** (Intrinsic Complexity Points), somando quatro componentes:

```
ICP = CC_base + Aninhamento + Responsabilidades + Acoplamento
```

## Quando usar

| Situação | Ação |
|---|---|
| "Este código é complexo" sem métrica | Calcular ICP e substituir a opinião pelo número |
| Vários candidatos a refatoração | Priorizar pelo ICP mais alto |
| PR com método acima de 10 linhas ou aninhamento visível | Rodar o processo de três passos |
| Decidir se aprova ou rejeita | Usar o limiar mais o contexto |

Não use para contar caminhos de execução — isso é `complexity`, que produz o `CC_base`
consumido aqui. Não calcule ICP sem ler o código: a métrica exige julgamento sobre
responsabilidades, não só contagem.

## Como aplicar

### Limiares

| ICP | Status | Ação |
|---|---|---|
| ≤ 3 | 🟢 Excelente | Manter |
| 4–6 | 🟡 Aceitável | Considerar refatoração |
| 7–10 | 🟠 Preocupante | Refatorar antes da próxima feature |
| > 10 | 🔴 Crítico | Refatoração obrigatória |

Meta do projeto: ICP médio ≤ 4, e zero métodos acima de 10.

### Os quatro componentes

| Componente | O que mede | Referência |
|---|---|---|
| `CC_base` | Caminhos independentes de execução | [cc-base.md](references/cc-base.md) |
| Aninhamento | Profundidade dos blocos — cada nível pesa mais que o anterior | [nesting.md](references/nesting.md) |
| Responsabilidades | Quantas das 8 dimensões o método toca | [responsibilities.md](references/responsibilities.md) |
| Acoplamento | Quantos colaboradores externos precisa conhecer | [coupling.md](references/coupling.md) |

Fórmula completa em [icp-formula.md](references/icp-formula.md).

### Processo de revisão em três passos

1. **Varredura (2–5 min)** — localizar candidatos: funções acima de 20 linhas,
   aninhamento de 3+ níveis, anti-patterns evidentes (The Blob, Pyramid of Doom).
2. **Análise (10–20 min)** — para cada candidato: calcular ICP, verificar as rules
   críticas (`eval`, `return null`, imports relativos) e comentar no PR com o número e
   a rule violada.
3. **Calibração (5 min)** — decidir pela combinação de ICP e contexto. ICP 6–7 num
   hotfix não bloqueia; ICP > 10 bloqueia em qualquer contexto.

Aplicação em code review detalhada em [code-review-application.md](references/code-review-application.md).

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Cálculo de ICP com os quatro componentes decompostos | [icp-calculation.valid.md](examples/icp-calculation.valid.md) | [icp-calculation.invalid.md](examples/icp-calculation.invalid.md) |

## Checklist

- [ ] Nenhum método com ICP acima de 10
- [ ] ICP médio do módulo ≤ 4
- [ ] O ICP foi calculado lendo o código, não estimado pelo tamanho
- [ ] O comentário de PR cita o número e a rule, não só a impressão
- [ ] A calibração considerou o contexto (hotfix, legado) antes de bloquear

## Troubleshooting

### CC está baixa mas o ICP está alto

**Causa:** exatamente o que a métrica existe para revelar. O peso está em aninhamento,
responsabilidades ou acoplamento — não em ramificação.
**Solução:** identificar qual componente domina e atacar esse. Acoplamento alto pede
injeção (rule 014); responsabilidades demais pedem extração de classe (rule 010).

### Dois revisores calculam ICPs diferentes para o mesmo método

**Causa:** o componente de responsabilidades depende de julgamento sobre as 8 dimensões.
**Solução:** conferir `references/responsibilities.md`. Diferença de 1 ponto é tolerável;
diferença de 4 indica que os dois estão contando dimensões diferentes.

### O ICP caiu mas o código não melhorou

**Causa:** complexidade espalhada em vez de eliminada — a mesma redução falsa que a skill
`complexity` descreve.
**Solução:** medir o ICP do conjunto de métodos que participam do fluxo, não de um só.

## Referências

- `references/icp-formula.md` — a fórmula completa e como somar cada componente.
- `references/cc-base.md`, `nesting.md`, `responsibilities.md`, `coupling.md` — um por componente.
- `references/code-review-application.md` — o processo de três passos aplicado a um PR real.

## Rules relacionadas

- [022 — Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md): o limite CC ≤ 5 alimenta o `CC_base`.
- [001 — Nível Único de Indentação](../../rules/001_nivel-unico-indentacao.md): o componente de aninhamento é a medida dessa regra.
- [010 — Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): o componente de responsabilidades quantifica SRP.
- [014 — Inversão de Dependência](../../rules/014_principio-inversao-dependencia.md): reduzir acoplamento é reduzir esse componente.
- [055 — Limite de Linhas por Método](../../rules/055_limite-maximo-linhas-metodo.md): o gatilho da varredura do passo 1.

## Skills relacionadas

- [complexity](../complexity/SKILL.md): depends on — produz o `CC_base` que esta métrica consome.
- [quality](../quality/SKILL.md): complements — quantifica Maintainability e Testability do modelo McCall.
- [anti-pattern](../anti-pattern/SKILL.md): reinforces — os candidatos da varredura são anti-patterns nomeados.
- [codetags](../codetags/SKILL.md): complements — ICP alto aceito por ora vira `REFACTOR` rastreável.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-09
**Versão**: 2.0
