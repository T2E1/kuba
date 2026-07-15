# Aplicação do Princípio de Segregação de Interfaces (ISP)

**ID**: STRUCTURAL-013
**Severity**: 🟠 High
**Category**: Structural

---

## What it is

Exige que clientes não sejam forçados a depender de interfaces que não utilizam. Múltiplas interfaces específicas para clientes são preferíveis a uma única interface geral.

## Why it matters

- Causa classes anêmicas, com métodos vazios ou lançando exceções de "não suportado"
- Aumenta o acoplamento desnecessário entre cliente e interface
- Força clientes a depender de código que nunca será executado
- Dificulta a evolução da interface, pois qualquer mudança afeta clientes que nem usam o método alterado

## Objective Criteria

- [ ] Interfaces devem ter, no máximo, **5** métodos públicos.
- [ ] Classes que implementam interfaces não devem deixar métodos vazios ou lançar exceções de "não suportado".
- [ ] Se uma interface é utilizada por mais de **3** clientes diferentes, ela deve ser revisada para segregação.

## Allowed Exceptions

- **Interfaces de Baixo Nível**: Interfaces de *Frameworks* de terceiros que exigem um alto número de métodos (ex: `HttpRequestHandler`).

## How to Detect

### Manual

- Buscar interfaces com 8 ou mais métodos, ou classes implementadoras que deixam métodos sem funcionalidade

### Automatic

- Sem regra nativa de Biome para tamanho de interface — detecção via revisão de código

## Related to

- [010 - Single Responsibility Principle (SRP)](010_principio-responsabilidade-unica.md): reinforces
- [011 - Open/Closed Principle (OCP)](011_principio-aberto-fechado.md): complements
- [012 - Liskov Substitution Principle (LSP)](012_principio-substituicao-liskov.md): reinforces
- [017 - Common Reuse Principle (CRP)](017_principio-reuso-comum.md): complements
- [037 - Prohibition of Flag Arguments](037_proibicao-argumentos-sinalizadores.md): reinforces

---

**Created on**: 2025-10-04
**Updated on**: 2026-07-15
**Version**: 1.1
