---
name: poeaa
model: opus
effort: high
description: Catálogo completo dos 51 Patterns of Enterprise Application Architecture de Martin Fowler, organizados nas 9 camadas do livro — lógica de domínio, fonte de dados, mapeamento objeto-relacional estrutural e de metadados, apresentação web, distribuição, concorrência offline, estado de sessão e base patterns. Use ao projetar a camada de domínio ou de persistência, ao decidir entre Transaction Script e Domain Model, entre Active Record e Data Mapper, ao modelar herança relacional, concorrência otimista/pessimista ou estado de sessão. Não use para padrões de design de classe — use a skill gof.
---

# PoEAA

## O que é

Catálogo de Martin Fowler para as decisões estruturais de uma aplicação enterprise: onde
a regra de negócio mora, como ela alcança os dados e como a apresentação conversa com
as duas. Opera uma camada acima do GoF — os padrões daqui compõem os de lá internamente.
Cobre os **51 patterns** do livro, nas **9 camadas** em que ele os organiza.

A decisão central que este catálogo resolve: **quanto de domínio o problema realmente
tem**. Escolher Domain Model para um CRUD é overengineering; escolher Transaction Script
para um domínio rico é dívida garantida.

## Quando usar

| Situação | Decisão |
|---|---|
| Domínio simples, poucas regras | Transaction Script |
| Domínio moderado, lógica por tabela | Table Module |
| Domínio rico, muitas regras interagindo | Domain Model |
| Objeto espelha a linha do banco | Active Record |
| Domínio complexo, isolado da persistência | Data Mapper + Repository |
| Várias operações precisam ser atômicas | Unit of Work |
| A mesma entidade é carregada várias vezes numa requisição | Identity Map |

Não use para padrões internos de classe — isso é `gof`. Este repositório é uma biblioteca
de componentes sem camada de persistência, então a maior parte do catálogo se aplica a
aplicações que **consomem** o kuba, não ao kuba em si.

## Como aplicar

1. Medir a riqueza do domínio antes de escolher a camada de dados. A escolha de
   persistência é consequência, não premissa.
2. Escolher o padrão de domínio (tabela abaixo).
3. Escolher o padrão de fonte de dados compatível com ele.
4. Conferir na referência a seção de quando **não** aplicar.

### Lógica de domínio

| Padrão | Complexidade | Referência |
|---|---|---|
| Transaction Script | Simples | [transaction-script.md](references/transaction-script.md) |
| Table Module | Moderada | [table-module.md](references/table-module.md) |
| Domain Model | Rica | [domain-model.md](references/domain-model.md) |
| Service Layer | Moderada | [service-layer.md](references/service-layer.md) |

### Fonte de dados

| Padrão | Complexidade | Referência |
|---|---|---|
| Row Data Gateway | Simples | [row-data-gateway.md](references/row-data-gateway.md) |
| Table Data Gateway | Simples | [table-data-gateway.md](references/table-data-gateway.md) |
| Active Record | Simples | [active-record.md](references/active-record.md) |
| Data Mapper | Complexa | [data-mapper.md](references/data-mapper.md) |

### Objeto-relacional — estrutural

| Padrão | Referência |
|---|---|
| Identity Field | [identity-field.md](references/identity-field.md) |
| Foreign Key Mapping | [foreign-key-mapping.md](references/foreign-key-mapping.md) |
| Association Table Mapping | [association-table-mapping.md](references/association-table-mapping.md) |
| Dependent Mapping | [dependent-mapping.md](references/dependent-mapping.md) |
| Embedded Value | [embedded-value.md](references/embedded-value.md) |
| Serialized LOB | [serialized-lob.md](references/serialized-lob.md) |
| Single Table Inheritance | [single-table-inheritance.md](references/single-table-inheritance.md) |
| Class Table Inheritance | [class-table-inheritance.md](references/class-table-inheritance.md) |
| Concrete Table Inheritance | [concrete-table-inheritance.md](references/concrete-table-inheritance.md) |
| Inheritance Mappers | [inheritance-mappers.md](references/inheritance-mappers.md) |

### Objeto-relacional — comportamental

| Padrão | Referência |
|---|---|
| Unit of Work | [unit-of-work.md](references/unit-of-work.md) |
| Identity Map | [identity-map.md](references/identity-map.md) |
| Lazy Load | [lazy-load.md](references/lazy-load.md) |

### Objeto-relacional — mapeamento de metadados

| Padrão | Referência |
|---|---|
| Metadata Mapping | [metadata-mapping.md](references/metadata-mapping.md) |
| Query Object | [query-object.md](references/query-object.md) |
| Repository | [repository.md](references/repository.md) |

### Apresentação web

| Padrão | Referência |
|---|---|
| MVC | [mvc.md](references/mvc.md) |
| Page Controller | [page-controller.md](references/page-controller.md) |
| Front Controller | [front-controller.md](references/front-controller.md) |
| Application Controller | [application-controller.md](references/application-controller.md) |
| Template View | [template-view.md](references/template-view.md) |
| Transform View | [transform-view.md](references/transform-view.md) |
| Two Step View | [two-step-view.md](references/two-step-view.md) |

### Distribuição

| Padrão | Referência |
|---|---|
| Remote Facade | [remote-facade.md](references/remote-facade.md) |
| Data Transfer Object | [data-transfer-object.md](references/data-transfer-object.md) |

### Concorrência offline

| Padrão | Referência |
|---|---|
| Optimistic Offline Lock | [optimistic-offline-lock.md](references/optimistic-offline-lock.md) |
| Pessimistic Offline Lock | [pessimistic-offline-lock.md](references/pessimistic-offline-lock.md) |
| Coarse-Grained Lock | [coarse-grained-lock.md](references/coarse-grained-lock.md) |
| Implicit Lock | [implicit-lock.md](references/implicit-lock.md) |

### Estado de sessão

| Padrão | Referência |
|---|---|
| Client Session State | [client-session-state.md](references/client-session-state.md) |
| Server Session State | [server-session-state.md](references/server-session-state.md) |
| Database Session State | [database-session-state.md](references/database-session-state.md) |

### Base patterns

| Padrão | Referência |
|---|---|
| Gateway | [gateway.md](references/gateway.md) |
| Mapper | [mapper.md](references/mapper.md) |
| Layer Supertype | [layer-supertype.md](references/layer-supertype.md) |
| Separated Interface | [separated-interface.md](references/separated-interface.md) |
| Registry | [registry.md](references/registry.md) |
| Value Object | [value-object.md](references/value-object.md) |
| Money | [money.md](references/money.md) |
| Special Case | [special-case.md](references/special-case.md) |
| Plugin | [plugin.md](references/plugin.md) |
| Service Stub | [service-stub.md](references/service-stub.md) |
| Record Set | [record-set.md](references/record-set.md) |

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Domínio isolado da persistência (Data Mapper) vs. acoplado (Active Record) | [data-mapper.valid.js](examples/data-mapper.valid.js) | [data-mapper.invalid.js](examples/data-mapper.invalid.js) |
| Domain Model rico vs. anêmico (regra na entidade vs. regra vazada para o cliente) | [domain-model.valid.js](examples/domain-model.valid.js) | [domain-model.invalid.js](examples/domain-model.invalid.js) |
| Repository com linguagem de domínio vs. Repository que é Middle Man | [repository.valid.js](examples/repository.valid.js) | [repository.invalid.js](examples/repository.invalid.js) |

## Checklist

- [ ] A riqueza do domínio foi medida antes de escolher a camada de dados
- [ ] Nenhuma entidade de domínio conhece SQL, ORM ou driver de banco (rule 014)
- [ ] Nenhum Domain Model onde Transaction Script bastaria (rule 022)
- [ ] Nenhum Repository que apenas repassa chamadas ao ORM (Middle Man, rule 061)
- [ ] O padrão escolhido está documentado como ADR se a decisão foi disputada

## Troubleshooting

### O Repository virou um repasse de chamadas ao ORM

**Causa:** Repository aplicado sobre Active Record, que já expõe a persistência. As duas
camadas fazem a mesma coisa.
**Solução:** ou o Repository ganha linguagem de domínio (`findActiveSubscribers()` em vez
de `findAll(where)`), ou ele é Middle Man e deve sair (rule 061).

### Active Record ficou impossível de testar

**Causa:** é a limitação conhecida do padrão — a entidade herda da infraestrutura, então
testá-la exige banco. Viola DIP (rule 014) por construção.
**Solução:** enquanto o domínio for simples, o trade-off é aceitável e consciente. Quando
deixar de ser, migrar para Data Mapper.

### Escolhemos Domain Model e a maior parte é getter e setter

**Causa:** o domínio não era rico — o modelo virou anêmico, sem comportamento próprio.
**Solução:** Transaction Script resolve com menos cerimônia (rule 022). Domain Model só
compensa quando há regra de negócio de verdade nas entidades (rules 008 e 009).

## Referências

- `references/*.md` — um arquivo por padrão, com intenção, estrutura, trade-offs e
  quando **não** aplicar.

Fonte: Martin Fowler, *Patterns of Enterprise Application Architecture* (2002).

## Rules relacionadas

- [014 — Inversão de Dependência](../../rules/014_principio-inversao-dependencia.md): é o que separa Data Mapper de Active Record.
- [022 — Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md): condiciona Domain Model a existir domínio que o justifique.
- [010 — Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): a proibição de misturar negócio e persistência na mesma classe.
- [061 — Proibição de Middle Man](../../rules/061_proibicao-middle-man.md): o risco mais comum ao adotar Repository.
- [019 — Dependências Estáveis](../../rules/019_principio-dependencias-estaveis.md): domínio é a camada estável; persistência é a volátil.

## Skills relacionadas

- [gof](../gof/SKILL.md): depends on — estes padrões compõem os do GoF internamente.
- [solid](../solid/SKILL.md): depends on — a separação de camadas é DIP aplicado em escala arquitetural.
- [package](../package/SKILL.md): complements — decide em que pacote cada camada mora.
- [adr](../adr/SKILL.md): complements — a escolha entre Active Record e Data Mapper merece registro.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-09-12
**Versão**: 3.0
