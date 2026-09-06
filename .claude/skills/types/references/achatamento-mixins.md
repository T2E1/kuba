# Catálogo de mixins — o que cada um contribui para a superfície pública

Fonte da verdade: `packages/mixin/types.d.ts` e `packages/echo/types.d.ts`
documentam a forma *abstrata* de cada mixin (`HiddenInstance`,
`ValueInstance`, etc.). Nunca importe essas interfaces no `types.d.ts` de um
componente (Regra 1) — esta tabela existe para que você não precise reler o
código-fonte do mixin toda vez; redeclare o(s) membro(s) listado(s)
diretamente na classe do componente, nomeado(s) conforme
`references/taxonomia.md`.

| Mixin | Import de | Contribui para a superfície pública | Forma típica declarada |
|---|---|---|---|
| `Headless` | `@mixin` | Nada. Oculta o elemento no connect; nenhuma propriedade ou método observável. | — (não declare nada) |
| `Hidden` | `@mixin` | `hidden: boolean` — reflete o atributo `hidden`, também alterna um custom state `hidden`. | `boolean` puro, sem tipo nomeado (Regra 4). |
| `Identity` | `@mixin` | `alt: string` — reflete o atributo `alt` e publica `internals.ariaLabel`. Também lê `[role]` do host no connect e publica `internals.role`, mas `[role]` é um Symbol interno: **não** entra no contrato público. | `string` puro. O `alt` é fácil de esquecer porque quem aplica `Identity` normalmente queria só o `role` — ver § "Identity traz `alt` junto". |
| `Disabled` | `@mixin` | `disabled: boolean` — reflete o atributo `disabled` (normalizado por `booleanAttribute`) e espelha o valor em `internals.states`. Herda de um `<fieldset disabled>` ao redor quando o host declara `static formAssociated = true`. | `boolean` puro, sem tipo nomeado (Regra 4). |
| `Height` | `@mixin` | `height: string` — reflete o atributo `height`, padrão `"auto"`. | `string` puro, a menos que o componente restrinja o formato ainda mais. |
| `Width` | `@mixin` | `width: string` — reflete o atributo `width`, padrão `"auto"`. | `string` puro, a menos que o componente restrinja o formato ainda mais. |
| `Value` | `@mixin` | `value: string \| undefined` — reflete o atributo `value`. | `string` puro (adicione `\| undefined` só se o componente realmente puder ficar sem valor — confira o getter na implementação). |
| `Template` | `@mixin` | `template: string` — markup resolvido a partir de um `<template>` referenciado. | `string` puro, somente leitura se a implementação só expuser um getter. |
| `Echo` | `@echo` | `on: <forma de arc string>` — o atributo que conecta um evento de outro elemento a este host (ver `packages/echo/types.d.ts` para a gramática completa do arco: `source/event:type/sink[|filter=value...]`). | Tipo template-literal local ao componente, ex.: `KUBA<PascalName>OnAttribute` — ver `references/formas-atributos.md` § "Arc string (o `on` do Echo)". |

## Como identificar quais mixins estão em jogo

Leia a cadeia de `extends` na declaração de classe do arquivo de
implementação — os mixins se compõem da esquerda para a direita como
chamadas aninhadas e (pelos mixins atuais deste repositório) **a ordem de
composição não muda a superfície pública resultante**, já que cada mixin só
mexe nos hooks de ciclo de vida/membros que ele mesmo possui e sempre
encadeia via `super`:

```ts
class Redirect extends Headless(Echo(HTMLElement)) {}
//                      ^^^^^^^^ ^^^^
//                      contribui `on`
//             ^^^^^^^^ não contribui nada
```

```ts
class Textarea extends Echo(Hidden(Width(HTMLElement))) {}
// contribui: on (Echo), hidden (Hidden), width (Width)
```

Se um mixin não listado aqui aparecer numa cadeia de `extends`, abra a
declaração dele no `types.d.ts` do pacote correspondente (procure por uma
interface `<Nome>Instance`) antes de escrever o tipo do componente — não
adivinhe a forma.

## Echo tem duas faces: `on` e `<kb-on>`

`Echo` contribui o atributo `on` para o `types.d.ts`, mas o mesmo arco pode ser
escrito como um `<kb-on>` filho do elemento — é a forma composta do mesmo
recurso, para quando o arco é longo demais ou múltiplo. As duas faces são o
mesmo contrato, e nenhuma das duas se infere da outra.

Portanto, todo componente cuja cadeia inclui `Echo` documenta **as duas**:

| Onde | O que precisa aparecer |
|---|---|
| `types.d.ts` | O membro `on`, com o tipo template-literal local ao componente |
| `website/docs/components/<nome>.mdx` § Composition | `<kb-on>` como filho aceito, com um exemplo |

Um componente com `Echo` na cadeia e sem menção a `<kb-on>` na seção de
Composição está com a documentação incompleta, mesmo que o `on` esteja
tipado corretamente.

## Identity traz `alt` junto

`Identity` é aplicado quase sempre por causa do `role` — é o mixin que tira o
elemento do anonimato na árvore de acessibilidade. Mas ele contribui **dois**
membros, e só um deles é o motivo pelo qual foi aplicado:

- `[role]` — Symbol interno, implementado pelo host, **fora** do contrato público.
- `alt` — atributo público, que entra no `types.d.ts` e na página de docs.

Aplicar `Identity` para resolver o `role` e não decidir o que fazer com o `alt`
é o erro típico: o componente passa a aceitar um atributo que ninguém
documentou nem escolheu de propósito. Se o `alt` não faz sentido para o
elemento, isso é uma decisão de forma — reporte ao `architect` em vez de
silenciar; o mixin continua contribuindo o membro de qualquer jeito.

## O que nunca entra no contrato

Estes membros existem na implementação mas **não** são superfície pública.
Declará-los publica detalhe interno e obriga o consumidor a um acoplamento que
nenhum modelo do repositório pede:

| Membro | Por quê fica de fora |
|---|---|
| `internals` | Alvo do `attachInternals()` do host. É o canal por onde `Hidden`, `Identity` e `Disabled` publicam semântica — não algo que o consumidor lê ou escreve. O modelo (`src/component/button/types.d.ts`) não o declara. **Vários arquivos do repositório declaram** — `grep -rl internals src --include=types.d.ts` retorna hoje oito deles. São defeitos herdados, não precedente: ver § "Divergência é defeito" abaixo. Um teste que acessa `element.internals` também não torna o membro público — teste alcança detalhe interno por construção. |
| Métodos com nome de Symbol (`[measurable]`, `[identifiable]`, `[disableable]`) | Contrato entre mixin e host, não entre elemento e consumidor. |
| Campos privados (`#alt`, `#disabled`) | Inacessíveis por definição. |

## Divergência é defeito, não pendência

A divergência tem duas direções, e **as duas são defeito**:

| Direção | Sintoma | Exemplo real |
|---|---|---|
| Falta um membro que a cadeia contribui | O consumidor não enxerga um atributo que o elemento aceita | `src/layout/inset/types.d.ts` — cadeia `Identity(Echo(Height(Hidden(Width(HTMLElement)))))`, e nem `alt`, nem `on`, nem `height`, nem `hidden`, nem `width` declarados |
| Sobra um membro que a § acima exclui | O contrato publica detalhe interno e prende o consumidor a ele | o mesmo `inset/types.d.ts`, que declara `internals` |
| Sobra um membro que nenhum getter respalda | O contrato promete uma propriedade JS que não existe em runtime | `layout` em `src/behavior/render/types.d.ts` antes da correção — hook de CSS puro em `style.js`, sem mixin nem getter |

**Esta skill é a autoridade; um `types.d.ts` existente que diverge dela é
defeito, não precedente.** Nunca copie um membro de um arquivo irmão só porque
ele está lá — a pergunta é sempre "que mixin ou getter respalda este membro?",
respondida na cadeia de `extends` e na implementação, nunca por analogia com o
vizinho. O único arquivo que serve de modelo estrutural é
`src/component/button/types.d.ts`, nomeado no passo 3 do fluxo; qualquer outro é
material de leitura, não gabarito.

Corrija no arquivo em que está trabalhando, dentro do escopo da tarefa. Para os
demais, reporte a lista ao orquestrador em vez de silenciar: uma lacuna de
contrato não vista é indistinguível de uma decisão de projeto para quem lê
depois. Não abra uma varredura de todo o `src/component/` por conta própria
(rule 039 cobre o arquivo tocado, não o repositório inteiro) — reportar é o
passo que fecha o ciclo.
