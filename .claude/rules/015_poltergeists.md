---
title: "Poltergeists"
category: "Anti-Patterns"
type: reference
id: "STRUCTURAL-015"
severity: "🟡 Medium"
tags: [anti-patterns]
---

# Poltergeists

## Explanation

### O que é

Poltergeists (ou Entidades de Vida Curta) ocorrem quando classes ou objetos são criados apenas para chamar outro método ou objeto e então são imediatamente descartados. Como poltergeists (espíritos transitórios) que aparecem brevemente e desaparecem, estes objetos não adicionam valor, apenas adicionam complexidade transitória. [035 — Middle Man](035_middle-man.md) de vida curta.

### Por que importa

- Complexidade desnecessária: cada poltergeist adiciona +1 nome de classe/set para aprender e manter
- Confusão de leitura: desenvolvedores se perguntam "por que isso existe?" apenas para descobrir que não há razão
- Dificuldade de debugging: criação/descarte de objetos adicionam ruído ao stack trace e análise
- Indica refatoração incompleta ou aplicação mecânica de padrão sem pensar
- Espalha código boilerplate: quando poltergeists são comuns, muitos arquivos existem sem propósito

## How-to

### Como aplicar

- Inline Class: chamar o colaborador real diretamente em vez de passar por uma classe que só delega
- Só manter a classe intermediária se ela adicionar transformação ou validação real

### Exemplo

```javascript
// ❌ Classe que existe apenas para chamar outra
class UserInitializer {
  constructor(userService) {
    this.userService = userService;
  }
  initialize(data) {
    return this.userService.create(data); // apenas isso
  }
}

// O chamador precisa instanciar UserInitializer apenas para chegar ao UserService
const initializer = new UserInitializer(userService);
initializer.initialize(data);
```

```javascript
// ✅ Chamar UserService diretamente (Inline Class)
userService.create(data);

// Se a classe adicionar transformação ou validação real, então faz sentido existir
```

Codetag sugerido:

```typescript
// FIXME: Poltergeist — UserInitializer apenas delega para userService.create()
// TODO: Inline Class — chamar userService.create() diretamente
```

## Reference

### Critérios Objetivos

- [ ] Classes/services criados apenas para adaptar parâmetros ou formatar chamadas e descartados
- [ ] Objetos criados e descartados dentro do mesmo escopo (linha única ou poucas linhas)
- [ ] Classes que existem apenas para passar dados entre camadas sem validação, transformação ou comportamento
- [ ] Padrão frequente de `new SomeAdapter(object).execute()` em vez de usar objeto diretamente
- [ ] Objetos construídos nunca armazenados, nunca testados, nunca referenciados além da chamada imediata

### Exceções Permitidas

- **Builders Fluentes**: API fluente ([Builder](../skills/gof/references/builder.md)) que ganha legibilidade mesmo sendo descartada ao fim.
- **Adapters de Fronteira**: Conversão de formato ([Adapter](../skills/gof/references/adapter.md)) na passagem entre API externa e domínio interno.
- **Commands e Queries**: Encapsulamento de operação ([Command](../skills/gof/references/command.md)) em CQRS, que existe por desenho.
- **DTOs de Fronteira**: Criados, populados e entregues à fronteira — o padrão ([Data Transfer Object](../skills/poeaa/references/data-transfer-object.md)) da camada.

### Como Detectar

#### Manual

- Procurar instanciações onde objeto é criado, usado, descartado imediatamente (tudo no mesmo escopo)
- Identificar classes nunca usadas como campos, nunca referenciadas em testes, nunca parte de exports de módulo
- Code review: questionar "que valor esse objeto adiciona?" para cada classe transitória

#### Automático

- Biome: `correctness/noUnusedVariables` (sinaliza referências descartadas sem uso); análise de cobertura de uso continua manual

## Related to

- [035 — Middle Man](035_middle-man.md): complements
- [Simplicity and Clarity (KISS)](../skills/clean-code/references/priorizacao-simplicidade-clareza.md): reinforces
- [029 — Feature Envy](029_feature-envy.md): complements
- [Tell, Don't Ask](../skills/calisthenics/references/diga-nao-pergunte.md): reinforces
- [001 — The Blob (God Object)](001_anti-pattern-the-blob.md): contrasts — divisão malfeita de um Blob por tamanho tende a gerar poltergeists
- [Data Transfer Object](../skills/poeaa/references/data-transfer-object.md): contrasts — exceção legítima quando a classe transitória existe por desenho de fronteira
