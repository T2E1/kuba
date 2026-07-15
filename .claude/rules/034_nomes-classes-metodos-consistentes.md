# Nomes de Classes e Métodos Consistentes (Funções são Verbos)

**ID**: STRUCTURAL-034
**Severity**: 🟠 High
**Category**: Structural

---

## What it is

Exige que nomes de classes sejam **substantivos singulares** (ex: `User`, `Order`) e que nomes de métodos sejam **verbos ou frases verbais** que descrevem a intenção (ex: `calculateFee`, `sendNotification`).

## Why it matters

- A consistência de nomenclatura é fundamental para legibilidade e previsibilidade
- Uma violação quebra o modelo mental do leitor sobre o que é dado e o que é ação
- Aumenta o custo cognitivo e o risco de má interpretação da intenção do código
- Facilita prever o comportamento de uma API só pelo nome, sem ler a implementação

## Objective Criteria

- [ ] Nomes de classes e interfaces devem ser substantivos e usar `PascalCase`.
- [ ] Nomes de métodos públicos devem começar com um verbo (ex: `get`, `create`, `validate`) e usar `camelCase`.
- [ ] Variáveis que armazenam valores booleanos (predicados) devem usar prefixos claros (ex: `is`, `has`, `can`).

## Allowed Exceptions

- **Factories/Builders**: Classes com o sufixo `Factory` ou `Builder` são aceitas, pois seu papel é estritamente criacional.

## How to Detect

### Manual

- Verificar classes que terminam em verbos (`Manager`, `Processor`) ou funções com nomes de substantivos (`User`)

### Automatic

- Biome: `style/useNamingConvention` (aplica `PascalCase`/`camelCase`; a semântica substantivo/verbo continua sendo verificada em revisão de código)

## Related to

- [006 - Prohibition of Abbreviated Names](006_proibicao-nomes-abreviados.md): reinforces
- [010 - Single Responsibility Principle (SRP)](010_principio-responsabilidade-unica.md): reinforces
- [035 - Prohibition of Misleading Names](035_proibicao-nomes-enganosos.md): complements

---

**Created on**: 2025-10-08
**Updated on**: 2026-07-15
**Version**: 1.1
