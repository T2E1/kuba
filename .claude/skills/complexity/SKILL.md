---
name: complexity
model: opus
description: Mede e reduz a complexidade ciclomática de métodos, mantendo CC ≤ 5 conforme a rule 022 — regras de contagem, tabela de limites por faixa e técnicas de redução (guard clause, extração de método, function map, polimorfismo). Use ao escrever ou refatorar métodos com `if`, `for`, `while`, `switch`, `catch` ou ternário, ao receber aviso de noExcessiveCognitiveComplexity do Biome, ou ao decidir se um método precisa ser quebrado. Não use para complexidade algorítmica de performance — use a skill big-o.
---

# Complexity

## O que é

Complexidade ciclomática (CC) conta os caminhos independentes de execução de um método.
Um método sem ramificação tem CC = 1; cada estrutura de controle soma +1. O limite deste
repositório é **CC ≤ 5**, definido pela rule 022.

É a métrica objetiva por trás de várias regras qualitativas: aninhamento, `else`, método
longo e responsabilidade múltipla aparecem todos como CC alto.

## Quando usar

| Situação | Ação |
|---|---|
| Escrevendo método com controle de fluxo | Contar CC antes de considerar pronto |
| Biome sinalizou `noExcessiveCognitiveComplexity` | Aplicar as técnicas de redução |
| Método difícil de testar | CC indica quantos caminhos o teste precisa cobrir |
| Decidindo se quebra o método | CC > 5 responde pela decisão |

Não use para performance — quantos caminhos existem é `complexity`; quanto o algoritmo
custa conforme a entrada cresce é `big-o`. Um método pode ter CC = 2 e ser O(n²).

## Como aplicar

### Contagem

Base 1, mais 1 para cada `if`, `else if`, `for`, `while`, `do`, `case`, `catch`, `&&`,
`||` e operador ternário. Detalhe completo em
[cc-counting-rules.md](references/cc-counting-rules.md).

### Limites

| CC | Status | Ação |
|---|---|---|
| 1–5 | ✅ Dentro do limite | Nenhuma |
| 6–7 | ⚠️ Aviso | Considerar refatoração |
| 8–10 | 🟠 Alta | Refatoração obrigatória (rule 022) |
| > 10 | 🔴 Crítica | Refatoração urgente; provável Spaghetti Code (rule 060) |

### Redução

1. **Guard clause** — troque `if` aninhado por retorno antecipado. Derruba o
   aninhamento e o `else` de uma vez (rules 001 e 002).
2. **Extração de método** — cada bloco condicional com nome próprio vira um método.
   CC se distribui, e cada parte fica testável isolada.
3. **Function map** — `switch` com mais de 3 casos vira um objeto de funções indexado.
4. **Polimorfismo** — ramificação por *tipo* vira uma classe por tipo (rule 011).

Técnicas detalhadas em [refactoring-techniques.md](references/refactoring-techniques.md).

Cuidado com a redução falsa: mover um bloco para outro método sem simplificar a decisão
apenas realoca a CC. O total do fluxo continua o mesmo, e agora está espalhado.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| CC 7 reduzida para 2 por método (guard clause + extração) | [reduce-cc.valid.js](examples/reduce-cc.valid.js) | [reduce-cc.invalid.js](examples/reduce-cc.invalid.js) |

## Checklist

- [ ] Nenhum método com CC acima de 5
- [ ] Nenhum `else` ou `else if` (rule 002)
- [ ] Nenhum bloco aninhado além do primeiro nível (rule 001)
- [ ] Nenhum `switch` com mais de 3 casos ramificando por tipo (rule 011)
- [ ] `bun run lint` sem `noExcessiveCognitiveComplexity` pendente
- [ ] A extração reduziu a decisão, não apenas mudou o código de lugar

## Troubleshooting

### Extraí métodos e a CC total não caiu

**Causa:** redução falsa — os `if` foram movidos, não eliminados.
**Solução:** atacar a decisão em si. Guard clause elimina ramo; function map elimina
`switch`; polimorfismo elimina a ramificação por tipo inteira.

### CC está em 5 mas o método continua difícil de ler

**Causa:** CC não mede aninhamento nem carga cognitiva — `noExcessiveCognitiveComplexity`
do Biome mede, e penaliza profundidade.
**Solução:** aplicar a rule 001 (nível único de indentação) e conferir com a skill `cdd`,
que quantifica carga cognitiva.

### O método é uma máquina de estados e a CC é inerente

**Causa:** exceção legítima da rule 060 — `switch` bem documentado de máquina de estados.
**Solução:** manter, documentar o porquê (rule 026) e garantir que cada `case` encerre a
execução.

## Referências

- `references/cc-counting-rules.md` — o que soma +1 e o que não soma.
- `references/refactoring-techniques.md` — cada técnica de redução com antes e depois.

## Rules relacionadas

- [022 — Simplicidade e Clareza (KISS)](../../rules/022_priorizacao-simplicidade-clareza.md): fixa o limite CC ≤ 5.
- [001 — Nível Único de Indentação](../../rules/001_nivel-unico-indentacao.md): aninhamento é o maior gerador de CC.
- [002 — Proibição da Cláusula ELSE](../../rules/002_proibicao-clausula-else.md): cada `else if` soma +1.
- [010 — Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): CC alta é sintoma de responsabilidades misturadas.
- [055 — Limite de Linhas por Método](../../rules/055_limite-maximo-linhas-metodo.md): 15 linhas limitam naturalmente o espaço para ramificar.
- [060 — Proibição de Código Spaghetti](../../rules/060_proibicao-codigo-spaghetti.md): CC > 15 é o critério objetivo de spaghetti.

## Skills relacionadas

- [cdd](../cdd/SKILL.md): depends on — o ICP usa a CC calculada aqui como componente CC_base.
- [calisthenics](../calisthenics/SKILL.md): reinforces — as regras 1 e 2 são o caminho mais curto para CC baixa.
- [big-o](../big-o/SKILL.md): complements — caminhos de execução vs. custo de execução.
- [anti-pattern](../anti-pattern/SKILL.md): complements — Spaghetti Code e Pyramid of Doom medidos por CC.
- [quality](../quality/SKILL.md): reinforces — CC é a métrica objetiva por trás de Maintainability.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-09
**Versão**: 2.0
