# Equivalência de Lançamento e Reuso de Pacotes (REP)

**ID**: STRUCTURAL-015
**Severity**: 🟠 High
**Category**: Structural

---

## What it is

O módulo/pacote que se destina ao reuso deve ter o mesmo escopo de lançamento (release) que o seu consumidor. A granularidade do reuso é a granularidade do lançamento.

## Why it matters

- Pacotes difíceis de versionar forçam clientes a aceitar módulos que não usam
- Clientes acabam esperando por releases desnecessárias para obter uma correção pontual
- Reduz a previsibilidade de compatibilidade entre versões de um pacote
- Aumenta o custo de coordenação entre times que consomem o mesmo pacote

## Objective Criteria

- [ ] O pacote reutilizável deve ser minimamente coeso (SRP aplicado a nível de pacote).
- [ ] Todos os itens do pacote reutilizável devem ser lançados sob a mesma versão (sem *sub-versionamento*).
- [ ] A pasta/pacote deve ter um único objetivo de reuso (ex: *Logging*, *Validation*, *DomainPrimitives*).

## Allowed Exceptions

- **Monorepos com Workspaces**: Ambientes onde o gerenciamento de dependências é estritamente controlado para que a versão seja sempre sincronizada.

## How to Detect

### Manual

- Verificar se o pacote contém classes que não são utilizadas em conjunto pelos clientes

### Automatic

- Sem regra nativa de Biome para granularidade de release — análise de dependências dedicada (ex: mapeamento de uso por cliente)

## Related to

- [016 - Common Closure Principle (CCP)](016_principio-fechamento-comum.md): complements
- [010 - Single Responsibility Principle (SRP)](010_principio-responsabilidade-unica.md): reinforces
- [014 - Dependency Inversion Principle (DIP)](014_principio-inversao-dependencia.md): reinforces
- [017 - Common Reuse Principle (CRP)](017_principio-reuso-comum.md): complements
- [040 - Single Codebase](040_base-codigo-unica.md): complements

---

**Created on**: 2025-10-04
**Updated on**: 2026-07-15
**Version**: 1.1
