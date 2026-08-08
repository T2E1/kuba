# mixin

```js
import { Headless, Height, Hidden, Template, Value, Width } from '@t2e1/kuba/mixin'
```

Comportamento de atributo reutilizável. Cada mixin recebe uma classe e devolve
uma subclasse adicionando uma propriedade sustentada por um atributo — compostos
em cadeia:

```js
class Stack extends Hidden(Width(Height(Echo(HTMLElement)))) {}
```

A ordem importa apenas no sentido de que cada um envolve o anterior; as
propriedades não interagem entre si.

## `Hidden(Base)`

Adiciona `hidden`, refletido do atributo `hidden`, e o espelha em
`internals.states` como um custom state `hidden`.

```css
:host(:state(hidden)) { display: none; }
```

O mixin define o estado; **é a folha de estilo do próprio elemento que decide o
que isso significa**. Todo elemento kuba que o usa aplica `display: none`, mas o
mixin não impõe isso.

Definir `hidden = false` também remove o atributo, então o DOM permanece
consistente com a propriedade.

| Membro | Tipo | Padrão |
|---|---|---|
| `hidden` | `boolean` | `false` |

Exige que o host exponha `internals` (um `ElementInternals`), o que todo
elemento kuba faz através de um getter preguiçoso.

## `Headless(Base)`

Esconde o elemento incondicionalmente, aplicando `display: none` nele assim que
conecta. Para elementos que guardam ou buscam dados e não renderizam nada —
`<kb-fetch>`, `<kb-dataset>`, `<kb-filter>`, `<kb-find>`, `<kb-headers>`,
`<kb-on>`, `<kb-redirect>`.

Não adiciona atributo nem propriedade. Não há o que configurar: um elemento que
o usa é invisível por construção.

## `Width(Base)` e `Height(Base)`

Adicionam `width` e `height`, refletidos dos atributos correspondentes e
aplicados diretamente ao host. Ambos usam `@retouch`, então uma mudança de
tamanho reexecuta só a folha de estilo, não o markup.

| Membro | Tipo | Padrão |
|---|---|---|
| `width` | `string` | `'auto'` |
| `height` | `string` | `'auto'` |

Os valores passam por um filtro `resizing`: valores numéricos em px/% são usados
como estão, e as palavras-chave `fill` e `hug` normalizam para `100%` e `auto`.

## `Value(Base)`

Adiciona `value`, mantido em sincronia com o atributo `value`. Sem padrão, sem
transformação — o mais simples do conjunto, para elementos cujo payload é uma
única string.

| Membro | Tipo | Padrão |
|---|---|---|
| `value` | `string \| undefined` | `undefined` |

## `Template(Base)`

Adiciona `template`, resolvendo para o markup de um `<template>` — seja o filho
do próprio elemento, seja um referenciado por id através do atributo `template`.

```html
<kb-render>
  <template>{name}</template>
</kb-render>

<kb-render template="shared-row"></kb-render>
```

Ler a propriedade devolve o `innerHTML` do template, caindo para o `outerHTML`
concatenado dos seus filhos.

!> **Frameworks que criam o `<template>` em JavaScript podem quebrar isso.** O
React anexa os filhos do template à lista de filhos do próprio elemento em vez
de ao seu fragmento `content`, o que deixa o `innerHTML` vazio. O fallback cobre
o caso de elementos, mas descarta nós de texto e espaços entre elementos. Ler a
propriedade antes de o conteúdo do template existir não devolve nada, e nada a
relê depois.

| Membro | Tipo | Descrição |
|---|---|---|
| `template` | `string` | O markup resolvido. Definir o atributo aponta para um `<template>` por id. |
