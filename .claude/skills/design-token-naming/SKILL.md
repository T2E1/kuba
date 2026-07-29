---
name: design-token-naming
description: Nomeia e revisa design tokens montando o nome a partir de níveis (namespace, object, category, concept, property, variant, state, scale, mode) — baseado na taxonomia de Nathan Curtis (EightShapes). Use quando o usuário pedir para "nomear um token", "criar um design token", "definir a taxonomia de tokens", "revisar nomes de tokens", "organizar variáveis de cor/espaçamento/tipografia", "renomear tokens de tema/dark mode", ou quando estiver estruturando os nomes de um sistema de tokens.
---

# Design Token Naming

Define **como montar o nome de um design token** combinando *níveis*
ordenados. O método vem de "Naming Tokens in Design Systems", de Nathan
Curtis (EightShapes). A regra central: um nome de token é a concatenação de
alguns níveis escolhidos — nunca todos — apenas os necessários para expressar
a **intenção** do token de forma inequívoca.

Antes de nomear ou revisar tokens, leia `references/niveis.md` (o catálogo
completo dos níveis e o que cada um significa). Leia
`references/montagem-e-ordem.md` quando precisar decidir a **ordem** dos
níveis, **quantos** usar, ou tratar **aliasing/polihierarquia**. Leia
`references/armadilhas.md` para homônimos proibidos, promoção de tokens de
componente e o checklist de revisão.

## O modelo em uma frase

```
[ namespace ]  [ object ]  [ base ]                 [ modifier ]
esds-          marquee-    color-feedback-background  error
```

Quatro grupos de níveis, sempre nesta ordem relativa:

1. **Namespace** — agrupamento organizacional (system, theme, domain).
2. **Object** — escopo (componente, grupo de componentes, elemento aninhado).
3. **Base** — a espinha dorsal do token (category, concept, property).
4. **Modifier** — o que ajusta o base (variant, state, scale, mode).

Namespace vem primeiro; object dá contexto; base é o núcleo; modifiers vêm
por último. Detalhe de cada nível em `references/niveis.md`.

## Princípios que guiam toda decisão

- **Inclua só o necessário.** Não empilhe todos os níveis. Cada nível
  presente deve ser indispensável para distinguir a intenção do token de
  outro. Redundância polui o nome.
- **Comece dentro, promova depois.** Um token nasce local no componente. Só
  vire global quando **3+ componentes** compartilharem a mesma decisão. Não
  globalize prematuramente.
- **Homogeneidade dentro de uma classe, heterogeneidade entre classes.**
  Tokens de um mesmo *concept* (ex.: `feedback`) devem parecer parte do mesmo
  grupo; classes diferentes devem ficar visivelmente distintas.
- **Consistência acima de preferência.** Não existe ordem universalmente
  correta. Escolha uma convenção para o sistema e aplique sempre igual —
  especialmente para `mode` (`on-light`/`on-dark` explícito vs. light como
  default implícito).
- **Evite homônimos.** `type` (tipografia vs. categoria), `text` (conteúdo
  vs. tipografia), `size` (dimensão vs. espaço) confundem. Prefira `font` a
  `type`. Ver `references/armadilhas.md`.

## Exemplos de referência (gradação de especificidade)

| Token | Níveis usados |
|---|---|
| `$esds-color-neutral-42` | namespace · category · concept · scale (genérico) |
| `$esds-color-feedback-background-error` | namespace · category · concept · property · variant (semântico) |
| `$esds-input-left-icon-color-fill` | namespace · object (elemento aninhado) · category · property |
| `$esds-marquee-space-inset-2-x-media-query-s` | namespace · object · category · property · scale (responsivo) |
| `$esds-consumer-color-marquee-text-primary` | namespace + domain · category · object · property · variant |

## Fluxo ao nomear um token

1. **Base primeiro.** Defina a espinha dorsal: qual `category` (`color`,
   `space`, `font`, `size`…), qual `concept` agrupa (`feedback`, `action`,
   `neutral`…) e qual `property` (`background`, `text`, `border`…).
2. **Adicione modifiers só se distinguirem.** `variant`, `state`, `scale`,
   `mode` — inclua apenas os que separam este token de outro real.
3. **Decida o escopo (object).** É local do componente? Elemento aninhado
   (padrão BEM: `component-element-...`)? Ou já é compartilhado o bastante
   para virar global?
4. **Prefixe o namespace.** `system` sempre (ex.: `esds-`); `theme` e
   `domain` só quando existirem no sistema.
5. **Revise contra o checklist** de `references/armadilhas.md`: sem
   homônimos, sem níveis redundantes, ordem consistente, nome não contradiz
   o tipo/uso real.

## Quando aplicar aliasing

Se uma decisão poderia morar em mais de um nível (polihierarquia), crie um
alias em vez de duplicar significado — um token de propósito apontando para
um token base:

```
$ui-controls-color-text-error  =  $color-feedback-error
```

Isso mantém a completude semântica no ponto de uso e protege contra
divergência futura. Detalhes e limites em `references/montagem-e-ordem.md`.

## Fonte

Nathan Curtis, "Naming Tokens in Design Systems" (EightShapes, Medium):
https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676
