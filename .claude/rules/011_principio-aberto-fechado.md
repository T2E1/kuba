# Conformidade com o Princípio Aberto/Fechado (OCP)

**ID**: BEHAVIORAL-011
**Severity**: 🟠 High
**Category**: Behavioral

---

## What it is

Módulos, classes ou funções devem ser abertos para extensão e fechados para modificação, permitindo a adição de novos comportamentos sem alterar o código existente da unidade.

## Why it matters

- A violação do OCP leva a código frágil, propenso a regressão a cada nova funcionalidade
- Reduz o risco de quebrar lógica já testada ao adicionar comportamento novo
- Aumenta a manutenibilidade ao isolar pontos de extensão
- Evita que `if/switch` por tipo cresçam indefinidamente pelo código

## Objective Criteria

- [ ] A adição de um novo "tipo" de comportamento deve ser implementada por herança ou composição, e **não** por novos `if/switch` no código existente.
- [ ] Métodos com mais de **3** cláusulas `if/else if/switch case` que lidam com *tipos* (ex: `if (type === 'A')`) violam o OCP.
- [ ] Módulos de alto nível não devem ter dependência direta de mais de **2** classes concretas que implementam uma mesma abstração.

## Allowed Exceptions

- **Classes de Orquestração**: Módulos que atuam como *Factory* para instanciar tipos, onde a lógica `switch` é centralizada.

## How to Detect

### Manual

- Sempre que for necessário adicionar uma nova funcionalidade, verificar se foi preciso modificar a classe base (se sim, OCP violado)

### Automatic

- Biome: `complexity/noExcessiveCognitiveComplexity` (sinaliza métodos com muitas ramificações por tipo, indício de violação do OCP)

## Related to

- [002 - Prohibition of ELSE Clause](002_proibicao-clausula-else.md): reinforces
- [012 - Liskov Substitution Principle (LSP)](012_principio-substituicao-liskov.md): depends on
- [013 - Interface Segregation Principle (ISP)](013_principio-segregacao-interfaces.md): complements
- [010 - Single Responsibility Principle (SRP)](010_principio-responsabilidade-unica.md): complements
- [014 - Dependency Inversion Principle (DIP)](014_principio-inversao-dependencia.md): reinforces

---

**Created on**: 2025-10-04
**Updated on**: 2026-07-15
**Version**: 1.1
