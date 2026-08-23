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

Implementação de referência: `src/behavior/redirect/types.d.ts`
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

Implementações de referência: `src/behavior/redirect/types.d.ts`
(`KUBARedirectOnAttribute`), `src/behavior/on/types.d.ts`
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
`KUBARedirectHrefAttribute` em `src/behavior/redirect/types.d.ts`
para o texto a reaproveitar.

## Padrão: enum fechado codificado como string

Usado para um conjunto pequeno e fixo de valores sem estrutura interna
adicional (sem necessidade de template literal) — ex.: um atributo `color`,
`variant` ou `type`.

**Se o setter usa `enumerating(ENUM)`** (skill `enum`), o alias nomeado é
**obrigatório**, mesmo para um membro só: `KUBA<PascalName><PascalAttribute>Attribute`,
conforme a taxonomia (Regra 3). Não é opcional por ter um único consumidor —
`KUBAButtonColorAttribute` existe e é usado por `color` sozinho. O nome é o que
liga o tipo ao enum em runtime (`COLORS` em `color.js`) para quem lê o contrato;
uma união anônima esconde essa origem.

```ts
type KUBAButtonColorAttribute =
  | 'master'
  | 'primary'
  | 'complete'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'menu'
```

*(Débito conhecido: `button.type` também usa `enumerating(TYPES)` mas ficou como união
inline `'submit' | 'reset' | 'button'`, sem `KUBAButtonTypeAttribute` — divergência
pré-existente, não corrigida por esta revisão. Um `types.d.ts` novo segue a regra acima,
não esse caso.)*

**União inline sem alias** só se aplica ao caso raro de um conjunto fechado
que **não** vem de um `enumerating(ENUM)` — não há módulo de enum dedicado
para nomear o tipo. Se isso acontecer, vale perguntar primeiro se o setter
deveria estar validando com `enumerating` também (skill `enum`).

Implementação de referência: `src/component/button/types.d.ts`
(`KUBAButtonColorAttribute`, `KUBAButtonVariantAttribute`) e
`src/component/icon/types.d.ts` (`KUBAIconColorAttribute`,
`KUBAIconSizeAttribute`) — duplicado do `button` por decisão de pacote
(Regra 1), não importado.
