---
name: solid
model: opus
description: Os 5 princípios SOLID de design orientado a objetos (SRP, OCP, LSP, ISP, DIP), com árvore de diagnóstico para identificar qual princípio uma violação quebrou. Use ao projetar classes e interfaces, ao decidir entre herança e composição, ao revisar código com "esta classe faz coisas demais", "adicionar um tipo novo exige mexer no if", "esta subclasse quebra o pai", "a interface tem método que ninguém usa" ou "o service instancia a classe concreta com new". Não use para organização de pacotes e módulos — use a skill package.
---

# SOLID

## O que é

Cinco princípios de design orientado a objetos formulados por Robert C. Martin. São a
base das rules 010 a 014 deste repositório: cada princípio tem uma rule correspondente
com critérios objetivos e mensuráveis.

## Quando usar

| Situação | Ação |
|---|---|
| Projetando classes e interfaces novas | Aplicar os cinco antes de escrever |
| Code smell detectado, causa incerta | Rodar a árvore de diagnóstico abaixo |
| Adicionar comportamento exige editar classe existente | Violação de OCP — extrair abstração |
| Classe com mais de 7 métodos públicos | Violação de SRP — dividir |
| `new Concreto()` dentro de service | Violação de DIP — injetar abstração |

Não use para decidir a estrutura de pastas e módulos — isso é a skill `package`.
Não aplique DIP em Entidades, Value Objects ou no Root Composer: eles podem instanciar
concretos livremente.

## Como aplicar

| Letra | Princípio | Rule | Pergunta-chave | Detalhe |
|---|---|---|---|---|
| **S** | Single Responsibility | 010 | Esta classe tem uma única razão para mudar? | [srp.md](references/srp.md) |
| **O** | Open/Closed | 011 | Posso adicionar comportamento sem modificar o existente? | [ocp.md](references/ocp.md) |
| **L** | Liskov Substitution | 012 | Posso trocar a base pela derivada sem quebrar? | [lsp.md](references/lsp.md) |
| **I** | Interface Segregation | 013 | Clientes dependem só do que usam? | [isp.md](references/isp.md) |
| **D** | Dependency Inversion | 014 | Alto nível depende de abstração, não de concreto? | [dip.md](references/dip.md) |

### Árvore de diagnóstico

```
Classe muda por múltiplas razões?                      → S: Single Responsibility
Adicionar feature requer modificar classe existente?   → O: Open/Closed
Substituir pai por filho quebra comportamento?         → L: Liskov Substitution
Interface força cliente a implementar método vazio?    → I: Interface Segregation
Service instancia classe concreta com new?             → D: Dependency Inversion
```

### Como os princípios se sustentam

```
DIP ─────> habilita ─────> OCP
 │                          │
 └──> suporta ──> LSP ──────┘
      │
      └──> requer ──> ISP
                       │
                       └──> reforça ──> SRP
```

DIP é a alavanca: inverter a dependência é o que torna OCP possível, e OCP só é seguro
se LSP vale. ISP mantém as abstrações pequenas o bastante para que LSP seja verificável,
e abstrações pequenas empurram as classes para SRP.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| SRP, OCP e DIP violados juntos, e a versão com os cinco aplicados | [multiple-violations.valid.js](examples/multiple-violations.valid.js) | [multiple-violations.invalid.js](examples/multiple-violations.invalid.js) |

## Checklist

- [ ] Nenhuma classe com mais de 7 métodos públicos (SRP, rule 010)
- [ ] Nenhum `if`/`switch` ramificando por *tipo* em mais de 3 casos (OCP, rule 011)
- [ ] Nenhuma subclasse lançando exceção que a base não lança (LSP, rule 012)
- [ ] Nenhuma interface com mais de 5 métodos (ISP, rule 013)
- [ ] Nenhum `new Concreto()` em Service ou Controller (DIP, rule 014)
- [ ] Nenhum `instanceof` em código cliente da abstração (LSP, rule 012)

## Troubleshooting

### Criei uma interface de um método só e o código não melhorou

**Causa:** ISP aplicado mecanicamente onde não há variação real de comportamento.
**Solução:** interface só se justifica com duas implementações reais ou uma fronteira
de teste. Sem isso, é overengineering (rule 064).

### Extraí a abstração mas ainda preciso editar a classe a cada tipo novo

**Causa:** a abstração ficou no lugar errado — o `switch` migrou, não sumiu.
**Solução:** o ponto de extensão precisa ser o local onde o tipo é *escolhido*, e essa
escolha deve viver numa Factory. Ver a exceção de OCP na rule 011.

## Referências

- `references/srp.md`, `references/ocp.md`, `references/lsp.md`, `references/isp.md`,
  `references/dip.md` — cada princípio com sintomas, refatoração e exemplos.

## Rules relacionadas

- [010 — Princípio da Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): o S, com limite de 7 métodos públicos.
- [011 — Princípio Aberto/Fechado](../../rules/011_principio-aberto-fechado.md): o O, com limite de 3 ramificações por tipo.
- [012 — Princípio de Substituição de Liskov](../../rules/012_principio-substituicao-liskov.md): o L, proibindo `instanceof` em código cliente.
- [013 — Princípio de Segregação de Interfaces](../../rules/013_principio-segregacao-interfaces.md): o I, com limite de 5 métodos por interface.
- [014 — Princípio de Inversão de Dependência](../../rules/014_principio-inversao-dependencia.md): o D, proibindo `new` em alto nível.

## Skills relacionadas

- [calisthenics](../calisthenics/SKILL.md): complements — aplica SOLID em nível tático, dentro do método.
- [package](../package/SKILL.md): depends on — os princípios de pacote estendem SOLID a módulos.
- [clean-code](../clean-code/SKILL.md): reinforces — SOLID é um dos pilares do Clean Code.
- [gof](../gof/SKILL.md): complements — os patterns são as formas concretas de satisfazer OCP e DIP.
- [anti-pattern](../anti-pattern/SKILL.md): complements — catálogo do que acontece quando SOLID é ignorado.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-09
**Versão**: 2.0
