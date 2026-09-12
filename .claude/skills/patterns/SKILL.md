---
name: patterns
model: opus
effort: high
description: Catálogo dos 22 patterns de patterns.dev/vanilla — 12 Design Patterns (Singleton, Proxy, Prototype, Observer, Module, Mixin, Mediator, Flyweight, Factory, Command, Provider, Static Import), 2 Rendering Patterns (Islands Architecture, View Transitions) e 8 Performance Patterns (Loading Sequence, Dynamic Import, Import on Visibility/Interaction, Bundle Splitting, PRPL, Tree Shaking, Preload, Prefetch, Third-Party, List Virtualization, Compression). Use ao escolher um pattern de JavaScript para um problema concreto, ao revisar se um bundle carrega mais do que devia, ou ao decidir como um componente deve hidratar ou renderizar. Não use para os 23 padrões do Gang of Four — é a skill gof; nem para escolher pattern sem problema identificado — isso é overengineering (rule 064).
---

# Patterns.dev

## O que é

O catálogo de patterns.dev/vanilla, organizado em três eixos: **Design Patterns** (forma
de estruturar objetos e módulos), **Rendering Patterns** (como o HTML chega ao usuário) e
**Performance Patterns** (como reduzir o custo de rede e execução do JavaScript).

Onde o catálogo se sobrepõe ao GoF (Factory, Observer, Mediator, Command, Flyweight), a
skill `gof` continua sendo a referência para a forma orientada a objetos clássica; este
catálogo é a leitura desses mesmos padrões pela lente de patterns.dev, com o exemplo em
JavaScript moderno e a ligação às rules deste repositório. Onde não se sobrepõe
(Rendering e Performance), este catálogo é a única referência.

## Quando usar

| Problema | Pattern |
|---|---|
| Recurso deve ter exatamente uma instância na aplicação | Singleton |
| Interceptar leitura/escrita de um objeto sem alterá-lo | Proxy |
| Compartilhar comportamento entre objetos sem duplicar | Prototype |
| Múltiplos componentes reagem a uma mudança sem se conhecer | Observer |
| Isolar escopo e controlar o que é público | Module |
| Comportamento reutilizável sem herança múltipla | Mixin |
| N componentes evitando N² conexões diretas | Mediator |
| Muitos objetos similares consumindo memória | Flyweight |
| Criar objeto sem o cliente conhecer a classe concreta | Factory |
| Requisição vira objeto: fila, log, undo/redo | Command |
| Evitar prop drilling entre componentes distantes | Provider |
| Entender o que entra no bundle inicial | Static Import |
| Enviar JS só para regiões interativas da página | Islands Architecture |
| Transição visual suave entre dois estados do DOM | View Transitions |
| Ordem de carregamento para otimizar LCP/FCP/FID | Loading Sequence |
| Adiar módulo não essencial ao primeiro paint | Dynamic Import |
| Carregar componente só quando entra na viewport | Import on Visibility |
| Carregar componente só na interação do usuário | Import on Interaction |
| Bundle único demais, tela em branco | Bundle Splitting |
| Checklist de push/render/pre-cache/lazy-load | PRPL |
| Eliminar export nunca importado do bundle | Tree Shaking |
| Recurso crítico descoberto tarde pelo navegador | Preload |
| Recurso provável de uso futuro, sem pressa | Prefetch |
| Script de terceiro pesando na página | Third-Party Loading |
| Lista com milhares de itens travando o scroll | List Virtualization |
| Reduzir peso de transferência do bundle | Compression |

**Nunca escolha o pattern antes do problema.** Aplicar um pattern de performance sem
medição prévia é otimização prematura (rule 069); aplicar um Design Pattern sem
variação real é overengineering (rule 064).

## Como aplicar

1. Nomear o problema concreto — não "quero performance", mas "o LCP mede 4s porque a
   imagem hero é descoberta tarde pelo navegador".
2. Localizar o pattern na tabela acima.
3. Abrir a referência e ler a seção "Quando não aplicar" antes de implementar.
4. Implementar a forma mínima que resolve o problema nomeado no passo 1 — não o
   checklist inteiro do pattern quando só uma parte é necessária.
5. Medir o efeito (bundle size, Core Web Vitals, contagem de re-render) quando o pattern
   for de performance — sem medição, a aplicação do pattern é uma opinião, não um fato.

### Design Patterns

| Pattern | Referência |
|---|---|
| Singleton | [singleton-pattern.md](references/singleton-pattern.md) |
| Proxy | [proxy-pattern.md](references/proxy-pattern.md) |
| Prototype | [prototype-pattern.md](references/prototype-pattern.md) |
| Observer | [observer-pattern.md](references/observer-pattern.md) |
| Module | [module-pattern.md](references/module-pattern.md) |
| Mixin | [mixin-pattern.md](references/mixin-pattern.md) |
| Mediator/Middleware | [mediator-pattern.md](references/mediator-pattern.md) |
| Flyweight | [flyweight-pattern.md](references/flyweight-pattern.md) |
| Factory | [factory-pattern.md](references/factory-pattern.md) |
| Command | [command-pattern.md](references/command-pattern.md) |
| Provider | [provider-pattern.md](references/provider-pattern.md) |
| Static Import | [static-import.md](references/static-import.md) |

### Rendering Patterns

| Pattern | Referência |
|---|---|
| Islands Architecture | [islands-architecture.md](references/islands-architecture.md) |
| View Transitions | [view-transitions.md](references/view-transitions.md) |

### Performance Patterns

| Pattern | Referência |
|---|---|
| Optimize Loading Sequence | [loading-sequence.md](references/loading-sequence.md) |
| Dynamic Import | [dynamic-import.md](references/dynamic-import.md) |
| Import On Visibility | [import-on-visibility.md](references/import-on-visibility.md) |
| Import On Interaction | [import-on-interaction.md](references/import-on-interaction.md) |
| Bundle Splitting | [bundle-splitting.md](references/bundle-splitting.md) |
| PRPL Pattern | [prpl.md](references/prpl.md) |
| Tree Shaking | [tree-shaking.md](references/tree-shaking.md) |
| Preload | [preload.md](references/preload.md) |
| Prefetch | [prefetch.md](references/prefetch.md) |
| Optimize Loading Third-Parties | [third-party.md](references/third-party.md) |
| List Virtualization | [virtual-lists.md](references/virtual-lists.md) |
| Compressing JavaScript | [compression.md](references/compression.md) |

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Singleton injetado, não importado (rule 014) | [singleton-vs-dip.valid.js](examples/singleton-vs-dip.valid.js) | [singleton-vs-dip.invalid.js](examples/singleton-vs-dip.invalid.js) |
| Factory centraliza o switch por tipo (rule 011) | [factory-vs-switch.valid.js](examples/factory-vs-switch.valid.js) | [factory-vs-switch.invalid.js](examples/factory-vs-switch.invalid.js) |
| Observer com cancelamento de inscrição (rule 070) | [observer-unsubscribe.valid.js](examples/observer-unsubscribe.valid.js) | [observer-unsubscribe.invalid.js](examples/observer-unsubscribe.invalid.js) |
| Import dinâmico disparado pela interação real | [dynamic-import-trigger.valid.js](examples/dynamic-import-trigger.valid.js) | [dynamic-import-trigger.invalid.js](examples/dynamic-import-trigger.invalid.js) |

## Checklist

- [ ] O problema foi nomeado antes do pattern ser escolhido
- [ ] A seção "Quando não aplicar" da referência foi lida
- [ ] Para pattern de performance, existe medição (bundle size, Web Vitals) antes e depois
- [ ] Nenhum Singleton acoplado por `import` direto em módulo de alto nível (rule 014)
- [ ] Nenhum Observer sem função de cancelamento de inscrição (rule 070)
- [ ] A implementação é a forma mínima, não o diagrama ou checklist completo do pattern

## Troubleshooting

### Apliquei um pattern de performance e a métrica não mudou

**Causa:** o pattern foi escolhido pela reputação, não por medição prévia do gargalo.
**Solução:** meça antes (Lighthouse, Web Vitals de produção, tamanho de bundle) e depois;
sem os dois números, a mudança é opinião (rule 069).

### O Mediator virou uma classe enorme que ninguém entende

**Causa:** o mediador acumulou toda a lógica de negócio dos componentes que coordena.
**Solução:** é o risco central deste pattern — ele virou o Blob (rule 025) que deveria
evitar. Extraia a lógica de decisão para fora do mediador, mantendo nele só a
coordenação.

### O Mixin escondeu de onde um método vem

**Causa:** trait-object (`Object.assign` no protótipo) não deixa rastro na declaração da
classe.
**Solução:** a skill `mixin` já documenta a forma subclass-factory usada neste
repositório — ela resolve exatamente essa perda de rastreabilidade.

## Referências

- `references/*.md` — um arquivo por pattern, com problema, mecânica, código central em
  JavaScript, quando não aplicar, e a ligação com as rules e skills deste repositório.

Fonte: [patterns.dev/vanilla](https://www.patterns.dev/vanilla/).

## Rules relacionadas

- [011 — Princípio Aberto/Fechado](../../rules/011_principio-aberto-fechado.md): Factory é a exceção que centraliza o switch por tipo; Mediator resolve o mesmo problema entre componentes.
- [014 — Inversão de Dependência](../../rules/014_principio-inversao-dependencia.md): Singleton acoplado por import direto é o antipadrão mais comum contra ela.
- [069 — Proibição de Otimização Prematura](../../rules/069_proibicao-otimizacao-prematura.md): todo pattern de performance deste catálogo exige medição antes de ser aplicado.
- [064 — Proibição de Overengineering](../../rules/064_proibicao-overengineering.md): limita quando um Design Pattern se justifica sobre uma solução direta.
- [070 — Proibição de Estado Mutável Compartilhado](../../rules/070_proibicao-estado-mutavel-compartilhado.md): Observer e Singleton concentram o risco deste catálogo para essa rule.
- [025 — Proibição de The Blob](../../rules/025_proibicao-anti-pattern-the-blob.md): o Mediator é o pattern deste catálogo com maior risco de se tornar um Blob.

## Skills relacionadas

- [gof](../gof/SKILL.md): complements — os padrões do GoF que se sobrepõem a este catálogo (Factory, Observer, Command, Mediator, Flyweight) têm ali a forma orientada a objetos clássica.
- [mixin](../mixin/SKILL.md): depends on — a convenção exata de mixin usada em `packages/mixin/` é a aplicação concreta do pattern genérico aqui catalogado.
- [dataflow](../dataflow/SKILL.md): complements — o event bus declarativo deste repositório é a forma real de Observer, Mediator e Provider entre componentes que não se conhecem.
- [big-o](../big-o/SKILL.md): complements — mede o ganho real de List Virtualization e Flyweight antes de justificá-los.
- [anti-pattern](../anti-pattern/SKILL.md): reinforces — Golden Hammer e Overengineering são o risco de aplicar qualquer pattern deste catálogo sem o problema correspondente.

---

**Criado em**: 2026-09-12
**Atualizado em**: 2026-09-12
**Versão**: 1.0
