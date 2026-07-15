# Proibição de Otimização Prematura

**ID**: AP-10-069
**Severity**: 🟡 Medium
**Category**: Behavioral

---

## What it is

Otimização Prematura ocorre quando o desenvolvedor otimiza código baseado em suspeita de lentidão, sem medir o problema real. Código legível e correto é sacrificado por ganho de performance hipotético. Donald Knuth: *"A otimização prematura é a raiz de todo mal."*

## Why it matters

- Complexidade acidental: código mais difícil de ler sem ganho mensurável
- Tempo desperdiçado: otimizações em código que não é gargalo não entregam valor
- Bugs introduzidos: código otimizado é mais frágil e difícil de corrigir
- Manutenção cara: otimizações prematuras são difíceis de desfazer depois

## Objective Criteria

- [ ] Otimização implementada sem medição prévia (profiling, benchmark, métricas de produção)
- [ ] Algoritmo complexo onde O(n²) seria imperceptível no volume real de dados
- [ ] Cache manual em camadas que já possuem caching nativo (ORM, banco de dados, HTTP)
- [ ] Micro-otimizações de linguagem (`for` vs `map`, `++i` vs `i++`) em código não-crítico
- [ ] Comentário justificando ilegibilidade com "é mais rápido" sem evidência

## Allowed Exceptions

- **Hotspots Comprovados**: Otimizações em código cuja lentidão foi identificada por profiling com dados reais de produção.
- **Algoritmos Canônicos**: Uso de algoritmos conhecidos (quicksort, busca binária) onde a escolha é padrão da indústria, não especulativa.

## How to Detect

### Manual

- Perguntar: "há uma medição provando que isso é um gargalo?" — se a resposta é não, é otimização prematura

### Automatic

- Sem regra nativa de Biome para detectar otimização prematura — identificar via code review (caches manuais, estruturas de dados incomuns sem profiling referenciado)

## Related to

- [022 - Simplicity and Clarity (KISS)](022_priorizacao-simplicidade-clareza.md): reinforces
- [023 - Prohibition of Speculative Functionality (YAGNI)](023_proibicao-funcionalidade-especulativa.md): complements
- [062 - Prohibition of Clever Code](062_proibicao-codigo-inteligente-clever-code.md): reinforces
- [064 - Prohibition of Overengineering](064_proibicao-overengineering.md): complements
- [070 - Prohibition of Shared Mutable State](070_proibicao-estado-mutavel-compartilhado.md): complements

---

**Created on**: 2026-03-29
**Updated on**: 2026-07-15
**Version**: 1.1
