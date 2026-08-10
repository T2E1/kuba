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

## Uma nota sobre lacunas existentes

Nem todo `types.d.ts` já existente neste repositório declara hoje todos os
membros contribuídos por seus mixins (por exemplo, alguns hosts de
`Echo`/`Hidden` não listam `on`/`hidden` no seu tipo público atualmente).
Trate esta tabela como o padrão para `types.d.ts` **novos ou em edição** daqui
para frente — não é um mandato para editar em massa arquivos não
relacionados fora do escopo da tarefa em andamento
(`.claude/rules/039_regra-escoteiro-refatoracao-continua.md` cobre apenas o
que está diretamente no escopo de uma edição já em curso).
