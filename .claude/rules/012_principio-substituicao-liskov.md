# Conformidade com o Princípio de Substituição de Liskov (LSP)

**ID**: BEHAVIORAL-012
**Severity**: 🔴 Critical
**Category**: Behavioral

---

## What it is

Exige que as classes derivadas (subclasses) sejam substituíveis pelas suas classes base (superclasses) sem alterar o comportamento esperado do programa.

## Why it matters

- Quebra a coesão do sistema de tipos e o contrato de herança
- Força os clientes a verificar o tipo do objeto antes de usá-lo, violando o OCP
- Introduz bugs graves em tempo de execução ao substituir uma subclasse pela base
- Indica que a hierarquia de herança está modelada incorretamente

## Objective Criteria

- [ ] Subclasses não devem lançar exceções que não são lançadas pela classe base (comportamento).
- [ ] Subclasses não devem enfraquecer pré-condições ou fortalecer pós-condições da classe base (assinatura/contrato).
- [ ] É proibido o uso de verificações de tipo (`instanceof` ou *type guards* complexos) em código cliente que utiliza a interface da classe base.

## Allowed Exceptions

- **Frameworks de Teste**: Uso de *mocks* e *spies* em testes unitários para simular comportamentos de substituição de forma controlada.

## How to Detect

### Manual

- Buscar `if (objeto instanceof Subclasse)` ou uso de um método da classe base que lança `UnsupportedOperationException`

### Automatic

- TypeScript (compilador): verificação de tipagem estrutural rígida de parâmetros e retornos de métodos sobrescritos (sem regra de lint dedicada no Biome)

## Related to

- [011 - Open/Closed Principle (OCP)](011_principio-aberto-fechado.md): reinforces
- [009 - Tell, Don't Ask](009_diga-nao-pergunte.md): reinforces
- [003 - Primitive Domain Encapsulation](003_encapsulamento-primitivos.md): complements
- [013 - Interface Segregation Principle (ISP)](013_principio-segregacao-interfaces.md): reinforces
- [036 - Side-Effect Function Restrictions](036_restricao-funcoes-efeitos-colaterais.md): reinforces
- [059 - Prohibition of Refused Bequest](059_proibicao-heranca-refusao.md): complements

---

**Created on**: 2025-10-04
**Updated on**: 2026-07-15
**Version**: 1.1
