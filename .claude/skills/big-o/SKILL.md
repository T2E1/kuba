---
name: big-o
model: opus
description: Analisa a complexidade algorítmica em notação Big-O — classificação por faixa, detecção do padrão de código que produz cada complexidade, limites de ação e técnicas de redução (Map/Set para busca O(1), ordenação prévia, memoization). Use ao avaliar métodos que iteram sobre coleções, fazem busca dentro de loop, combinam loops aninhados ou usam recursão, e ao investigar lentidão confirmada por medição. Não use para contagem de caminhos de execução — use a skill complexity; não use para otimizar sem medir antes.
---

# Big-O

## O que é

Big-O classifica como o custo de um algoritmo cresce conforme a entrada cresce. Não mede
velocidade absoluta — mede a *forma* do crescimento, que é o que decide se algo continua
funcionando quando a coleção dobra.

Distinção importante: `complexity` conta quantos caminhos existem no método; `big-o` conta
quanto ele custa. Um método com CC = 2 pode ser O(n²).

## Quando usar

| Situação | Ação |
|---|---|
| Loop dentro de loop sobre a mesma coleção | Classificar e avaliar alternativa linear |
| `find`, `includes` ou `indexOf` dentro de `map`/`forEach` | O(n²) oculto — trocar por Map/Set |
| Recursão com subproblemas repetidos | Avaliar memoization |
| Lentidão confirmada por profiling | Classificar antes de mexer |

**Não otimize sem medir.** A rule 069 é explícita: otimização sem profiling é otimização
prematura. Esta skill se aplica quando O(n²) ou pior está confirmado no código *e* a
coleção pode crescer. Para `n` pequeno e fixo, O(n²) legível ganha de O(n) obscuro.

## Como aplicar

### Classificação

| Notação | Nome | Severidade |
|---|---|---|
| O(1) | Constante | Ideal |
| O(log n) | Logarítmica | Ideal |
| O(n) | Linear | Aceitável |
| O(n log n) | Log-linear | Aceitável |
| O(n²) | Quadrática | Aviso |
| O(n³) | Polinomial | Crítica |
| O(2ⁿ) | Exponencial | Crítica |
| O(n!) | Fatorial | Crítica |

### Detecção pelo padrão de código

| Estrutura | Big-O |
|---|---|
| Acesso por índice ou chave — `map.get()`, `array[i]`, `object.prop` | O(1) |
| Divisão por metade — busca binária | O(log n) |
| Loop simples — `for`, `for...of`, `map`, `filter`, `reduce` | O(n) |
| `array.sort()` | O(n log n) |
| Loop dentro de loop — `for { for }`, `map { find }`, `forEach { filter }` | O(n²) |
| Aninhamento triplo | O(n³) |
| Recursão que dobra sem cache — `f(n-1) + f(n-2)` | O(2ⁿ) |
| Permutações completas | O(n!) |

### Combinações que enganam

| Código | Resultado |
|---|---|
| `array.filter().map()` | O(n) — duas passagens lineares |
| `array.sort().filter()` | O(n log n) — o sort domina |
| `array.map(x => other.find(...))` | O(n·m) — quadrático se n ≈ m |
| `array.map(x => other.includes(x))` | O(n·m) — quadrático se n ≈ m |
| `array.forEach(x => set.has(x))` | O(n) — `Set.has` é O(1) |

### Ação por faixa

| Big-O | Ação |
|---|---|
| O(1), O(log n), O(n), O(n log n) | Nenhuma |
| O(n²) | Avaliar alternativa linear; marcar `OPTIMIZE` se `n` puder crescer |
| O(n³) | Refatoração obrigatória; marcar `FIXME` |
| O(2ⁿ) | Memoization ou programação dinâmica |
| O(n!) | Substituir por heurística ou limitar a entrada |

### Técnicas de redução

| De | Para | Como |
|---|---|---|
| O(n²) com busca interna | O(n) | Trocar o loop interno por `Map`/`Set` — busca O(1) |
| O(n²) comparando pares | O(n log n) | Ordenar antes e usar busca binária |
| O(n²) com `filter` dentro de loop | O(n) | Pré-computar um `Set` com os valores filtrados |
| O(2ⁿ) recursivo | O(n) | Memoization |
| O(n) com várias passagens | O(n) numa passagem | Combinar as operações numa iteração |

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Duplicados: loop aninhado O(n²) vs. `Set` O(n) | [find-duplicates.valid.js](examples/find-duplicates.valid.js) | [find-duplicates.invalid.js](examples/find-duplicates.invalid.js) |
| O(n²) oculto: `find` dentro de `map` | [hidden-quadratic.valid.js](examples/hidden-quadratic.valid.js) | [hidden-quadratic.invalid.js](examples/hidden-quadratic.invalid.js) |

## Checklist

- [ ] Nenhum loop aninhado sobre coleção que pode crescer
- [ ] Nenhum `find`/`includes`/`indexOf` dentro de `map`/`forEach`/`filter`
- [ ] Nenhuma recursão com subproblemas repetidos sem memoization
- [ ] Nenhum `sort()` consecutivo sobre a mesma coleção
- [ ] Toda otimização aplicada tem medição que a justifique (rule 069)
- [ ] A versão otimizada continua legível — senão, virou Clever Code (rule 062)

## Troubleshooting

### Troquei O(n²) por O(n) e o código ficou mais lento

**Causa:** `n` é pequeno. A constante do `Map` (alocação, hashing) supera o ganho
assintótico em coleções de dezenas de itens.
**Solução:** Big-O descreve crescimento, não custo absoluto. Para `n` pequeno e fixo,
manter o simples — e é exatamente o que a rule 069 previne.

### A otimização deixou o código ilegível

**Causa:** ganho assintótico comprado com clareza.
**Solução:** se o profiling não aponta este trecho como gargalo, reverter (rules 062 e
069). Se aponta, manter e documentar o porquê com a medição junto (rule 026).

### O loop aninhado é sobre coleções diferentes

**Causa:** `n·m` só é quadrático quando `n ≈ m`.
**Solução:** se uma das coleções é pequena e limitada, o custo é efetivamente linear.
Classificar com os tamanhos reais, não com a forma do código.

## Rules relacionadas

- [069 — Proibição de Otimização Prematura](../../rules/069_proibicao-otimizacao-prematura.md): condiciona toda aplicação desta skill a haver medição.
- [062 — Proibição de Código Inteligente](../../rules/062_proibicao-codigo-inteligente-clever-code.md): o limite de até onde vale trocar clareza por desempenho.
- [001 — Nível Único de Indentação](../../rules/001_nivel-unico-indentacao.md): loop aninhado viola a regra antes mesmo de virar problema de performance.
- [010 — Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): loops aninhados costumam ser duas responsabilidades no mesmo método.
- [039 — Regra do Escoteiro](../../rules/039_regra-escoteiro-refatoracao-continua.md): melhorar o algoritmo do trecho tocado faz parte da refatoração contínua.

## Skills relacionadas

- [complexity](../complexity/SKILL.md): complements — caminhos de execução vs. custo de execução.
- [anti-pattern](../anti-pattern/SKILL.md): reinforces — Premature Optimization é a violação que esta skill mais arrisca causar.
- [codetags](../codetags/SKILL.md): depends on — O(n²) aceito por ora vira `OPTIMIZE`; O(n³) vira `FIXME`.
- [quality](../quality/SKILL.md): reinforces — é a métrica objetiva por trás do fator Efficiency.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-09
**Versão**: 2.0
