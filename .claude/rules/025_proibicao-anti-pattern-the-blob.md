# Proibição do Anti-Pattern The Blob (God Object)

**ID**: STRUCTURAL-025
**Severity**: 🔴 Critical
**Category**: Structural

---

## What it is

Proíbe a criação de classes que concentram a maior parte da lógica e dados do sistema, resultando em um **Objeto Deus** (The Blob) que outras classes pequenas apenas orbitam e acessam.

*(O anti-pattern Large Class é o estágio inicial de um Blob: Large Class viola SRP por ter responsabilidades demais; The Blob adiciona o domínio de dados centralizados que outras classes apenas orbitam.)*

## Why it matters

- Viola o SRP de forma severa, concentrando lógica e dados em um único lugar
- Resulta na pior forma de acoplamento e baixa coesão do sistema
- Torna a classe praticamente impossível de testar isoladamente
- Deixa o sistema extremamente frágil a qualquer mudança na classe

## Objective Criteria

- [ ] Uma classe não deve conter mais de **10** métodos públicos (excluindo *getters* e *setters* permitidos).
- [ ] O número de dependências (imports) de classes concretas em uma única classe não deve exceder **5**.
- [ ] Se a classe violar os limites de `STRUCTURAL-007` (50 linhas) e `BEHAVIORAL-010` (7 métodos) deve ser classificada como um *Blob* e refatorada.

## Allowed Exceptions

- **Encapsulamento de Legado**: Grandes classes podem ser aceitas ao encapsular um sistema legado não-OO para acessá-lo a partir do sistema OO.

## How to Detect

### Manual

- Identificar classes que estão em constante modificação por vários *feature requests* diferentes

### Automatic

- Sem regra nativa de Biome para LCOM/WMC — avaliar via revisão de arquitetura (número de métodos públicos e dependências concretas)

## Related to

- [010 - Single Responsibility Principle (SRP)](010_principio-responsabilidade-unica.md): supersedes
- [007 - Maximum Lines per Class File](007_limite-maximo-linhas-classe.md): reinforces
- [039 - Boy Scout Rule (Continuous Refactoring)](039_regra-escoteiro-refatoracao-continua.md): complements
- [056 - Prohibition of Zombie Code (Lava Flow)](056_proibicao-codigo-zombie-lava-flow.md): reinforces
- [054 - Prohibition of Divergent Change](054_proibicao-mudanca-divergente.md): reinforces

---

**Created on**: 2025-10-08
**Updated on**: 2026-07-15
**Version**: 1.1
