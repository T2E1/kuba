---
title: "Campo Temporário (Temporary Field)"
category: "Code Smells"
type: reference
id: "STRUCTURAL-019"
severity: "🟡 Medium"
tags: [code-smells]
---

# Campo Temporário (Temporary Field)

## Explanation

### O que é

Um campo de instância só recebe valor válido em determinadas circunstâncias (ex: apenas durante um método específico ou algoritmo), permanecendo vazio ou nulo no resto do ciclo de vida do objeto.

### Por que importa

- Confunde o leitor, que espera que todo campo de instância seja válido a qualquer momento
- Introduz `NullPointerException`/`undefined` quando o campo é acessado fora da janela em que é válido
- Sinaliza que existe um algoritmo ou contexto temporário que deveria ser seu próprio objeto
- Aumenta o [acoplamento temporal oculto](../skills/clean-code/references/acoplamento-temporal-oculto.md) entre métodos que só fazem sentido chamados em uma ordem específica

## Reference

### Critérios Objetivos

- [ ] Todo campo de instância deve estar em um estado válido imediatamente após a construção do objeto.
- [ ] Um campo usado apenas dentro de um único método (ou grupo pequeno de métodos relacionados a um algoritmo) deve ser extraído para um objeto ou parâmetro local.
- [ ] É proibido depender da ordem de chamada de métodos para que um campo tenha valor válido.

### Exceções Permitidas

- **Cache Interno com [Lazy Load](../skills/poeaa/references/lazy-load.md)**: um campo pode ser preenchido sob demanda na primeira leitura, desde que documentado e com valor padrão seguro antes disso.

### Como Detectar

#### Manual

- Buscar campos que são `null`/`undefined` na maior parte do ciclo de vida do objeto e só ganham valor dentro de um método específico

#### Automático

- Sem regra nativa de Biome para este smell — detecção via revisão de código

## Related to

- [SRP - Single Responsibility Principle](../skills/solid/SKILL.md): reinforces — o algoritmo temporário deveria ser extraído para sua própria classe
- [Primitive Domain Encapsulation (Value Objects)](../skills/calisthenics/references/encapsulamento-primitivos.md): complements
- [Acoplamento Temporal Oculto (G31)](../skills/clean-code/references/acoplamento-temporal-oculto.md): reinforces — o campo só é válido se os métodos forem chamados na ordem certa, escondendo o acoplamento.
- [Lazy Load](../skills/poeaa/references/lazy-load.md): contrasts — Lazy Load documenta e controla o preenchimento tardio; o campo temporário faz isso de forma implícita e arriscada.
- [022 — Large Class](022_classe-grande.md): complements — campos temporários costumam se acumular em classes que já fazem coisas demais.
- [021 — Data Class](021_classe-de-dados.md): contrasts — o campo temporário sinaliza um algoritmo escondido, enquanto Data Class é a ausência total de comportamento.
