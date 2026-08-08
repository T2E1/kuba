# spark

```js
import spark, { equals, gt, len, not, prop, truthy } from '@t2e1/kuba/spark'
```

O registro de operadores por trás dos filtros de arco do
[Echo](/pt-br/build-elements/echo). Cada operador é uma função pura de
`(data, value)` que transforma um payload no caminho entre um publicador e um
destino.

```html
<kb-text on="user/changed:setter/textContent|prop=email"></kb-text>
```

## O registro

| Nome | `(data, value)` devolve |
|---|---|
| `prop` | `data[value]` — a propriedade nomeada do payload |
| `equals` | se `data` é igual a `value` |
| `different` | se `data` difere de `value` |
| `not` | a negação de `data` |
| `truthy` | se `data` é truthy |
| `len` | o comprimento de `data` |
| `add` / `subtract` | `data` mais / menos `value` |
| `inc` / `dec` | `data` incrementado / decrementado |
| `gt` / `gte` | se `data` é maior que / pelo menos `value` |
| `lt` / `lte` | se `data` é menor que / no máximo `value` |
| `always` | `value`, ignorando `data` |

Cada um também é importável diretamente, para uso fora de um arco.

## `spark.get(name)`

Resolve um operador pelo nome.

!> **Um nome desconhecido resolve para a função identidade**, não para um erro.
É isso que torna um erro de digitação num filtro de arco silencioso: o payload
passa intacto e nada reporta.

## `spark.set(name, fn)`

Registra um operador, ou substitui um existente. Devolve `spark`, então os
registros encadeiam.

```js
import spark from '@t2e1/kuba/spark'

spark
  .set('uppercase', (value) => String(value).toUpperCase())
  .set('slice', (value, size) => String(value).slice(0, Number(size)))
```

```html
<kb-text on="user/changed:setter/textContent|prop=name|uppercase"></kb-text>
```

Registre antes que os arcos que o usam conectem — um elemento que sobe primeiro
resolve o nome para identidade e mantém essa resolução para aquele arco.

## O que não pode ser um operador

Operadores são **transformações síncronas de um valor**. Eles recebem um payload
e devolvem um payload; não conseguem adiar, descartar nem agrupar a chamada ao
destino.

Isso descarta toda uma categoria que costuma ser a primeira tentativa:

- **`debounce` / `throttle`** — precisariam atrasar a chamada. Faça o throttle
  dentro do método de destino.
- **Qualquer coisa assíncrona** — uma promise seria repassada como o payload.
- **Roteamento condicional** — um operador pode devolver `false`, mas o destino
  ainda é invocado com esse valor. Não existe "não chame".
