# Priorização da Simplicidade e Clareza (Princípio KISS)

**ID**: STRUCTURAL-022
**Severity**: 🟠 High
**Category**: Structural

---

## What it is

Impõe que o design e o código devem ser mantidos o mais simples e direto possível, evitando soluções excessivamente inteligentes ou complexas quando uma alternativa clara existe.

## Why it matters

- Complexidade desnecessária é um débito que afeta legibilidade e manutenibilidade
- Soluções simples são mais fáceis de entender, testar e depurar
- Reduz a tendência a erros ao evitar caminhos de execução não óbvios
- Diminui o custo cognitivo de revisão de código

## Objective Criteria

- [ ] O **Índice de Complexidade Ciclomática (CC)** de qualquer método não deve exceder **5**.
- [ ] Funções e métodos devem realizar apenas uma única tarefa.
- [ ] É proibido o uso de metaprogramação ou recursos avançados da linguagem se o mesmo resultado puder ser alcançado com código direto.

## Allowed Exceptions

- **Bibliotecas de Infraestrutura**: Componentes de baixo nível (ex: *parser*, *serializer*) onde a complexidade é inerente à tarefa, mas isolada.

## How to Detect

### Manual

- Verificar se o código exige mais de 5 segundos de análise para entender seu propósito e fluxo de controle

### Automatic

- Biome: `complexity/noExcessiveCognitiveComplexity` (limita a complexidade acumulada de um método)

## Related to

- [001 - Single-Level Indentation Rule](001_nivel-unico-indentacao.md): reinforces
- [010 - Single Responsibility Principle (SRP)](010_principio-responsabilidade-unica.md): reinforces
- [021 - Prohibition of Logic Duplication (DRY)](021_proibicao-duplicacao-logica.md): complements
- [062 - Prohibition of Clever Code](062_proibicao-codigo-inteligente-clever-code.md): reinforces
- [064 - Prohibition of Overengineering](064_proibicao-overengineering.md): reinforces
- [068 - Prohibition of Golden Hammer](068_proibicao-martelo-de-ouro.md): reinforces
- [069 - Prohibition of Premature Optimization](069_proibicao-otimizacao-prematura.md): reinforces

---

**Created on**: 2025-10-08
**Updated on**: 2026-07-15
**Version**: 1.1
