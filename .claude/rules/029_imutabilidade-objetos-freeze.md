# Imutabilidade de Objetos de Domínio (Object.freeze)

**ID**: CREATIONAL-029
**Severity**: 🟠 High
**Category**: Creational

---

## What it is

Exige que todos os objetos criados para representar Entidades ou *Value Objects* do Domínio sejam **imutáveis**, aplicando explicitamente métodos de congelamento (`Object.freeze()`) antes de serem expostos.

## Why it matters

- A mutabilidade acidental introduz bugs graves e difíceis de rastrear
- Dificulta identificar a origem da mudança de estado quando o objeto é compartilhado
- Viola o princípio do encapsulamento ao permitir alteração externa do estado interno
- Garante que o objeto se comporte de forma previsível após sua criação

## Objective Criteria

- [ ] Todas as instâncias de `Value Objects` ou `Entities` de domínio devem ser congeladas antes de sair do construtor ou da camada de persistência.
- [ ] É proibido aceitar objetos do domínio como parâmetro em métodos públicos e modificá-los sem clonar ou forçar um método de intenção.
- [ ] A imutabilidade deve ser aplicada de forma *shallow* (superficial) ou *deep* (profunda), dependendo do objeto.

## Allowed Exceptions

- **DTOs Puros**: Objetos de transferência de dados usados estritamente para comunicação externa ou mapeamento de dados.

## How to Detect

### Manual

- Verificar a ausência de `Object.freeze()` em métodos *Factory* ou construtores de Entidades

### Automatic

- TypeScript: uso de `readonly` em propriedades (Biome não impõe imutabilidade em tempo de execução)

## Related to

- [003 - Primitive Domain Encapsulation](003_encapsulamento-primitivos.md): reinforces
- [008 - Prohibition of Getters/Setters](008_proibicao-getters-setters.md): reinforces
- [036 - Side-Effect Function Restrictions](036_restricao-funcoes-efeitos-colaterais.md): reinforces
- [052 - Prohibition of Accidental Mutation](052_proibicao-mutacao-acidental.md): reinforces
- [070 - Prohibition of Shared Mutable State](070_proibicao-estado-mutavel-compartilhado.md): reinforces

---

**Created on**: 2025-10-08
**Updated on**: 2026-07-15
**Version**: 1.1
