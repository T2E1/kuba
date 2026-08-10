---
name: react
model: opus
description: Padrões de design e estratégias de renderização React — Hooks, Compound Components, e a escolha entre CSR, SSR, SSG, ISR e RSC conforme SEO, tempo até interatividade e tamanho de bundle. Use ao implementar componente React numa aplicação que consome o kuba, ao decidir a estratégia de renderização de uma página, ou ao migrar HOC e Render Props para Hooks. Não use para os componentes deste repositório — o kuba é vanilla web components e não tem React como dependência.
---

# React

## O que é

Referência de padrões React baseada em [patterns.dev/react](https://www.patterns.dev/react/).

**Escopo desta skill neste repositório:** o kuba é uma biblioteca de custom elements em
JavaScript puro e **não tem React como dependência** — deliberadamente (rule 068). Esta
skill existe para aplicações React que **consomem** o kuba, não para o código daqui.

Se você está editando `packages/`, esta não é a skill: use `mixin`, `render`, `state` e
`event`.

## Quando usar

| Situação | Ação |
|---|---|
| Aplicação React consumindo custom elements do kuba | Padrões de integração abaixo |
| Escolhendo estratégia de renderização de uma página | Tabela CSR/SSR/SSG/ISR/RSC |
| Migrando HOC ou Render Props | Hooks |
| Editando código em `packages/` | ❌ Não é aqui |

## Como aplicar

### Padrões de design

| Padrão | Status | Quando |
|---|---|---|
| Hooks | Atual | Estado e ciclo de vida em componentes funcionais |
| Compound Components | Atual | Componentes que compartilham estado implicitamente |
| HOC | Legado | Substituir por Hooks quando possível |
| Container/Presentational | Legado | Hooks eliminaram a necessidade |
| Render Props | Legado | Hooks são mais diretos |

### Estratégias de renderização

| Estratégia | SEO | TTI | Bundle | Quando |
|---|---|---|---|---|
| CSR | ❌ | Lento | Grande | Dashboard interno, app muito interativo |
| SSR | ✅ | Médio | Grande | Conteúdo dinâmico com SEO crítico |
| SSG | ✅ | Rápido | Pequeno | Conteúdo estático |
| ISR | ✅ | Rápido | Pequeno | Estático com revalidação periódica |
| RSC | ✅ | Rápido | Mínimo | React 18+ com App Router |

Detalhe em [rendering-overview.md](references/rendering-overview.md).

### Consumindo custom elements do kuba em React

React 19 tem suporte nativo a custom elements — atributos e propriedades são passados
corretamente, e eventos customizados podem ser escutados via ref. Em React 18 e
anteriores, `CustomEvent` exige `addEventListener` por ref, porque a sintaxe `onEvento`
só funciona para eventos sintéticos do React.

O evento precisa ter `composed: true` para atravessar o Shadow DOM até o listener —
skill `event`.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Consumo de custom element do kuba em React | [custom-element.valid.jsx](examples/custom-element.valid.jsx) | [custom-element.invalid.jsx](examples/custom-element.invalid.jsx) |

## Checklist

- [ ] Esta skill não está sendo aplicada a código de `packages/`
- [ ] Nenhum HOC ou Render Props novo — Hooks
- [ ] Estratégia de renderização escolhida por SEO e TTI, não por hábito
- [ ] `CustomEvent` do kuba escutado por ref quando React < 19
- [ ] Nenhuma dependência React adicionada a este repositório

## Troubleshooting

### O evento do custom element não chega no componente React

**Causa:** duas possíveis — `composed: false` no `CustomEvent`, ou tentativa de usar
`onClicked` como prop em React < 19, onde a sintaxe só funciona para eventos sintéticos.
**Solução:** `composed: true` no lado do componente, e `addEventListener` via ref no lado
React.

### O atributo passado vira string `"[object Object]"`

**Causa:** objeto passado como atributo HTML. Atributo é sempre string.
**Solução:** atribuir à propriedade via ref, ou serializar. O contrato do `types.d.ts`
diz qual é qual.

## Referências

- `references/rendering-overview.md` — comparação completa das estratégias de renderização.

## Rules relacionadas

- [068 — Proibição do Martelo de Ouro](../../rules/068_proibicao-martelo-de-ouro.md): a razão de o kuba não ter React — nenhum framework entra sem problema que o justifique.
- [067 — Proibição de Dependência Barco-Âncora](../../rules/067_proibicao-dependencia-barco-ancora.md): se esta skill nunca for usada, ela mesma é candidata a remoção.
- [064 — Proibição de Overengineering](../../rules/064_proibicao-overengineering.md): escolher RSC para uma página estática é complexidade sem ganho.
- [011 — Princípio Aberto/Fechado](../../rules/011_principio-aberto-fechado.md): Compound Components são OCP em nível de componente.

## Skills relacionadas

- [event](../event/SKILL.md): depends on — `composed: true` é o que permite ao React escutar.
- [types](../types/SKILL.md): depends on — o contrato que diz o que é atributo e o que é propriedade.
- [gof](../gof/SKILL.md): complements — Compound Components é Composite; HOC é Decorator.
- [anti-pattern](../anti-pattern/SKILL.md): complements — HOC e Render Props mantidos hoje são Lava Flow.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-10
**Versão**: 2.0
