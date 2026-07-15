# Proibição de Argumentos Sinalizadores (Flag Arguments)

**ID**: BEHAVIORAL-037
**Severity**: 🟠 High
**Category**: Behavioral

---

## What it is

Proíbe o uso de parâmetros booleanos (*boolean flags*) em assinaturas de funções ou métodos, pois eles são um forte indicador de que a função possui mais de uma responsabilidade.

## Why it matters

- Violam o Princípio da Responsabilidade Única (SRP), pois a função se ramifica internamente
- Violam o Princípio Aberto/Fechado (OCP), já que novos comportamentos exigem novas flags
- Tornam a função mais difícil de testar (mais combinações de caminhos)
- Escondem no nome da chamada (`process(data, true)`) qual comportamento será executado

## Objective Criteria

- [ ] Funções não devem ter argumentos booleanos que alteram o caminho de execução principal (ex: `if (flag) { ... } else { ... }`).
- [ ] Funções com *boolean flags* devem ser divididas em métodos separados, com nomes que expressem a intenção de cada ramificação (ex: `processAndLog(data)` e `process(data)`).
- [ ] Limite de **zero** *boolean flags* nos métodos públicos de classes de domínio (`Services`, `Entities`).

## Allowed Exceptions

- **Módulos de Controle de Sistema**: Funções de baixo nível que controlam *debugging* ou *mode* (ex: `isVerbose`).
- **Frameworks/Libraries**: Funções que implementam uma assinatura exigida por um framework de terceiros.

## How to Detect

### Manual

- Buscar parâmetros de função tipados como `boolean` ou com nomes como `isX`, `shouldY`, `withZ`

### Automatic

- Sem regra nativa de Biome para detectar flag arguments — detecção via revisão de código

## Related to

- [010 - Single Responsibility Principle (SRP)](010_principio-responsabilidade-unica.md): reinforces
- [011 - Open/Closed Principle (OCP)](011_principio-aberto-fechado.md): reinforces
- [033 - Maximum Function Parameters](033_limite-parametros-funcao.md): reinforces
- [013 - Interface Segregation Principle (ISP)](013_principio-segregacao-interfaces.md): reinforces

---

**Created on**: 2025-10-08
**Updated on**: 2026-07-15
**Version**: 1.1
