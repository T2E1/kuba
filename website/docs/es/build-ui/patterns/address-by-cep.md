---
description: "Receta del Recetario: un formulario de dirección que completa estado, ciudad, barrio y calle a partir de un CEP brasileño con ViaCEP, conectado con arcos de Echo y nada de JavaScript."
---

<script setup>
const fromApi = (name, key) => ({
  name,
  chips: [
    { kind: 'ok', text: `:attribute/value|prop=${key}` },
    { kind: 'fail', text: ':method/reset' },
  ],
})
const resetOnly = (name) => ({ name, chips: [{ kind: 'fail', text: ':method/reset' }] })

const steps = [
  { node: { tag: 'kb-input', name: 'cep', note: 'escribes 01001000' } },
  { arcs: [{ arc: 'cep/changed:method/get', payload: 'detail: "01001000"' }] },
  {
    node: {
      tag: 'kb-fetch',
      name: 'viacep',
      note: 'GET con el CEP en {}',
      external: { host: 'viacep.com.br', path: '/ws/01001000/json/' },
    },
  },
  {
    arcs: [
      { arc: 'viacep/succeeded', payload: 'detail: { estado, localidade, bairro, logradouro, … }', kind: 'ok' },
      { arc: 'viacep/failed', payload: 'detail: el error', kind: 'fail' },
    ],
  },
  {
    group: {
      tag: 'kb-form',
      name: 'address',
      note: 'cada campo toma lo que necesita',
      fields: [
        fromApi('estado', 'estado'),
        fromApi('cidade', 'localidade'),
        fromApi('bairro', 'bairro'),
        fromApi('rua', 'logradouro'),
        resetOnly('numero'),
        resetOnly('complemento'),
      ],
    },
  },
]
</script>

# Dirección por CEP

Un formulario de dirección de entrega para Brasil. La persona escribe el CEP —
el código postal — y estado, ciudad, barrio y calle llegan solos desde
[ViaCEP](https://viacep.com.br). Si la consulta falla, todo campo que depende de
la dirección vuelve a quedar vacío. Un fetch, un formulario, nada de JavaScript.

## El código, bloque a bloque

### 1. El formulario y el campo de origen

`<kb-form>` renderiza su `<template>` dentro de un `<form>` real, así que la
validación nativa corre al enviar. `autorender` lo renderiza una vez al
conectarse, vacío. El campo `cep` es el origen de todo el flujo: como todo
`<kb-input>`, publica `changed` en cada tecla.

```html
<kb-form name="address" aria-label="Dirección de entrega" autorender>
  <template>
    <kb-input name="cep" inputmode="numeric" maxlength="8" required>
      <kb-label>CEP</kb-label>
      <kb-helper>Solo números — 8 dígitos.</kb-helper>
      <kb-validity state="valueMissing">Ingresa un CEP.</kb-validity>
    </kb-input>
```

`required` lo verifica el navegador; `<kb-validity state="valueMissing">` es el
mensaje que se muestra mientras esa regla falla. `inputmode="numeric"` abre el
teclado numérico en el móvil, y `maxlength="8"` detiene el campo en un CEP
completo.

### 2. Los campos que completa la API

Cada campo de solo lectura lleva dos arcos. En `succeeded`, escribe su atributo
`value` con una clave del JSON — el filtro `prop` elige cuál. En `failed`, llama
a su propio `reset` y vuelve a quedar vacío.

```html
    <kb-input name="estado" readonly>
      <kb-label>Estado</kb-label>
      <kb-on value="viacep/succeeded:attribute/value|prop=estado"></kb-on>
      <kb-on value="viacep/failed:method/reset"></kb-on>
    </kb-input>

    <kb-input name="cidade" readonly>
      <kb-label>Ciudad</kb-label>
      <kb-on value="viacep/succeeded:attribute/value|prop=localidade"></kb-on>
      <kb-on value="viacep/failed:method/reset"></kb-on>
    </kb-input>

    <kb-input name="bairro" readonly>
      <kb-label>Barrio</kb-label>
      <kb-on value="viacep/succeeded:attribute/value|prop=bairro"></kb-on>
      <kb-on value="viacep/failed:method/reset"></kb-on>
    </kb-input>

    <kb-input name="rua" readonly>
      <kb-label>Calle</kb-label>
      <kb-on value="viacep/succeeded:attribute/value|prop=logradouro"></kb-on>
      <kb-on value="viacep/failed:method/reset"></kb-on>
    </kb-input>
```

El `name` del campo es lo que envía el formulario; el `prop` es como lo llama
ViaCEP. No tienen por qué coincidir:

| Campo | Clave de ViaCEP |
|---|---|
| `estado` | `estado` |
| `cidade` | `localidade` |
| `bairro` | `bairro` |
| `rua` | `logradouro` |

`readonly` impide escribir pero mantiene el valor en los datos enviados —
`disabled` lo descartaría.

### 3. Los campos que completa la persona

Número y complemento no vienen de la API, así que no tienen arco de
`succeeded`. Pero siguen escuchando `failed`: una dirección cuyo CEP falló ya no
es una dirección, y un número escrito para ella no debería sobrevivir.

```html
    <kb-input name="numero" required>
      <kb-label>Número</kb-label>
      <kb-validity state="valueMissing">Ingresa el número.</kb-validity>
      <kb-on value="viacep/failed:method/reset"></kb-on>
    </kb-input>

    <kb-input name="complemento">
      <kb-label>Complemento</kb-label>
      <kb-on value="viacep/failed:method/reset"></kb-on>
    </kb-input>
```

### 4. Las acciones

Comportamiento normal de formulario. `type="submit"` valida todos los campos y,
si pasan, `<kb-form>` publica `submitted` con los datos en un objeto simple.
`type="reset"` limpia todos los campos y publica `resetted`. `naked` marca
"Limpiar" como la acción secundaria junto a la sólida.

```html
    <kb-button type="submit" width="fill">Guardar dirección</kb-button>
    <kb-button type="reset" variant="naked" width="fill">Limpiar</kb-button>
  </template>
</kb-form>
```

### 5. El fetch

Queda fuera del formulario porque no es un campo. Su arco llama a `get` con el
CEP, que ocupa el `{}` de la `url`. Cuando ViaCEP responde, publica `succeeded`
con el JSON, o `failed` con el error — y los campos de arriba siguen desde ahí.

```html
<kb-fetch name="viacep" url="https://viacep.com.br/ws/{}/json/">
  <kb-on value="cep/changed:method/get"></kb-on>
</kb-fetch>
```

## El flujo de datos

<Dataflow :steps="steps" caption="Entra un evento, sale un JSON y se reparte entre los campos. Cada campo decide por su cuenta qué hacer con él: copiar una clave o volver a quedar vacío." />

| Arco | Se lee |
|---|---|
| `cep/changed:method/get` | cuando `cep` cambie, consulta ViaCEP con el nuevo valor |
| `viacep/succeeded:attribute/value\|prop=estado` | cuando ViaCEP responda, escribe su `estado` en el `value` de este campo |
| `viacep/failed:method/reset` | cuando la petición falle, vacía este campo |

## Pruébalo

Escribe `01001000` o `01310100`. La petición es real — ViaCEP es pública y no
pide clave.

```html preview
<div style="width: 100%; --form-align: stretch;">
  <kb-form name="address" aria-label="Dirección de entrega" autorender>
    <template>
      <kb-input name="cep" inputmode="numeric" maxlength="8" required>
        <kb-label>CEP</kb-label>
        <kb-helper>Solo números — 8 dígitos.</kb-helper>
        <kb-validity state="valueMissing">Ingresa un CEP.</kb-validity>
      </kb-input>

      <kb-input name="estado" readonly>
        <kb-label>Estado</kb-label>
        <kb-on value="viacep/succeeded:attribute/value|prop=estado"></kb-on>
        <kb-on value="viacep/failed:method/reset"></kb-on>
      </kb-input>

      <kb-input name="cidade" readonly>
        <kb-label>Ciudad</kb-label>
        <kb-on value="viacep/succeeded:attribute/value|prop=localidade"></kb-on>
        <kb-on value="viacep/failed:method/reset"></kb-on>
      </kb-input>

      <kb-input name="bairro" readonly>
        <kb-label>Barrio</kb-label>
        <kb-on value="viacep/succeeded:attribute/value|prop=bairro"></kb-on>
        <kb-on value="viacep/failed:method/reset"></kb-on>
      </kb-input>

      <kb-input name="rua" readonly>
        <kb-label>Calle</kb-label>
        <kb-on value="viacep/succeeded:attribute/value|prop=logradouro"></kb-on>
        <kb-on value="viacep/failed:method/reset"></kb-on>
      </kb-input>

      <kb-input name="numero" required>
        <kb-label>Número</kb-label>
        <kb-validity state="valueMissing">Ingresa el número.</kb-validity>
        <kb-on value="viacep/failed:method/reset"></kb-on>
      </kb-input>

      <kb-input name="complemento">
        <kb-label>Complemento</kb-label>
        <kb-on value="viacep/failed:method/reset"></kb-on>
      </kb-input>

      <kb-button type="submit" width="fill">Guardar dirección</kb-button>
      <kb-button type="reset" variant="naked" width="fill">Limpiar</kb-button>
    </template>
  </kb-form>
</div>

<kb-fetch name="viacep" url="https://viacep.com.br/ws/{}/json/">
  <kb-on value="cep/changed:method/get"></kb-on>
</kb-fetch>
```

El `<div>` que lo envuelve existe solo en esta página: define
`--form-align: stretch` para que los campos ocupen todo el ancho.

## Cosas que conviene saber

### Un CEP incompleto falla a propósito

`changed` dispara en cada tecla, así que `0100` también se consulta. ViaCEP
rechaza un CEP mal formado con un `400` y un cuerpo HTML, `<kb-fetch>` no puede
leerlo como JSON, y sale `failed` — que vacía todos los campos, número y
complemento incluidos. Es la lectura buscada de los arcos: mientras el CEP no es
válido, no hay dirección. Si prefieres conservar lo que la persona escribió en
`numero` mientras corrige el CEP, quita el arco de `failed` de ese campo.

### Un CEP que no existe no es un fallo

Para un CEP bien formado que no está registrado — `99999999` — ViaCEP responde
`200` con `{ "erro": "true" }`. Eso es `succeeded`, no `failed`: los campos
aplican `prop` a un JSON sin su clave, y `setAttribute` escribe el texto
`undefined`. Trátalo donde tratas la respuesta:

```js
document.querySelector('kb-fetch[name="viacep"]').addEventListener('succeeded', (event) => {
  if (event.detail.erro) {
    // avisa que el CEP no se encontró y resetea el formulario
  }
})
```

### Guardar la dirección

`submitted` lleva todos los campos por `name`, incluidos los de solo lectura:

```js
document.querySelector('kb-form[name="address"]').addEventListener('submitted', (event) => {
  save(event.detail) // { cep, estado, cidade, bairro, rua, numero, complemento }
})
```

O mantente declarativo y envíalo con un segundo `<kb-fetch>` conectado a
`address/submitted:method/post`.

### Los campos viven en el shadow DOM del formulario

`<kb-form>` renderiza su template dentro de su propio shadow root, así que
`document.querySelector('kb-input[name="cep"]')` no encuentra nada. A los arcos
no les importa: el bus de Echo es de toda la página, y un campo dentro del
formulario coincide con un arco por `name` como cualquier otro elemento. Lee los
valores de `submitted`, no del DOM.

::: tip
`cep`, `viacep` y `address` son nombres globales en el bus. En una aplicación,
ponles el prefijo de la funcionalidad (`checkout-cep`) para que un segundo
formulario en la misma página no se cruce con este.
:::

## Relacionados

- [Búsqueda al escribir](/es/build-ui/patterns/search-as-you-type) — el mismo
  patrón de petición, renderizado en una lista.
- [Form](/es/components/form), [Input](/es/components/input) y
  [Validity](/es/components/validity) — todos los atributos y eventos usados
  aquí.
- [Eventos y Echo](/es/foundations/events-and-echo) — la gramática del arco y
  sus filtros.
