---
title: "Estado Mutável Compartilhado (Shared Mutable State)"
category: "Anti-Patterns"
type: reference
id: "BEHAVIORAL-008"
severity: "🟠 High"
tags: [anti-patterns]
---

# Estado Mutável Compartilhado (Shared Mutable State)

## Explanation

### O que é

Estado Mutável Compartilhado (Shared Mutable State) ocorre quando múltiplos módulos, funções ou contextos de execução leem e modificam o mesmo objeto sem coordenação. Qualquer parte do sistema pode alterar estado a qualquer momento, tornando o comportamento imprevisível. Distinto de [037 — Mutação Acidental](037_mutacao-acidental.md) (052): aqui o compartilhamento é estrutural, não acidental.

### Por que importa

- Bugs fantasma: a origem da mutação está em módulo diferente do ponto de falha
- Testes frágeis: resultado depende de estado global deixado por testes anteriores
- Rastreabilidade zero: impossível saber quem mudou estado sem breakpoints
- Concorrência impossível: qualquer paralelismo introduz race conditions

## How-to

### Como aplicar

- Preferir transformações que retornam novo objeto ([`Object.freeze`](../skills/clean-code/references/imutabilidade-objetos-freeze.md) + spread) a mutação in-place
- Cada módulo recebe e retorna versões imutáveis do estado — rastreável e testável

### Exemplo

```javascript
// ❌ Estado de carrinho compartilhado e mutável
const cart = { items: [], total: 0 };

function addItem(item) {
  cart.items.push(item);        // muta array global
  cart.total += item.price;     // muta propriedade global
}

function applyDiscount(percent) {
  cart.total = cart.total * (1 - percent); // muta novamente
}

// Quem é responsável por cart.total agora? Ninguém sabe com certeza.
```

```javascript
// ✅ Estado imutável — cada transformação retorna novo objeto
function addItem(cart, item) {
  return Object.freeze({
    items: [...cart.items, item],
    total: cart.total + item.price,
  });
}

function applyDiscount(cart, percent) {
  return Object.freeze({
    ...cart,
    total: cart.total * (1 - percent),
  });
}

// Cada módulo recebe e retorna versões imutáveis — rastreável e testável
const cart1 = addItem(emptyCart, item);
const cart2 = applyDiscount(cart1, 0.1);
```

Codetag sugerido:

```typescript
// FIXME: Shared Mutable State — cart mutado por múltiplas funções
// TODO: Tornar imutável: cada função retorna novo objeto com Object.freeze()
```

## Reference

### Critérios Objetivos

- [ ] Objeto de domínio passado por referência e modificado em dois ou mais módulos distintos
- [ ] Variável de módulo ou global alterada por múltiplas funções sem coordenação explícita
- [ ] Testes que falham dependendo da ordem de execução (sinal de estado compartilhado)
- [ ] Array ou objeto usado como "buffer de comunicação" entre partes do sistema sem cópia
- [ ] Ausência de `Object.freeze()` em objetos passados para múltiplos consumidores

### Exceções Permitidas

- **Stores Explícitos**: Gerenciadores de estado (Redux, Zustand, MobX) onde padrão de mutação é centralizado, rastreado e intencional.
- **Objetos de Configuração Somente Leitura**: Configurações congeladas com `Object.freeze()` passadas como constantes de leitura.

### Como Detectar

#### Manual

- Rastrear ciclo de vida de um objeto: se ele é passado para múltiplas funções e cada uma pode modificá-lo, é Estado Mutável Compartilhado
- Executar testes em ordem aleatória para detectar dependência de estado global

#### Automático

- Biome: `style/noParameterAssign` (impede reatribuição de parâmetros compartilhados); tipagem `Readonly<T>`/`as const` reforça imutabilidade em compilação

## Related to

- [Object Immutability (freeze)](../skills/clean-code/references/imutabilidade-objetos-freeze.md): reinforces
- [Side-Effect Function Restrictions](../skills/clean-code/references/restricao-funcoes-efeitos-colaterais.md): reinforces
- [Stateless Processes](../skills/twelve-factor/SKILL.md): complements
- [037 — Accidental Mutation](037_mutacao-acidental.md): complements
- [012 — Premature Optimization](012_otimizacao-prematura.md): complements
- [Escopo Mínimo de Dados Compartilhados entre Threads](../skills/clean-code/references/escopo-minimo-dados-compartilhados-concorrencia.md): reinforces — mesma raiz de problema em contexto de concorrência
- [003 — Código Spaghetti](003_codigo-spaghetti.md): complements — estado global mutável é um dos sintomas listados do spaghetti
- [Reliability — Confiabilidade](../skills/quality/references/reliability.md): contrasts — race conditions e bugs fantasma corroem esta qualidade McCall
