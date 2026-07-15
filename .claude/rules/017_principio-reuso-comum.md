# Princípio do Reuso Comum (CRP)

**ID**: STRUCTURAL-017
**Severity**: 🟡 Medium
**Category**: Structural

---

## What it is

As classes em um pacote devem ser reutilizadas em conjunto. Se você usa uma, você deve usar todas.

## Why it matters

- Refina a granularidade do pacote, evitando dependências desnecessárias
- Evita que clientes dependam de classes que não usam
- Reduz recompilações/redeploys desnecessários quando uma classe não relacionada muda
- Diminui o acoplamento indesejado entre clientes e partes não usadas do pacote

## Objective Criteria

- [ ] O pacote deve ser dividido se houver classes que não são utilizadas por pelo menos **50%** dos clientes que importam o pacote.
- [ ] Se uma classe é usada isoladamente, ela deve ser movida para um pacote de utilidade ou para fora do pacote coeso.
- [ ] Não deve haver mais de **3** classes públicas dentro de um pacote que não são referenciadas externamente.

## Allowed Exceptions

- **Métodos Privados de Suporte**: Classes auxiliares internas que são estritamente usadas para suportar as classes públicas do pacote.

## How to Detect

### Manual

- Verificar o diretório de `imports` de um cliente e ver quantas classes do pacote importado ele usa ativamente

### Automatic

- Biome: `correctness/noUnusedImports` (sinaliza imports de classes do pacote que acabam não sendo usadas pelo cliente)

## Related to

- [015 - Release-Reuse Equivalence Principle (REP)](015_principio-equivalencia-lancamento-reuso.md): complements
- [013 - Interface Segregation Principle (ISP)](013_principio-segregacao-interfaces.md): reinforces
- [016 - Common Closure Principle (CCP)](016_principio-fechamento-comum.md): complements
- [056 - Prohibition of Zombie Code (Lava Flow)](056_proibicao-codigo-zombie-lava-flow.md): reinforces
- [067 - Prohibition of Boat-Anchor Dependency](067_proibicao-dependencia-barco-ancora.md): reinforces

---

**Created on**: 2025-10-04
**Updated on**: 2026-07-15
**Version**: 1.1
