---
name: poeaa
model: opus
description: Os principais Patterns of Enterprise Application Architecture de Martin Fowler, organizados por camada — lógica de domínio (Transaction Script, Domain Model, Table Module), fonte de dados (Active Record, Data Mapper, Repository, Gateways), objeto-relacional (Unit of Work, Identity Map, Lazy Load) e apresentação web (MVC, Front Controller, Page Controller). Use ao projetar a camada de domínio ou de persistência, ao decidir entre Transaction Script e Domain Model, ou entre Active Record e Data Mapper. Não use para padrões de design de classe — use a skill gof.
---

# PoEAA

## O que é

Catálogo de Martin Fowler para as decisões estruturais de uma aplicação enterprise: onde
a regra de negócio mora, como ela alcança os dados e como a apresentação conversa com
as duas. Opera uma camada acima do GoF — os padrões daqui compõem os de lá internamente.

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

### Fonte de dados

| Padrão | Complexidade | Referência |
|---|---|---|
| Row Data Gateway | Simples | [row-data-gateway.md](references/row-data-gateway.md) |
| Table Data Gateway | Simples | [table-data-gateway.md](references/table-data-gateway.md) |
| Active Record | Simples | [active-record.md](references/active-record.md) |
| Data Mapper | Complexa | [data-mapper.md](references/data-mapper.md) |
| Repository | Complexa | [repository.md](references/repository.md) |

### Objeto-relacional

| Padrão | Referência |
|---|---|
| Unit of Work | [unit-of-work.md](references/unit-of-work.md) |
| Identity Map | [identity-map.md](references/identity-map.md) |
| Lazy Load | [lazy-load.md](references/lazy-load.md) |

### Apresentação web

| Padrão | Referência |
|---|---|
| MVC | [mvc.md](references/mvc.md) |
| Page Controller | [page-controller.md](references/page-controller.md) |
| Front Controller | [front-controller.md](references/front-controller.md) |
| Application Controller | [application-controller.md](references/application-controller.md) |

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Domínio isolado da persistência (Data Mapper) vs. acoplado (Active Record) | [data-mapper.valid.js](examples/data-mapper.valid.js) | [data-mapper.invalid.js](examples/data-mapper.invalid.js) |

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
**Atualizado em**: 2026-08-09
**Versão**: 2.0
