# Proibição de Nomes Abreviados e Acrônimos Ambíguos

**ID**: STRUCTURAL-006
**Severity**: 🟡 Medium
**Category**: Structural

---

## What it is

Exige que nomes de variáveis, métodos, classes e parâmetros sejam completos, autoexplicativos e não utilizem abreviações ou acrônimos que não sejam amplamente reconhecidos no domínio do problema.

## Why it matters

- A clareza do código depende diretamente da clareza dos nomes
- Abreviações reduzem a legibilidade e tornam o código menos pesquisável
- Forçam o leitor a decodificar significado sem contexto
- Aumentam o custo cognitivo de manutenção e o tempo de onboarding

## Objective Criteria

- [ ] Nomes de classes, métodos e variáveis devem ter, no mínimo, 3 caracteres (exceto exceções).
- [ ] Acrônimos (ex: `Mngr` para `Manager`, `Calc` para `Calculate`) são proibidos, exceto exceções.
- [ ] Nomes devem representar o significado sem a necessidade de olhar a documentação.

## Allowed Exceptions

- **Convenções de Loop**: Variáveis de iteração únicas e de curta duração (ex: `i`, `j`).
- **Acrônimos Ubíquos**: Acrônimos comuns na indústria (ex: `ID`, `URL`, `API`, `HTTP`).

## How to Detect

### Manual

- Buscar nomes de variáveis que sejam incompreensíveis para um leitor novo sem contexto

### Automatic

- Biome: `style/useNamingConvention` (aplica convenção de nomes; o limite mínimo de caracteres continua sendo verificado em revisão de código)

## Related to

- [005 - Method Chaining Restriction](005_maximo-uma-chamada-por-linha.md): complements
- [003 - Primitive Domain Encapsulation](003_encapsulamento-primitivos.md): reinforces
- [024 - Prohibition of Magic Constants](024_proibicao-constantes-magicas.md): complements
- [026 - Comment Quality: Why, Not What](026_qualidade-comentarios-porque.md): reinforces
- [034 - Consistent Class and Method Names](034_nomes-classes-metodos-consistentes.md): reinforces
- [035 - Prohibition of Misleading Names](035_proibicao-nomes-enganosos.md): complements
- [022 - Simplicity and Clarity (KISS)](022_priorizacao-simplicidade-clareza.md): complements

---

**Created on**: 2025-10-04
**Updated on**: 2026-07-15
**Version**: 1.1
