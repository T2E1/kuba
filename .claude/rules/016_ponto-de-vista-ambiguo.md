---
title: "Ponto de Vista Ambíguo (Ambiguous Viewpoint)"
category: "Anti-Patterns"
type: reference
id: "STRUCTURAL-016"
severity: "🟡 Medium"
tags: [anti-patterns]
---

# Ponto de Vista Ambíguo (Ambiguous Viewpoint)

## Explanation

### O que é

Diagramas e documentos de arquitetura (ex: UML) são produzidos sem deixar claro de qual perspectiva foram desenhados — lógica (conceitos de domínio), de processo (execução em tempo real) ou física (implantação/infraestrutura) — fazendo com que cada leitor os interprete de forma diferente.

### Por que importa

- Times de negócio, desenvolvimento e operação leem o mesmo diagrama e tiram conclusões incompatíveis sobre o que ele representa
- Decisões de implementação são tomadas com base em uma leitura equivocada de um modelo conceitual
- Dificulta validar se a arquitetura documentada corresponde à arquitetura real do sistema
- É agravado quando o mesmo diagrama tenta representar múltiplas perspectivas ao mesmo tempo sem indicação

## How-to

### Como aplicar

- Declarar explicitamente a perspectiva de cada diagrama antes de desenhá-lo
- Separar documentos por público quando a perspectiva muda (negócio vs. infraestrutura), em vez de reaproveitar o mesmo artefato

## Reference

### Critérios Objetivos

- [ ] Todo diagrama de arquitetura deve declarar explicitamente sua perspectiva (lógica, de processo ou física).
- [ ] Elementos de perspectivas diferentes (ex: um conceito de domínio e um servidor físico) não devem aparecer na mesma notação sem distinção visual clara.
- [ ] Diagramas voltados a públicos diferentes (negócio vs. infraestrutura) devem ser documentos separados, não o mesmo artefato reaproveitado.

### Exceções Permitidas

- **Diagramas C4 em Camadas**: quando o próprio formalismo (ex: [modelo C4](../skills/c4-model/SKILL.md)) já separa formalmente contexto, containers, componentes e código em documentos distintos.

### Como Detectar

#### Manual

- Perguntar a duas pessoas de áreas diferentes o que um mesmo diagrama significa; respostas divergentes indicam ambiguidade de ponto de vista

#### Automático

- Sem regra automática aplicável — este é um anti-pattern de processo de documentação, não de código

## Related to

- [Comment Quality: Why, Not What](../skills/clean-code/references/qualidade-comentarios-porque.md): complements
- [Consistent Class and Method Names](../skills/naming/references/nomes-classes-metodos-consistentes.md): complements
- [C4 Model](../skills/c4-model/SKILL.md): reinforces — formalismo que separa explicitamente contexto, container, componente e código
- [System Context](../skills/c4-model/SKILL.md): complements — nível C4 que corresponde à perspectiva lógica/de negócio
- [Arc42](../skills/arc42/SKILL.md): reinforces — template arquitetural cujas visões (blocos, runtime, deployment) já separam perspectivas por seção
