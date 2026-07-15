# Proibição de Imports Relativos (Obrigatoriedade de Path Aliases)

**ID**: STRUCTURAL-031
**Severity**: 🔴 Critical
**Category**: Structural

---

## What it is

Proíbe **completamente** o uso de caminhos relativos com `../` e impõe o uso obrigatório de *path aliases* para todos os imports entre módulos.

## Why it matters

- *Imports* relativos quebram a portabilidade do código entre diretórios
- Prejudicam a legibilidade ao exigir contar níveis de `../../../`
- Dificultam refatoração, pois mover um arquivo quebra caminhos relativos distantes
- Reforçam a Arquitetura Limpa ao garantir que módulos sejam sempre referenciados por aliases (`@agent`, `@dom`, `@event`, etc.)

## Objective Criteria

- [ ] É **proibido** o uso de `../` em qualquer caminho de *import*.
- [ ] Todos os módulos devem ser importados exclusivamente por *path aliases* (ex: `import { X } from "@dom/html"`).
- [ ] Apenas imports do mesmo diretório (`./file`) são permitidos para arquivos irmãos.
- [ ] O arquivo de configuração (`vite.config.js` ou `tsconfig.json`) deve definir todos os *paths* necessários.

## Allowed Exceptions

- **Arquivos Irmãos**: *Imports* diretos para arquivos no mesmo diretório (`./file`) são permitidos.

## How to Detect

### Manual

- Buscar `../` em qualquer arquivo de código-fonte

### Automatic

- Biome: `style/noRestrictedImports` configurado para proibir qualquer caminho contendo `../`

## Related to

- [014 - Dependency Inversion Principle (DIP)](014_principio-inversao-dependencia.md): reinforces
- [018 - Acyclic Dependencies Principle (ADP)](018_principio-dependencias-aciclicas.md): reinforces

---

**Created on**: 2025-10-08
**Updated on**: 2026-07-15
**Version**: 2.1
