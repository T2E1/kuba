---
title: "Classe de Dados (Data Class)"
category: "Code Smells"
type: reference
id: "BEHAVIORAL-021"
severity: "🟡 Medium"
tags: [code-smells]
---

# Classe de Dados (Data Class)

## Explanation

### O que é

Uma classe contém apenas campos e métodos de acesso ([getters/setters](../skills/calisthenics/references/getters-setters.md)), sem nenhum comportamento próprio. Toda a lógica que deveria operar sobre esses dados vive em outras classes, tratando a Data Class como um saco de dados passivo.

### Por que importa

- Viola encapsulamento: dados e comportamento que deveriam viver juntos ficam separados
- Espalha lógica de negócio sobre os mesmos dados por várias classes clientes, gerando duplicação
- É sintoma clássico de modelo anêmico (*Anemic Domain Model*)
- Facilita mutação descontrolada do estado, já que qualquer cliente pode alterar os campos livremente

## Reference

### Critérios Objetivos

- [ ] Toda classe que representa um conceito de domínio deve conter ao menos um método de comportamento além de *getters*/*setters*.
- [ ] Lógica que sempre opera sobre os mesmos campos de uma Data Class deve ser movida para dentro dela.
- [ ] É proibido expor todos os campos via *setters* públicos sem validação de invariantes.

### Exceções Permitidas

- **[DTOs](../skills/poeaa/references/data-transfer-object.md) e [Value Objects](../skills/poeaa/references/value-object.md) imutáveis**: estruturas de transporte de dados entre camadas (ex: request/response de API) são legitimamente passivas por design.

### Como Detectar

#### Manual

- Contar os métodos de uma classe: se todos são *getters*/*setters*, é uma Data Class

#### Automático

- Sem regra nativa de Biome para detecção de anemia de classe — avaliar via revisão de arquitetura

## Related to

- [Direct State Exposure (Getters/Setters)](../skills/calisthenics/references/getters-setters.md): reinforces
- [Tell, Don't Ask (Law of Demeter)](../skills/calisthenics/references/diga-nao-pergunte.md): reinforces
- [Primitive Domain Encapsulation (Value Objects)](../skills/calisthenics/references/encapsulamento-primitivos.md): complements
- [Domain Model](../skills/poeaa/references/domain-model.md): contrasts — Domain Model combina dados e comportamento; Data Class é o sintoma do modelo anêmico que o contraria.
- [Data Transfer Object](../skills/poeaa/references/data-transfer-object.md): contrasts — DTO é uma Data Class legítima por contrato de transporte, não por acidente de design.
- [Assimetria entre Objetos e Estruturas de Dados](../skills/clean-code/references/assimetria-objetos-estruturas-dados.md): reinforces — Data Class é o caso em que um objeto foi modelado como estrutura de dados pura.
- [029 — Feature Envy](029_feature-envy.md): reinforces — métodos clientes de uma Data Class tendem a invejar seus campos, sintoma clássico de Feature Envy.
