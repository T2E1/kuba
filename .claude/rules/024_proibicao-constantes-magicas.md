# Proibição de Constantes Mágicas (Magic Strings e Numbers)

**ID**: CREATIONAL-024
**Severity**: 🔴 Critical
**Category**: Creational

---

## What it is

Proíbe o uso direto de valores literais (números ou strings) que possuam um significado contextual ou de negócio (ex: códigos de status, limites de tempo) em vez de constantes nomeadas ou *Value Objects*.

## Why it matters

- Constantes mágicas degradam a legibilidade do código
- Uma alteração de valor em vários locais introduz erros graves de sincronização
- Dificulta a manutenção, pois o contexto do valor é perdido
- Torna revisões de código mais lentas, já que o significado do literal precisa ser inferido

## Objective Criteria

- [ ] Valores numéricos (exceto 0 e 1) usados em lógica de negócio ou condições devem ser substituídos por constantes `UPPER_SNAKE_CASE`.
- [ ] Strings usadas para representar estados, tipos, URLs base ou *tokens* devem ser substituídas por `Enums` ou constantes.
- [ ] Constantes devem ser definidas em um módulo centralizado e importadas, não duplicadas.

## Allowed Exceptions

- **Matemática Pura**: Valores numéricos usados em operações matemáticas básicas (ex: `total / 2`).
- **Frameworks/Infraestrutura**: Strings exigidas por APIs de baixo nível.

## How to Detect

### Manual

- Buscar `string` ou `number` literal dentro de `if`, `switch` ou cálculos de negócio

### Automatic

- Sem regra numérica nativa no Biome para magic numbers/strings — detecção via revisão de código

## Related to

- [003 - Primitive Domain Encapsulation](003_encapsulamento-primitivos.md): reinforces
- [006 - Prohibition of Abbreviated Names](006_proibicao-nomes-abreviados.md): complements
- [030 - Prohibition of Unsafe Functions](030_proibicao-funcoes-inseguras.md): complements
- [042 - Environment-Based Configuration](042_configuracoes-via-ambiente.md): complements

---

**Created on**: 2025-10-08
**Updated on**: 2026-07-15
**Version**: 1.1
