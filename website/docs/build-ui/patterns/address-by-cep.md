---
description: "Cookbook recipe: an address form that fills state, city, neighborhood and street from a Brazilian CEP via ViaCEP, wired with Echo arcs and no JavaScript."
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
  { node: { tag: 'kb-input', name: 'cep', note: 'you type 01001000' } },
  { arcs: [{ arc: 'cep/changed:method/get', payload: 'detail: "01001000"' }] },
  {
    node: {
      tag: 'kb-fetch',
      name: 'viacep',
      note: 'GET with the CEP in {}',
      external: { host: 'viacep.com.br', path: '/ws/01001000/json/' },
    },
  },
  {
    arcs: [
      { arc: 'viacep/succeeded', payload: 'detail: { estado, localidade, bairro, logradouro, … }', kind: 'ok' },
      { arc: 'viacep/failed', payload: 'detail: the error', kind: 'fail' },
    ],
  },
  {
    group: {
      tag: 'kb-form',
      name: 'address',
      note: 'each field takes what it needs',
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

# Address by CEP

A delivery address form for Brazil. The user types the CEP — the postal code —
and state, city, neighborhood and street arrive from
[ViaCEP](https://viacep.com.br) on their own. If the lookup fails, every field
that depends on the address goes back to empty. One fetch, one form, no
JavaScript.

## The code, block by block

### 1. The form and the source field

`<kb-form>` renders its `<template>` into a real `<form>`, so native validation
runs on submit. `autorender` renders it once on connect, blank. The `cep` field
is the source of the whole flow: like every `<kb-input>`, it publishes `changed`
on each keystroke.

```html
<kb-form name="address" aria-label="Delivery address" autorender>
  <template>
    <kb-input name="cep" inputmode="numeric" maxlength="8" required>
      <kb-label>CEP</kb-label>
      <kb-helper>Numbers only — 8 digits.</kb-helper>
      <kb-validity state="valueMissing">Enter a CEP.</kb-validity>
    </kb-input>
```

`required` is checked by the browser; `<kb-validity state="valueMissing">` is the
message shown while that one rule fails. `inputmode="numeric"` brings up the
number pad on phones, and `maxlength="8"` stops the field at a full CEP.

### 2. The fields the API fills

Each read-only field carries two arcs. On `succeeded`, it writes its `value`
attribute with one key of the JSON — the `prop` filter picks which. On `failed`,
it calls its own `reset` and goes back to empty.

```html
    <kb-input name="estado" readonly>
      <kb-label>State</kb-label>
      <kb-on value="viacep/succeeded:attribute/value|prop=estado"></kb-on>
      <kb-on value="viacep/failed:method/reset"></kb-on>
    </kb-input>

    <kb-input name="cidade" readonly>
      <kb-label>City</kb-label>
      <kb-on value="viacep/succeeded:attribute/value|prop=localidade"></kb-on>
      <kb-on value="viacep/failed:method/reset"></kb-on>
    </kb-input>

    <kb-input name="bairro" readonly>
      <kb-label>Neighborhood</kb-label>
      <kb-on value="viacep/succeeded:attribute/value|prop=bairro"></kb-on>
      <kb-on value="viacep/failed:method/reset"></kb-on>
    </kb-input>

    <kb-input name="rua" readonly>
      <kb-label>Street</kb-label>
      <kb-on value="viacep/succeeded:attribute/value|prop=logradouro"></kb-on>
      <kb-on value="viacep/failed:method/reset"></kb-on>
    </kb-input>
```

The field's `name` is what the form submits; the `prop` is what ViaCEP calls it.
They don't have to match:

| Field | ViaCEP key |
|---|---|
| `estado` | `estado` |
| `cidade` | `localidade` |
| `bairro` | `bairro` |
| `rua` | `logradouro` |

`readonly` blocks typing but keeps the value in the submitted data —
`disabled` would drop it.

### 3. The fields the user fills

Number and complement don't come from the API, so they have no `succeeded` arc.
They still listen to `failed`: an address whose CEP failed is no longer an
address, and a number typed for it shouldn't survive.

```html
    <kb-input name="numero" required>
      <kb-label>Number</kb-label>
      <kb-validity state="valueMissing">Enter the number.</kb-validity>
      <kb-on value="viacep/failed:method/reset"></kb-on>
    </kb-input>

    <kb-input name="complemento">
      <kb-label>Complement</kb-label>
      <kb-on value="viacep/failed:method/reset"></kb-on>
    </kb-input>
```

### 4. The actions

Plain form behavior. `type="submit"` validates every field and, if they pass,
`<kb-form>` publishes `submitted` with the data as a plain object.
`type="reset"` clears every field and publishes `resetted`. `naked` marks
"Clear" as the secondary action next to the solid one.

```html
    <kb-button type="submit" width="fill">Save address</kb-button>
    <kb-button type="reset" variant="naked" width="fill">Clear</kb-button>
  </template>
</kb-form>
```

### 5. The fetch

It sits outside the form because it isn't a field. Its arc calls `get` with the
CEP, which fills the `{}` in the `url`. When ViaCEP answers it publishes
`succeeded` with the JSON, or `failed` with the error — and the fields above take
it from there.

```html
<kb-fetch name="viacep" url="https://viacep.com.br/ws/{}/json/">
  <kb-on value="cep/changed:method/get"></kb-on>
</kb-fetch>
```

## The dataflow

<Dataflow :steps="steps" caption="One event in, one JSON out, spread across the fields. Each field decides on its own what to do with it: copy one key, or go back to empty." />

| Arc | Reads as |
|---|---|
| `cep/changed:method/get` | when `cep` changes, request ViaCEP with the new value |
| `viacep/succeeded:attribute/value\|prop=estado` | when ViaCEP answers, write its `estado` into this field's `value` |
| `viacep/failed:method/reset` | when the request fails, empty this field |

## Try it

Type `01001000` or `01310100`. The request is real — ViaCEP is public and needs
no key.

```html preview
<div style="width: 100%; --form-align: stretch;">
  <kb-form name="address" aria-label="Delivery address" autorender>
    <template>
      <kb-input name="cep" inputmode="numeric" maxlength="8" required>
        <kb-label>CEP</kb-label>
        <kb-helper>Numbers only — 8 digits.</kb-helper>
        <kb-validity state="valueMissing">Enter a CEP.</kb-validity>
      </kb-input>

      <kb-input name="estado" readonly>
        <kb-label>State</kb-label>
        <kb-on value="viacep/succeeded:attribute/value|prop=estado"></kb-on>
        <kb-on value="viacep/failed:method/reset"></kb-on>
      </kb-input>

      <kb-input name="cidade" readonly>
        <kb-label>City</kb-label>
        <kb-on value="viacep/succeeded:attribute/value|prop=localidade"></kb-on>
        <kb-on value="viacep/failed:method/reset"></kb-on>
      </kb-input>

      <kb-input name="bairro" readonly>
        <kb-label>Neighborhood</kb-label>
        <kb-on value="viacep/succeeded:attribute/value|prop=bairro"></kb-on>
        <kb-on value="viacep/failed:method/reset"></kb-on>
      </kb-input>

      <kb-input name="rua" readonly>
        <kb-label>Street</kb-label>
        <kb-on value="viacep/succeeded:attribute/value|prop=logradouro"></kb-on>
        <kb-on value="viacep/failed:method/reset"></kb-on>
      </kb-input>

      <kb-input name="numero" required>
        <kb-label>Number</kb-label>
        <kb-validity state="valueMissing">Enter the number.</kb-validity>
        <kb-on value="viacep/failed:method/reset"></kb-on>
      </kb-input>

      <kb-input name="complemento">
        <kb-label>Complement</kb-label>
        <kb-on value="viacep/failed:method/reset"></kb-on>
      </kb-input>

      <kb-button type="submit" width="fill">Save address</kb-button>
      <kb-button type="reset" variant="naked" width="fill">Clear</kb-button>
    </template>
  </kb-form>
</div>

<kb-fetch name="viacep" url="https://viacep.com.br/ws/{}/json/">
  <kb-on value="cep/changed:method/get"></kb-on>
</kb-fetch>
```

The wrapping `<div>` is only for this page: it sets `--form-align: stretch` so the
fields span the width.

## Things worth knowing

### An incomplete CEP fails on purpose

`changed` fires per keystroke, so `0100` is requested too. ViaCEP rejects a
malformed CEP with a `400` and an HTML body, `<kb-fetch>` can't parse it as
JSON, and `failed` goes out — which empties every field, number and complement
included. That's the intended reading of the arcs: while the CEP isn't valid,
there is no address. If you'd rather keep what the user typed in `numero` while
they fix the CEP, remove that field's `failed` arc.

### A CEP that doesn't exist is not a failure

For a well-formed CEP that isn't registered — `99999999` — ViaCEP answers `200`
with `{ "erro": "true" }`. That is `succeeded`, not `failed`: the fields run
`prop` against a JSON without their key, and `setAttribute` writes the string
`undefined`. Handle it where you handle the response:

```js
document.querySelector('kb-fetch[name="viacep"]').addEventListener('succeeded', (event) => {
  if (event.detail.erro) {
    // tell the user the CEP wasn't found, and reset the form
  }
})
```

### Saving the address

`submitted` carries every field by `name`, the read-only ones included:

```js
document.querySelector('kb-form[name="address"]').addEventListener('submitted', (event) => {
  save(event.detail) // { cep, estado, cidade, bairro, rua, numero, complemento }
})
```

Or keep it declarative and post it with a second `<kb-fetch>` wired to
`address/submitted:method/post`.

### The fields live in the form's shadow DOM

`<kb-form>` renders its template inside its own shadow root, so
`document.querySelector('kb-input[name="cep"]')` finds nothing. The arcs don't
care: Echo's bus is page-wide, and a field inside the form matches an arc by
`name` like any other element. Read values from `submitted`, not from the DOM.

::: tip
`cep`, `viacep` and `address` are page-wide names on the bus. In an application,
prefix them with the feature (`checkout-cep`) so a second form on the same page
can't cross-wire with this one.
:::

## Related

- [Search as you type](/build-ui/patterns/search-as-you-type) — the same request
  pattern, rendered into a list.
- [Form](/components/form), [Input](/components/input) and
  [Validity](/components/validity) — every attribute and event used here.
- [Events and Echo](/foundations/events-and-echo) — the arc grammar and its
  filters.
