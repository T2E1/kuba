# Formas de atributo — quando e como restringir um atributo string

Todo atributo string refletido começa como candidato a um tipo nomeado e
restrito. Só dê a ele um quando a restrição for real e útil para quem
consome o tipo em tempo de compilação; caso contrário, deixe `string`
(Regra 4 no `SKILL.md`, `.claude/rules/064_proibicao-overengineering.md`).
Este arquivo cataloga as formas já estabelecidas neste repositório para que
um novo `types.d.ts` reaproveite o *padrão*, não o *tipo* (nunca faça
`import` entre pacotes — Regra 1).

## Checklist de decisão antes de escrever um template literal type

Pergunte, nesta ordem:
1. A checagem de literal de string traz valor real para quem consome
   (detecta em tempo de compilação um protocolo, formato ou valor vazio
   digitado errado, para o uso via literal)?
2. A forma pode de fato ser expressa como um template literal type do
   TypeScript (estrutura fixa com segmentos livres), e não algo que exigiria
   parsing/regex de verdade?
3. Quem chama vai realisticamente também atribuir a partir de uma variável
   `string` comum (ex.: construída dinamicamente)? Se sim, o tipo precisa
   manter uma via de escape (ver abaixo) — template literal types só se
   aplicam a *literais* de string, não a valores do tipo `string` em geral.

Se a resposta ao item (1) for não, não escreva um tipo — deixe o membro
como `string`.

## Padrão: atributo tipo URL (estilo `href`)

Usado para um atributo que deve ser uma URL absoluta, um caminho absoluto,
ou um fragmento/query da própria página — protegendo contra um segmento
relativo solto, fácil de confundir com outro tipo de referência (ex.: um
nome de rota).

```ts
type KUBA<PascalName><PascalAttribute>Attribute =
  | `${'http' | 'https'}://${string}`
  | `/${string}`
  | `#${string}`
  | `?${string}`
```

Implementação de referência: `packages/behavior/redirect/types.d.ts`
(`KUBARedirectHrefAttribute`).

## Padrão: Arc string (o `on` do Echo)

Usado sempre que um componente é um host Echo (mixa `Echo` — ver
`references/achatamento-mixins.md`) e expõe o atributo de conexão no seu
próprio tipo público. A gramática é fixada por `packages/echo/echo.js` /
`packages/echo/types.d.ts`: `source/event:type/sink[|filter=value...]`.
Só o segmento `type` é um conjunto fechado de literais; todo o resto
permanece string livre porque template literal types do TypeScript não
conseguem validar gramática arbitrária (conjuntos de caracteres, filtros
repetidos).

```ts
type KUBA<PascalName>OnAttributeSink = 'method' | 'attribute' | 'setter'

type KUBA<PascalName>OnAttribute =
  `${string}/${string}:${KUBA<PascalName>OnAttributeSink}/${string}${'' | `|${string}`}`
```

Implementações de referência: `packages/behavior/redirect/types.d.ts`
(`KUBARedirectOnAttribute`), `packages/behavior/on/types.d.ts`
(`KUBAOnValueAttribute`, aplicado ao próprio atributo `value` de `<kb-on>`
em vez de `on`, já que esse elemento expressa o arco como seu valor
inteiro). Não importe nenhum dos dois em um terceiro componente — copie o
padrão com o nome próprio daquele componente.

## Via de escape para atribuição não-literal

Todo atributo restrito ainda precisa aceitar um valor `string` puro no
nível da propriedade, já que template literal types só validam literais de
string — um valor vindo de uma variável, de uma expressão de template, ou
de entrada externa cai de volta para `string` sem checagem. Una com
`(string & {})` (não com `string` puro, o que colapsaria a união inteira de
volta para `string` e anularia o propósito da checagem de literais) no
membro da classe, não no alias de tipo em si:

```ts
export default class KUBARedirectElement extends HTMLElement {
  href: KUBARedirectHrefAttribute | (string & {})
}
```

Documente essa contrapartida no JSDoc do alias de tipo (conforme a
`jsdoc-standard`) — veja o parágrafo já existente acima de
`KUBARedirectHrefAttribute` em `packages/behavior/redirect/types.d.ts`
para o texto a reaproveitar.

## Padrão: enum fechado codificado como string

Usado para um conjunto pequeno e fixo de valores sem estrutura interna
adicional (sem necessidade de template literal) — ex.: um atributo `type`
ou `variant`. Apenas uma união simples, sem alias nomeado dedicado a menos
que a união seja reaproveitada por mais de um membro do *mesmo* componente
(se for, nomeie como `KUBA<PascalName><PascalAttribute>Attribute` conforme
a taxonomia; se for reaproveitada entre componentes, ainda assim ela é
declarada uma vez por componente — Regra 1).

```ts
type: 'submit' | 'reset'
```

Implementação de referência: `packages/component/button/types.d.ts`.
