# Princípio do Fechamento Comum (CCP)

**ID**: STRUCTURAL-016
**Severity**: 🟠 High
**Category**: Structural

---

## What it is

As classes que mudam juntas pela mesma razão devem ser empacotadas juntas.

## Why it matters

- Reforça o SRP no nível de pacote, localizando o impacto de uma mudança
- Reduz a necessidade de alterar muitos pacotes em uma única alteração de requisito
- Facilita a implantação, já que uma feature toca poucos pacotes
- Torna o histórico de commits mais previsível e fácil de auditar

## Objective Criteria

- [ ] O pacote deve ser revisado se a alteração de um requisito causar modificações em mais de **3** arquivos de classes/módulos não relacionados.
- [ ] Classes relacionadas a uma única entidade de domínio (ex: `Pedido`, `PedidoService`, `PedidoFactory`) devem estar no mesmo pacote.
- [ ] Classes que mudam juntas devem ser localizadas em um mesmo diretório para facilitar a coesão.

## Allowed Exceptions

- **Classes de Infraestrutura Compartilhada**: Classes que são utilizadas em muitos pacotes e vivem em um pacote de utilidades de baixo nível.

## How to Detect

### Manual

- Analisar o histórico de commits (`git log`): verificar se um único *feature request* afetou classes espalhadas por vários pacotes

### Automatic

- Sem regra nativa de Biome para esta análise arquitetural — usar `git log --stat` para rastrear arquivos alterados por funcionalidade

## Related to

- [010 - Single Responsibility Principle (SRP)](010_principio-responsabilidade-unica.md): reinforces
- [015 - Release-Reuse Equivalence Principle (REP)](015_principio-equivalencia-lancamento-reuso.md): complements
- [007 - Maximum Lines per Class File](007_limite-maximo-linhas-classe.md): reinforces
- [017 - Common Reuse Principle (CRP)](017_principio-reuso-comum.md): complements
- [058 - Prohibition of Shotgun Surgery](058_proibicao-shotgun-surgery.md): reinforces
- [018 - Acyclic Dependencies Principle (ADP)](018_principio-dependencias-aciclicas.md): complements

---

**Created on**: 2025-10-04
**Updated on**: 2026-07-15
**Version**: 1.1
