# Restrição de Nível Único de Indentação por Método

**ID**: STRUCTURAL-001
**Severity**: 🟠 High
**Category**: Structural

---

## What it is

Limita a complexidade de um método ou função ao impor um único nível de indentação para blocos de código (condicionais, *loops* ou *try-catch*), forçando a extração de lógica em métodos separados.

## Why it matters

- Reduz drasticamente a Complexidade Ciclomática (CC) do método
- Melhora a legibilidade ao eliminar aninhamento visual profundo
- Facilita a escrita de testes unitários focados em um único caminho de execução
- Força a extração de lógica em métodos nomeados e testáveis isoladamente

## Objective Criteria

- [ ] Métodos e funções devem conter, no máximo, um único nível de indentação de bloco de código (após o escopo inicial do método).
- [ ] O uso de *guard clauses* para retornos antecipados não conta como um novo nível de indentação.
- [ ] Funções anônimas passadas como *callbacks* não devem introduzir um segundo nível de indentação no método pai.

## Allowed Exceptions

- **Estruturas de Controle Específicas**: *Try/Catch/Finally* em escopo de tratamento de erro que não possa ser delegado.

## How to Detect

### Manual

- Verificar a existência de um bloco de código aninhado (ex: um `if` dentro de um `for`, ou um `for` dentro de um `if`)
- Ler o método de cima a baixo: se o olho precisa "descer degraus" de indentação, há aninhamento a extrair

### Automatic

- Biome: `complexity/noExcessiveCognitiveComplexity` (penaliza aninhamento e complexidade acumulada no método)

## Related to

- [002 - Prohibition of ELSE Clause](002_proibicao-clausula-else.md): reinforces
- [007 - Maximum Lines per Class File](007_limite-maximo-linhas-classe.md): complements
- [022 - Simplicity and Clarity (KISS)](022_priorizacao-simplicidade-clareza.md): reinforces
- [010 - Single Responsibility Principle (SRP)](010_principio-responsabilidade-unica.md): complements
- [011 - Open/Closed Principle (OCP)](011_principio-aberto-fechado.md): reinforces

---

**Created on**: 2025-10-04
**Updated on**: 2026-07-15
**Version**: 1.1
