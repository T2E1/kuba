# Princípio de Dependências Acíclicas (ADP)

**ID**: STRUCTURAL-018
**Severity**: 🔴 Critical
**Category**: Structural

---

## What it is

O grafo de dependência entre pacotes deve ser acíclico, ou seja, não deve haver dependências circulares entre os módulos.

## Why it matters

- Dependências circulares criam um nó rígido, onde módulos envolvidos se tornam inseparáveis
- Impede testes isolados de cada módulo
- Torna a implantação mais complexa, pois módulos não podem ser publicados independentemente
- Impossibilita o reuso de um módulo sem arrastar todo o ciclo junto

## Objective Criteria

- [ ] É proibido que o Módulo A dependa do Módulo B, e o Módulo B dependa do Módulo A.
- [ ] Módulos circulares (com laços de dependência) devem ser imediatamente quebrados via DIP (extraindo interface comum).
- [ ] A análise do grafo de dependências deve resultar em um Grafo Direcionado Acíclico (DAG).

## Allowed Exceptions

- **Classes de Infraestrutura**: Dependências circulares entre classes *internas* a um mesmo pacote, desde que não envolvam a interface pública.

## How to Detect

### Manual

- Buscar `import { B } from 'module-b'` em `module-a` e `import { A } from 'module-a'` em `module-b`

### Automatic

- Sem regra nativa de Biome para detecção de ciclos entre módulos — usar ferramenta dedicada de análise de grafo de dependências

## Related to

- [014 - Dependency Inversion Principle (DIP)](014_principio-inversao-dependencia.md): reinforces
- [009 - Tell, Don't Ask](009_diga-nao-pergunte.md): reinforces
- [019 - Stable Dependencies Principle (SDP)](019_principio-dependencias-estaveis.md): complements
- [041 - Explicit Dependency Declaration](041_declaracao-explicita-dependencias.md): complements

---

**Created on**: 2025-10-04
**Updated on**: 2026-07-15
**Version**: 1.1
