# Taxonomia de nomenclatura

Todo nome declarado no `types.d.ts` de um componente é escopado àquele
componente — nunca a um mixin, nunca a outro componente cujo atributo por
acaso pareça igual. A taxonomia existe para que o leitor consiga identificar,
só pelo nome, a qual contrato de componente um tipo pertence, sem precisar
abrir o arquivo.

`<PascalName>` abaixo sempre significa o segmento do tag name do componente
em PascalCase, exatamente como já aparece no nome da classe exportada no
arquivo de implementação (`kb-redirect` → `Redirect`, `kb-fileupload` →
`Fileupload`). Não invente uma grafia ou abreviação diferente
(`.claude/rules/006_proibicao-nomes-abreviados.md`,
`.claude/rules/035_proibicao-nomes-enganosos.md`).

## A classe do elemento

```
KUBA<PascalName>Element
```

Sempre `export default`, sempre `extends HTMLElement`, independentemente de
quais mixins a implementação de fato compõe — os mixins são um detalhe de
implementação achatado pela Regra 2 do `SKILL.md`.

```ts
export default class KUBARedirectElement extends HTMLElement { /* ... */ }
export default class KUBAFileuploadElement extends HTMLElement { /* ... */ }
```

## Um atributo string com formato restrito

```
KUBA<PascalName><PascalAttribute>Attribute
```

`<PascalAttribute>` é o nome do atributo em PascalCase (`href` → `Href`,
`on` → `On`). Usado sempre que o *formato* de um atributo string vale a
pena ser expresso no sistema de tipos — ver `references/formas-atributos.md`
para as formas comuns e para quando um `string` puro já é suficiente.

```ts
type KUBARedirectHrefAttribute =
  | `${'http' | 'https'}://${string}`
  | `/${string}`
  | `#${string}`
  | `?${string}`
```

Implementação de referência: `packages/behavior/redirect/types.d.ts`
(`KUBARedirectHrefAttribute`).

## Um conjunto fechado de literais usado dentro dessa forma

```
KUBA<PascalName><PascalAttribute>Attribute<Substantivo>
```

Escolha `<Substantivo>` para descrever o que aquele conjunto de literais
representa no domínio deste componente — não precisa coincidir com o
substantivo que outro componente usou para um conjunto estruturalmente
idêntico. `Sink` cabe no segmento "como o payload é aplicado" de um arco no
estilo Echo; um componente diferente restringindo, por exemplo, um sufixo de
unidade usaria `Unit`, um restringindo um verbo HTTP usaria `Method`, e
assim por diante.

```ts
// packages/behavior/redirect/types.d.ts — segmento "como é aplicado" do arco
type KUBARedirectOnAttributeSink = 'method' | 'attribute' | 'setter'

// packages/behavior/on/types.d.ts — mesmo conjunto de literais, nome
// diferente, porque é o próprio contrato de `<kb-on>`, não o do redirect
type KUBAOnValueAttributeSink = 'method' | 'attribute' | 'setter'
```

Sim, `KUBARedirectOnAttributeSink` e `KUBAOnValueAttributeSink` são tipos
estruturalmente idênticos com nomes diferentes vivendo em arquivos
diferentes. Essa duplicação é intencional — ver Regra 1 no `SKILL.md`.

## A interface de um evento customizado disparado

```
<PascalEventName>Event
```

Sem prefixo `KUBA<PascalName>` — o nome do evento já é naturalmente
namespaced pelo que importa para quem escuta (`addEventListener('clicked', ...)`),
e prefixá-lo só deixaria as entradas de `HTMLElementEventMap` mais poluídas
sem ganho de desambiguação, já que a interface fica logo ao lado da classe
que a dispara.

```ts
export interface ClickedEvent extends CustomEvent<void> {}

declare global {
  interface HTMLElementEventMap {
    clicked: ClickedEvent
  }
}
```

## O que nunca recebe nome próprio

- Membros `string`/`boolean`/`number` puros, sem restrição de formato
  (Regra 4 no `SKILL.md`) — ex.: `route: string`, `disabled: boolean`.
- O bloco `declare global { interface HTMLElementTagNameMap { ... } }` —
  boilerplate estrutural, não um conceito de domínio a ser nomeado.
