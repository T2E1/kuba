---
name: types-standard
description: Projeta e revisa a forma (nomenclatura, estrutura, achatamento de mixins) de arquivos types.d.ts escritos à mão para custom elements do KUBA — web components em JavaScript puro, tipados apenas na fronteira pública. Use quando o usuário pedir para "criar types.d.ts", "tipar este custom element", "adicionar tipo de atributo", "expor um atributo de mixin no types", ou quando um novo pacote de custom element (packages/**/*.ts usando @define) estiver sem seu types.d.ts.
---

# Types Standard

Define como um `types.d.ts` é **estruturado e nomeado** para um pacote de
custom element do KUBA. Esta skill é complementar à `jsdoc-standard` (que
cobre *como escrever os comentários*) — esta skill cobre *o que declarar e
como nomear* antes de qualquer comentário ser adicionado. Sempre finalize um
`types.d.ts` rodando o passo de tipos públicos da skill `jsdoc-standard`
(`references/public-types.md`) sobre ele.

Leia `references/taxonomia.md` e `references/achatamento-mixins.md` antes de
escrever ou editar um `types.d.ts`. Leia `references/formas-atributos.md`
quando o atributo sendo tipado for uma string com formato restrito (URLs,
arc strings, enums codificados como string, etc.).

## Os dois fatos que moldam todas as regras aqui

1. **O código-fonte não é tipado.** Os arquivos `packages/**/*.ts` usam a
   extensão `.ts` apenas para permitir o parsing da sintaxe de decorators
   (ver a nota sobre isso na `jsdoc-standard`) — não existe compilador
   inferindo a forma pública de uma classe a partir da implementação. O
   arquivo `types.d.ts` *é* o contrato; nada mais o gera.
2. **Custom elements são construídos a partir de mixins**, e mixins são
   funções simples (`Echo`, `Headless`, `Hidden`, `Height`, `Width`,
   `Value`, `Template`, …) aplicadas em tempo de execução
   (`class X extends Echo(Hidden(HTMLElement))`). O TypeScript não enxerga
   essa composição porque o código-fonte não é tipado — então **todo
   atributo e método que um mixin contribui para a superfície pública de um
   componente precisa ser declarado manualmente no `types.d.ts` daquele
   componente**, e não herdado da declaração de tipos do mixin.

## Regra 1 — Um `types.d.ts` por pacote, que nunca importa tipos de outro pacote

Todo pacote de custom element (`packages/<categoria>/<nome>/`) possui
exatamente um `types.d.ts`, isolado de todos os demais pacotes de tipos —
incluindo os pacotes de mixin (`@mixin`, `@echo`) cujo comportamento ele
consome.

**Não** faça `import type` de uma forma definida no `types.d.ts` de outro
componente ou mixin, mesmo quando dois componentes usam o mesmo mixin e
produziriam um tipo aparentemente idêntico. Declare o tipo localmente sob o
nome deste componente em vez disso.

```ts
// ✘ Errado — packages/behavior/redirect/types.d.ts alcançando o
// vocabulário de outro pacote. Acopla o contrato público do redirect ao
// do on, e "KUBAOnValueAttribute" é um nome que não significa nada no
// contexto do redirect.
import type { KUBAOnValueAttribute } from '@behavior/on/types'

// ✓ Correto — redirect define seu próprio nome para seu próprio atributo
// `on`, mesmo que a forma coincida com o atributo `value` de `<kb-on>`.
type KUBARedirectOnAttributeSink = 'method' | 'attribute' | 'setter'
type KUBARedirectOnAttribute =
  `${string}/${string}:${KUBARedirectOnAttributeSink}/${string}${'' | `|${string}`}`
```

Isso é uma aplicação direta de `.claude/rules/017_principio-reuso-comum.md`
(CRP) e `.claude/rules/015_principio-equivalencia-lancamento-reuso.md`
(REP) no nível de tipos: quem consome `<kb-redirect>` nunca deveria
precisar saber que `<kb-on>` existe, e o vocabulário de tipos de `<kb-on>`
precisa ser livre para mudar sem forçar um release de `<kb-redirect>`.
Duplicar um tipo de duas linhas entre pacotes é mais barato do que esse
acoplamento — ver a exceção da própria
`.claude/rules/021_proibicao-duplicacao-logica.md` para "pequenas
repetições em definições de baixo nível/estruturais".

## Regra 2 — Todo membro contribuído por mixin é achatado na classe do componente

O `types.d.ts` de um mixin (ex.: `packages/mixin/types.d.ts`,
`packages/echo/types.d.ts`) documenta o que o mixin adiciona *no
abstrato* — leia-o para saber quais atributos/métodos um dado mixin
contribui (ver `references/achatamento-mixins.md` para o catálogo
completo). Mas essa forma abstrata é material de referência, nunca algo que
o `types.d.ts` do componente importa ou estende. Para cada mixin aplicado
no arquivo de implementação do componente, redeclare cada membro
contribuído diretamente como propriedade ou método na própria classe
exportada do componente, exatamente como um membro que o componente
escreveu.

```ts
// redirect.ts: class Redirect extends Headless(Echo(HTMLElement))
export default class KUBARedirectElement extends HTMLElement {
  href: KUBARedirectHrefAttribute | (string & {})   // próprio do Redirect
  route: string                                      // próprio do Redirect
  on: KUBARedirectOnAttribute | (string & {})        // contribuído pelo Echo
  go(params?: Record<string, string>): this          // próprio do Redirect
}
```

`Headless` não contribui nada para a superfície pública (só oculta o
elemento no connect) — não declare nada para ele. Consulte
`references/achatamento-mixins.md` para o que cada mixin de fato
contribui.

## Regra 3 — Taxonomia de nomenclatura

Todo nome gerado é escopado ao componente, nunca ao mixin nem a outro
componente cujo atributo por acaso pareça igual. Tabela completa e exemplos
trabalhados em `references/taxonomia.md`; resumo:

| Construto | Padrão | Exemplo |
|---|---|---|
| A classe do elemento | `KUBA<PascalName>Element` | `KUBARedirectElement` |
| Um atributo string com formato restrito | `KUBA<PascalName><PascalAttribute>Attribute` | `KUBARedirectHrefAttribute` |
| Um conjunto fechado de literais dentro dessa forma | `KUBA<PascalName><PascalAttribute>AttributeSink` (ou o substantivo que couber — `...AttributeUnit`, `...AttributeKind`, etc.) | `KUBARedirectOnAttributeSink` |
| A interface de um evento customizado disparado | `<PascalEventName>Event` | `ClickedEvent` |

`<PascalName>` é sempre o segmento do tag name do componente em
PascalCase (`redirect` → `Redirect`, `fileupload` → `Fileupload`),
igual ao nome da classe já exportada no arquivo de implementação — não
derive uma grafia diferente.

## Regra 4 — Membros com forma simples mantêm o tipo primitivo

Só dê a um membro um tipo nomeado próprio quando a forma precisar de
restrição além do que um primitivo já expressa (uma string em template
literal, uma união fechada). Um atributo booleano vindo de mixin (ex.:
`hidden` do `Hidden`) ou uma `string` sem restrição (ex.: `route`)
permanece exatamente isso — não invente `KUBAXHiddenAttribute = boolean`
por questão de simetria (`.claude/rules/064_proibicao-overengineering.md`).

## Fluxo de trabalho

1. Leia o arquivo de implementação do componente (`<nome>.ts`) por inteiro.
   Liste:
   - cada par getter/setter (→ vira uma propriedade),
   - cada método público,
   - cada mixin na cadeia de `extends`.
2. Para cada mixin encontrado, consulte
   `references/achatamento-mixins.md` e anote o que ele contribui para a
   superfície pública (pode ser nada).
3. Para cada propriedade/método (próprio ou contribuído por mixin), decida
   pela Regra 4 se ele precisa de um tipo nomeado. Se sim, nomeie pela
   Regra 3 e, se o formato seguir um padrão comum (tipo URL, arc string,
   enum como string), confira `references/formas-atributos.md` antes de
   inventar um template literal do zero.
4. Escreva a classe: `export default class KUBA<PascalName>Element extends HTMLElement { ... }`, seguida do bloco `declare global { interface HTMLElementTagNameMap { 'kb-<nome>': KUBA<PascalName>Element } }`.
5. Rode o passo de tipos públicos da skill `jsdoc-standard` sobre o
   resultado — esta skill só decidiu *o que* declarar e *como* nomear;
   aquela decide *o que os comentários dizem*.
6. Verifique o isolamento: `grep -n "^import" types.d.ts` no arquivo recém
   escrito — se ele importar de qualquer outro pacote, a Regra 1 foi
   violada. Todo `types.d.ts` deste repositório está atualmente livre de
   imports; mantenha assim.

## Exemplo rápido — um componente novo usando dois mixins

`packages/behavior/highlight/highlight.ts`:
```ts
@define('kb-highlight')
class Highlight extends Echo(Value(HTMLElement)) {
  get color() { return (this.#color ??= 'yellow') }
  @attributeChanged('color') set color(v) { this.#color = v }
  clear() { this.value = ''; return this }
}
```

`packages/behavior/highlight/types.d.ts` resultante:
```ts
type KUBAHighlightOnAttributeSink = 'method' | 'attribute' | 'setter'
type KUBAHighlightOnAttribute =
  `${string}/${string}:${KUBAHighlightOnAttributeSink}/${string}${'' | `|${string}`}`

export default class KUBAHighlightElement extends HTMLElement {
  color: string
  value: string | undefined  // contribuído pelo Value
  on: KUBAHighlightOnAttribute | (string & {})  // contribuído pelo Echo
  clear(): this
}

declare global {
  interface HTMLElementTagNameMap {
    'kb-highlight': KUBAHighlightElement
  }
}
```
