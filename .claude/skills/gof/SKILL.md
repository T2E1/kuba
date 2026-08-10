---
name: gof
model: opus
description: Os 23 Design Patterns do Gang of Four organizados em Criacionais, Estruturais e Comportamentais, com tabela de seleção por problema. Use ao precisar trocar algoritmo em runtime, criar objeto sem citar a classe concreta, notificar dependentes de uma mudança de estado, adicionar responsabilidade sem herança, simplificar um subsistema, ou ao revisar código onde um `switch` por tipo pede polimorfismo. Não use para escolher pattern sem ter o problema identificado — isso é overengineering (rule 064).
---

# GoF Design Patterns

## O que é

Os 23 padrões de projeto orientado a objetos catalogados por Gamma, Helm, Johnson e
Vlissides. Cada um é uma solução nomeada para um problema recorrente de design.

O papel deles aqui é concreto: são as formas de satisfazer OCP e DIP (rules 011 e 014)
sem inventar estrutura. Quando a skill `solid` diz "extraia a abstração", geralmente o
formato dessa abstração é um destes 23.

## Quando usar

| Problema | Pattern |
|---|---|
| Criar objeto sem citar a classe concreta | Factory Method |
| Trocar algoritmo em runtime | Strategy |
| Notificar dependentes quando o estado muda | Observer |
| Interface única para subsistema complexo | Facade |
| Adicionar responsabilidade sem herança | Decorator |
| Controlar acesso a outro objeto | Proxy |
| Construir objeto complexo passo a passo | Builder |
| Cadeia de handlers para uma requisição | Chain of Responsibility |
| Comportamento muda com o estado interno | State |
| Percorrer coleção sem expor a estrutura | Iterator |
| Desfazer/refazer operações | Command + Memento |

**Nunca escolha o pattern antes do problema.** Aplicar Strategy sem variação real de
algoritmo, ou Singleton no lugar de injeção de dependência, é overengineering (rule 064)
e violação de DIP (rule 014). O pattern entra quando o problema já apareceu duas vezes.

## Como aplicar

1. Nomear o problema concreto — não "quero flexibilidade", mas "preciso trocar o meio de
   pagamento em runtime".
2. Localizar o pattern na tabela acima.
3. Abrir a referência e conferir a seção de quando **não** aplicar.
4. Implementar a forma mínima. Um pattern não exige todas as classes do diagrama
   canônico se o problema não pede.

### Criacionais

| Pattern | Referência |
|---|---|
| Singleton | [singleton.md](references/singleton.md) |
| Factory Method | [factory-method.md](references/factory-method.md) |
| Abstract Factory | [abstract-factory.md](references/abstract-factory.md) |
| Builder | [builder.md](references/builder.md) |
| Prototype | [prototype.md](references/prototype.md) |

### Estruturais

| Pattern | Referência |
|---|---|
| Adapter | [adapter.md](references/adapter.md) |
| Bridge | [bridge.md](references/bridge.md) |
| Composite | [composite.md](references/composite.md) |
| Decorator | [decorator.md](references/decorator.md) |
| Facade | [facade.md](references/facade.md) |
| Flyweight | [flyweight.md](references/flyweight.md) |
| Proxy | [proxy.md](references/proxy.md) |

### Comportamentais

| Pattern | Referência |
|---|---|
| Chain of Responsibility | [chain-of-responsibility.md](references/chain-of-responsibility.md) |
| Command | [command.md](references/command.md) |
| Interpreter | [interpreter.md](references/interpreter.md) |
| Iterator | [iterator.md](references/iterator.md) |
| Mediator | [mediator.md](references/mediator.md) |
| Memento | [memento.md](references/memento.md) |
| Observer | [observer.md](references/observer.md) |
| State | [state.md](references/state.md) |
| Strategy | [strategy.md](references/strategy.md) |
| Template Method | [template-method.md](references/template-method.md) |
| Visitor | [visitor.md](references/visitor.md) |

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Strategy no lugar de `switch` por tipo (rule 011) | [strategy.valid.js](examples/strategy.valid.js) | [strategy.invalid.js](examples/strategy.invalid.js) |
| Pattern aplicado sem problema real (rule 064) | [premature-pattern.valid.js](examples/premature-pattern.valid.js) | [premature-pattern.invalid.js](examples/premature-pattern.invalid.js) |

## Checklist

- [ ] O problema foi nomeado antes do pattern ser escolhido
- [ ] Existe variação real — pelo menos duas implementações concretas
- [ ] A seção "quando não aplicar" da referência foi lida
- [ ] Nenhum Singleton usado onde injeção de dependência resolveria (rule 014)
- [ ] A implementação é a forma mínima, não o diagrama canônico completo
- [ ] O pattern reduziu a ramificação por tipo, não apenas a moveu

## Troubleshooting

### Apliquei Strategy e o `switch` só mudou de lugar

**Causa:** a escolha da estratégia continua sendo um `if`/`switch` no mesmo cliente.
**Solução:** a escolha pertence a uma Factory — é a exceção explícita da rule 011, que
permite centralizar a ramificação num único ponto criacional.

### O pattern deixou o código mais difícil de seguir

**Causa:** pattern aplicado a um problema que não existia, ou forma canônica completa
onde a mínima bastava.
**Solução:** se há uma só implementação concreta, remova a abstração (rules 023 e 064).

### Preciso de estado global e Singleton parece a resposta

**Causa:** Singleton é o pattern mais mal aplicado do catálogo — resolve unicidade,
não acesso global.
**Solução:** injetar a instância única no Root Composer. Singleton acoplado por import
viola DIP (rule 014) e cria estado mutável compartilhado (rule 070).

## Referências

- `references/*.md` — um arquivo por pattern, com intenção, estrutura, quando aplicar,
  quando **não** aplicar e implementação em JavaScript.

Fonte: Gamma, Helm, Johnson, Vlissides, *Design Patterns* (1994).

## Rules relacionadas

- [011 — Princípio Aberto/Fechado](../../rules/011_principio-aberto-fechado.md): Strategy, State e Template Method são as formas de satisfazê-lo; a Factory é a exceção que centraliza o `switch`.
- [014 — Inversão de Dependência](../../rules/014_principio-inversao-dependencia.md): Factory e Abstract Factory são o mecanismo; Singleton é o antipadrão comum contra ela.
- [064 — Proibição de Overengineering](../../rules/064_proibicao-overengineering.md): limita quando o pattern se justifica.
- [023 — Funcionalidade Especulativa](../../rules/023_proibicao-funcionalidade-especulativa.md): pattern para caso hipotético é Speculative Generality.
- [012 — Substituição de Liskov](../../rules/012_principio-substituicao-liskov.md): toda implementação de um pattern polimórfico precisa respeitá-la.

## Skills relacionadas

- [solid](../solid/SKILL.md): depends on — o pattern é a forma concreta do princípio.
- [poeaa](../poeaa/SKILL.md): complements — os padrões enterprise compõem estes internamente.
- [anti-pattern](../anti-pattern/SKILL.md): complements — Golden Hammer e Overengineering são o risco de usar este catálogo mal.
- [mixin](../mixin/SKILL.md): reinforces — a composição por mixin é a forma que Decorator assume nos web components deste repositório.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-09
**Versão**: 2.0
