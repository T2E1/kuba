# Conformidade com o Princípio de Separação Comando-Consulta (CQS)

**ID**: BEHAVIORAL-038
**Severity**: 🟠 High
**Category**: Behavioral

---

## What it is

Exige que um método seja ou uma **Consulta (Query)** que retorna dados sem alteração de estado, ou um **Comando (Command)** que altera o estado mas não retorna dados (exceto DTOs/Entidades).

## Why it matters

- Introduz efeitos colaterais inesperados quando uma "consulta" também escreve estado
- Dificulta o raciocínio sobre o código, pois o cliente assume que ler é seguro
- Leva a bugs de concorrência e de estado quando leitura e escrita se misturam
- Torna o nome do método uma promessa confiável sobre o que ele faz

## Objective Criteria

- [ ] Métodos que alteram o estado (Comandos) devem ter o tipo de retorno `void` ou um tipo de entidade (ex: `User`, `Order`), mas **não** um `boolean` ou código de sucesso.
- [ ] Métodos que retornam um valor (Consultas) não devem ter efeitos colaterais perceptíveis (ex: modificação de variáveis de instância, chamadas a métodos de escrita).
- [ ] O número de métodos que são híbridos (fazem Query e Command) deve ser zero.

## Allowed Exceptions

- **Caches**: Métodos de leitura que têm o efeito colateral de atualizar um cache interno (*cache-aside*) são aceitos, desde que este efeito seja uma otimização e não lógica de negócio.

## How to Detect

### Manual

- Buscar métodos que retornam um valor, mas que contêm lógica de persistência (`save()`) ou modificação de estado

### Automatic

- Sem regra nativa de Biome para separação Command/Query — detecção via revisão de código

## Related to

- [036 - Side-Effect Function Restrictions](036_restricao-funcoes-efeitos-colaterais.md): reinforces
- [010 - Single Responsibility Principle (SRP)](010_principio-responsabilidade-unica.md): reinforces
- [009 - Tell, Don't Ask](009_diga-nao-pergunte.md): reinforces
- [011 - Open/Closed Principle (OCP)](011_principio-aberto-fechado.md): reinforces

---

**Created on**: 2025-10-08
**Updated on**: 2026-07-15
**Version**: 1.1
