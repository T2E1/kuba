---
name: token
model: sonnet
description: Projeta a arquitetura de design tokens de um design system — nomeia tokens combinando níveis (namespace, object, category, concept, property, variant, state, scale, mode) segundo a taxonomia de Nathan Curtis, decide o namespacing e a promoção de local para global, e aplica os tokens corretamente em CSS. Use quando o usuário pedir para "nomear um token", "criar um design token", "definir a taxonomia de tokens", "revisar nomes de tokens", "organizar a arquitetura de tokens", "renomear tokens de tema/dark mode", quando estiver escrevendo ou revisando CSS com cor, espaçamento ou tipografia, ou quando encontrar valores hardcoded em estilos.
---

# Token

## O que é

Design tokens são as decisões visuais do sistema, nomeadas e centralizadas. Esta
skill cobre as três responsabilidades: **nomear** um token (taxonomia por níveis),
**arquitetar** o conjunto (namespacing, escopo, promoção local → global) e **usar**
o token certo em cada propriedade CSS.

O método de nomenclatura vem de "Naming Tokens in Design Systems", de Nathan Curtis
(EightShapes). A regra central: um nome de token é a concatenação de *alguns* níveis
escolhidos — nunca todos — apenas os necessários para expressar a intenção de forma
inequívoca.

## Quando usar

| Situação | Ação |
|---|---|
| Nomear um token novo | Seguir o fluxo de nomenclatura abaixo; consultar `references/niveis.md` |
| Decidir a ordem dos níveis, ou tratar aliasing | Abrir `references/montagem-e-ordem.md` |
| Revisar nomes existentes | Rodar o checklist e `references/armadilhas.md` |
| Escrever ou revisar CSS de componente | Abrir `references/uso-em-css.md` para o mapeamento propriedade → token |
| Encontrar `#3B82F6`, `16px`, `700` em estilo | Substituir pelo token correspondente |
| Decidir se um token vira global | Aplicar a regra dos 3 componentes |

Não use esta skill para escolher *valores* de cor ou escala — isso é decisão de
design, não de nomenclatura.

## Como aplicar

### Nomear um token

O nome se monta em quatro grupos, sempre nesta ordem relativa:

```
[ namespace ]  [ object ]  [ base ]                    [ modifier ]
esds-          marquee-    color-feedback-background   -error
```

1. **Base primeiro.** Defina a espinha dorsal: qual `category` (`color`, `space`,
   `font`, `size`…), qual `concept` agrupa (`feedback`, `action`, `neutral`…) e qual
   `property` (`background`, `text`, `border`…).
2. **Adicione modifiers só se distinguirem.** `variant`, `state`, `scale`, `mode` —
   inclua apenas os que separam este token de outro que existe de verdade.
3. **Decida o escopo (object).** É local do componente? Elemento aninhado (padrão BEM:
   `component-element-…`)? Ou já é compartilhado o bastante para ser global?
4. **Prefixe o namespace.** `system` sempre; `theme` e `domain` só quando existirem.
5. **Revise** contra o checklist e `references/armadilhas.md`.

### Arquitetar o conjunto

- **Comece dentro, promova depois.** Um token nasce local no componente. Só vire
  global quando **3 ou mais componentes** compartilharem a mesma decisão. Globalizar
  cedo cria acoplamento que ninguém pediu.
- **Homogeneidade dentro da classe, heterogeneidade entre classes.** Tokens de um
  mesmo `concept` devem parecer do mesmo grupo; classes diferentes devem ficar
  visivelmente distintas.
- **Consistência acima de preferência.** Não existe ordem universalmente correta.
  Escolha uma convenção e aplique sempre igual — especialmente para `mode`
  (`on-light`/`on-dark` explícito vs. light como default implícito).
- **Aliasing em vez de duplicação.** Quando uma decisão poderia morar em mais de um
  nível (polihierarquia), crie um alias apontando para o token base:
  `$ui-controls-color-text-error = $color-feedback-error`.

### Usar em CSS

Consultar `references/uso-em-css.md` para o mapeamento completo. As duas regras que
mais quebram na prática:

- `padding` usa `--spacing_inset-*`; `margin` e `gap` usam `--spacing-*`.
- Tom `dark` nunca em `background`; tom `light` nunca em `color` de texto.

## Exemplos

### Gradação de especificidade

| Token | Níveis usados |
|---|---|
| `$esds-color-neutral-42` | namespace · category · concept · scale (genérico) |
| `$esds-color-feedback-background-error` | namespace · category · concept · property · variant (semântico) |
| `$esds-input-left-icon-color-fill` | namespace · object aninhado · category · property |
| `$esds-marquee-space-inset-2-x-media-query-s` | namespace · object · category · property · scale |
| `$esds-consumer-color-marquee-text-primary` | namespace + domain · category · object · property · variant |

### Aplicação em CSS

| Caso | Correto | Incorreto |
|---|---|---|
| Token no lugar de valor literal (rule 024) | [hardcoded-values.valid.css](examples/hardcoded-values.valid.css) | [hardcoded-values.invalid.css](examples/hardcoded-values.invalid.css) |
| Escala certa: inset vs. externo, tom claro vs. escuro | [spacing-and-tone.valid.css](examples/spacing-and-tone.valid.css) | [spacing-and-tone.invalid.css](examples/spacing-and-tone.invalid.css) |

## Checklist

- [ ] Nenhum nível redundante — cada nível presente distingue de um token real
- [ ] Sem homônimos: `font` em vez de `type`; `text` não usado para conteúdo e tipografia ao mesmo tempo
- [ ] Ordem dos níveis igual à do resto do sistema
- [ ] O nome não contradiz o tipo ou o uso real do valor
- [ ] Token local não foi globalizado sem 3+ consumidores
- [ ] Nenhum literal de cor, espaçamento ou tipografia sobrou no CSS
- [ ] `padding` usa `_inset`; `margin` e `gap` não usam
- [ ] Nenhum tom `dark` em `background`, nenhum tom `light` em `color`

## Troubleshooting

### Dois tokens diferentes acabaram com o mesmo nome

**Causa:** faltou um modifier que os distingue, ou o `object` foi omitido.
**Solução:** adicione o menor modifier que separa os dois — não empilhe todos.

### O token não muda no dark mode

**Causa:** o valor foi escrito direto em vez de vir de um token de cor, ou usou-se
`pure-white`/`pure-black`, que são contraste absoluto e não respondem a tema.
**Solução:** trocar por token da paleta semântica correspondente.

### O nome ficou longo demais para ler

**Causa:** empilhamento de todos os níveis por precaução.
**Solução:** remova cada nível e teste se ainda há ambiguidade contra um token real.
O que não desambigua, sai.

## Referências

- `references/niveis.md` — catálogo completo dos níveis e o que cada um significa.
- `references/montagem-e-ordem.md` — ordem dos níveis, quantos usar, aliasing e polihierarquia.
- `references/armadilhas.md` — homônimos proibidos, promoção de tokens de componente, checklist de revisão.
- `references/uso-em-css.md` — mapeamento propriedade → token, escalas, paletas e proibições.

Fonte da taxonomia: Nathan Curtis, "Naming Tokens in Design Systems" (EightShapes)
— https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676

## Rules relacionadas

- [024 — Proibição de Constantes Mágicas](../../rules/024_proibicao-constantes-magicas.md):
  literais em CSS são constantes mágicas; tokens nomeados são a forma de eliminá-las.
- [006 — Proibição de Nomes Abreviados](../../rules/006_proibicao-nomes-abreviados.md):
  níveis do token são escritos por extenso; `bg` e `clr` são proibidos.
- [035 — Proibição de Nomes Enganosos](../../rules/035_proibicao-nomes-enganosos.md):
  homônimos como `type` e `size` desinformam sobre o que o token realmente é.
- [016 — Princípio do Fechamento Comum](../../rules/016_principio-fechamento-comum.md):
  mudanças de tema ficam localizadas nos tokens, sem tocar componentes.
- [023 — Proibição de Funcionalidade Especulativa](../../rules/023_proibicao-funcionalidade-especulativa.md):
  a regra dos 3 componentes impede globalizar tokens antes de existir demanda real.

## Skills relacionadas

- [render](../render/SKILL.md): depends on — os estilos que consomem tokens são aplicados na função `style`.
- [preview](../preview/SKILL.md): complements — as stories documentam visualmente as variantes que os tokens produzem.
- [enum](../enum/SKILL.md): reinforces — mesma disciplina de eliminar literais, aplicada a JavaScript.
- [alphabetical](../alphabetical/SKILL.md): complements — ordenação das propriedades dentro do bloco de estilo.

---

**Criado em**: 2026-08-09
**Atualizado em**: 2026-08-09
**Versão**: 2.0
