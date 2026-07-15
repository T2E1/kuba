# Proibição da Pirâmide do Destino

**ID**: AP-23-066
**Severity**: 🟠 High
**Category**: Structural

---

## What it is

Pirâmide do Destino (ou Arrow Anti-Pattern) ocorre quando há aninhamento excessivo de condicionais (`if`/`else`) e loops que cria uma estrutura visual de pirâmide ou seta. Cada nível de aninhamento adiciona complexidade cognitiva e aumenta o Índice de Complexidade Ciclomática. O caminho feliz está enterrado profundamente dentro em vez de no nível zero. Versão síncrona de Callback Hell.

## Why it matters

- Leitura não-linear: desenvolvedores não conseguem seguir fluxo de cima para baixo; precisam rastrear aninhamento
- Bugs em casos extremos: caminhos aninhados raramente testados; bugs frequentemente encontrados em níveis profundos
- Dificuldade de adicionar condições: cada nova validação aumenta aninhamento; refatoração requer reindentação
- Inflação de complexidade: validações simples se transformam em estruturas complexas com ifs aninhados
- Alta Complexidade Ciclomática: cada nível dobra o número de caminhos de execução possíveis

## Objective Criteria

- [ ] Código com 4+ níveis de aninhamento de if/else/loops
- [ ] `if` dentro de `if` dentro de `for` dentro de `if` — padrão de pirâmide visual
- [ ] Complexidade Ciclomática > 10 na mesma função
- [ ] Caminho feliz está no nível de aninhamento 3+ em vez de nível zero
- [ ] Múltiplos statements `else` sem early return/guard clauses

## Allowed Exceptions

- Código legado onde refatoração imediata traria alto risco sem ganho claro
- Código de parser ou máquinas de estado necessariamente complexos por especificação externa
- Event handlers onde múltiplas validações são obrigatórias e não podem ser extraídas

## How to Detect

### Manual

- Varredura visual: procurar código com formato de seta com aninhamento
- Buscar código onde adicionar nova validação requer reindentar tudo abaixo
- Identificar funções onde nunca fazem early return; todos os caminhos aninhados em else

### Automatic

- Biome: `complexity/noExcessiveCognitiveComplexity`, `style/noUselessElse`

## Related to

- [002 - Prohibition of ELSE Clause](002_proibicao-clausula-else.md): reinforces
- [001 - Single-Level Indentation Rule](001_nivel-unico-indentacao.md): reinforces
- [060 - Prohibition of Spaghetti Code](060_proibicao-codigo-spaghetti.md): complements
- [063 - Prohibition of Callback Hell](063_proibicao-inferno-callbacks.md): complements
- [027 - Domain Error Handling Quality](027_qualidade-tratamento-erros-dominio.md): reinforces

---

**Created on**: 2026-03-28
**Updated on**: 2026-07-15
**Version**: 1.1
