---
description: "Receita do Cookbook: um formulário de endereço que preenche estado, cidade, bairro e rua a partir do CEP pela ViaCEP, ligado por arcos do Echo e nenhum JavaScript."
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
  { node: { tag: 'kb-input', name: 'cep', note: 'você digita 01001000' } },
  { arcs: [{ arc: 'cep/changed:method/get', payload: 'detail: "01001000"' }] },
  {
    node: {
      tag: 'kb-fetch',
      name: 'viacep',
      note: 'GET com o CEP no {}',
      external: { host: 'viacep.com.br', path: '/ws/01001000/json/' },
    },
  },
  {
    arcs: [
      { arc: 'viacep/succeeded', payload: 'detail: { estado, localidade, bairro, logradouro, … }', kind: 'ok' },
      { arc: 'viacep/failed', payload: 'detail: o erro', kind: 'fail' },
    ],
  },
  {
    group: {
      tag: 'kb-form',
      name: 'address',
      note: 'cada campo pega o que precisa',
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

# Endereço pelo CEP

Um formulário de endereço de entrega. A pessoa digita o CEP, e estado, cidade,
bairro e rua chegam sozinhos da [ViaCEP](https://viacep.com.br). Se a consulta
falhar, todo campo que depende do endereço volta ao vazio. Um fetch, um
formulário, nenhum JavaScript.

## O código, bloco a bloco

### 1. O formulário e o campo de origem

`<kb-form>` renderiza seu `<template>` dentro de um `<form>` de verdade, então a
validação nativa roda no envio. `autorender` renderiza uma vez ao conectar, em
branco. O campo `cep` é a origem de todo o fluxo: como todo `<kb-input>`, ele
publica `changed` a cada tecla.

```html
<kb-form name="address" aria-label="Endereço de entrega" autorender>
  <template>
    <kb-input name="cep" inputmode="numeric" maxlength="8" required>
      <kb-label>CEP</kb-label>
      <kb-helper>Somente números — 8 dígitos.</kb-helper>
      <kb-validity state="valueMissing">Informe o CEP.</kb-validity>
    </kb-input>
```

`required` é verificado pelo navegador; `<kb-validity state="valueMissing">` é a
mensagem exibida enquanto essa regra falha. `inputmode="numeric"` abre o teclado
numérico no celular, e `maxlength="8"` para o campo num CEP completo.

### 2. Os campos que a API preenche

Cada campo somente leitura carrega dois arcos. Em `succeeded`, escreve o
atributo `value` com uma chave do JSON — o filtro `prop` escolhe qual. Em
`failed`, chama o próprio `reset` e volta ao vazio.

```html
    <kb-input name="estado" readonly>
      <kb-label>Estado</kb-label>
      <kb-on value="viacep/succeeded:attribute/value|prop=estado"></kb-on>
      <kb-on value="viacep/failed:method/reset"></kb-on>
    </kb-input>

    <kb-input name="cidade" readonly>
      <kb-label>Cidade</kb-label>
      <kb-on value="viacep/succeeded:attribute/value|prop=localidade"></kb-on>
      <kb-on value="viacep/failed:method/reset"></kb-on>
    </kb-input>

    <kb-input name="bairro" readonly>
      <kb-label>Bairro</kb-label>
      <kb-on value="viacep/succeeded:attribute/value|prop=bairro"></kb-on>
      <kb-on value="viacep/failed:method/reset"></kb-on>
    </kb-input>

    <kb-input name="rua" readonly>
      <kb-label>Rua</kb-label>
      <kb-on value="viacep/succeeded:attribute/value|prop=logradouro"></kb-on>
      <kb-on value="viacep/failed:method/reset"></kb-on>
    </kb-input>
```

O `name` do campo é o que o formulário envia; o `prop` é como a ViaCEP chama o
dado. Os dois não precisam ser iguais:

| Campo | Chave da ViaCEP |
|---|---|
| `estado` | `estado` |
| `cidade` | `localidade` |
| `bairro` | `bairro` |
| `rua` | `logradouro` |

`readonly` impede a digitação mas mantém o valor nos dados enviados —
`disabled` o descartaria.

### 3. Os campos que a pessoa preenche

Número e complemento não vêm da API, então não têm arco de `succeeded`. Mas
continuam escutando `failed`: um endereço cujo CEP falhou deixou de ser um
endereço, e um número digitado para ele não deve sobreviver.

```html
    <kb-input name="numero" required>
      <kb-label>Número</kb-label>
      <kb-validity state="valueMissing">Informe o número.</kb-validity>
      <kb-on value="viacep/failed:method/reset"></kb-on>
    </kb-input>

    <kb-input name="complemento">
      <kb-label>Complemento</kb-label>
      <kb-on value="viacep/failed:method/reset"></kb-on>
    </kb-input>
```

### 4. As ações

Comportamento comum de formulário. `type="submit"` valida todos os campos e, se
passarem, o `<kb-form>` publica `submitted` com os dados num objeto simples.
`type="reset"` limpa todos os campos e publica `resetted`. `naked` marca
"Limpar" como a ação secundária ao lado da sólida.

```html
    <kb-button type="submit" width="fill">Salvar endereço</kb-button>
    <kb-button type="reset" variant="naked" width="fill">Limpar</kb-button>
  </template>
</kb-form>
```

### 5. O fetch

Fica fora do formulário porque não é um campo. O arco dele chama `get` com o
CEP, que ocupa o `{}` da `url`. Quando a ViaCEP responde, ele publica
`succeeded` com o JSON, ou `failed` com o erro — e os campos acima seguem dali.

```html
<kb-fetch name="viacep" url="https://viacep.com.br/ws/{}/json/">
  <kb-on value="cep/changed:method/get"></kb-on>
</kb-fetch>
```

## O dataflow

<Dataflow :steps="steps" caption="Um evento entra, um JSON sai e se espalha pelos campos. Cada campo decide sozinho o que fazer com ele: copiar uma chave ou voltar ao vazio." />

| Arco | Lê-se |
|---|---|
| `cep/changed:method/get` | quando `cep` mudar, consulte a ViaCEP com o novo valor |
| `viacep/succeeded:attribute/value\|prop=estado` | quando a ViaCEP responder, escreva o `estado` dela no `value` deste campo |
| `viacep/failed:method/reset` | quando a requisição falhar, esvazie este campo |

## Experimente

Digite `01001000` ou `01310100`. A requisição é de verdade — a ViaCEP é pública
e não pede chave.

```html preview
<div style="width: 100%; --form-align: stretch;">
  <kb-form name="address" aria-label="Endereço de entrega" autorender>
    <template>
      <kb-input name="cep" inputmode="numeric" maxlength="8" required>
        <kb-label>CEP</kb-label>
        <kb-helper>Somente números — 8 dígitos.</kb-helper>
        <kb-validity state="valueMissing">Informe o CEP.</kb-validity>
      </kb-input>

      <kb-input name="estado" readonly>
        <kb-label>Estado</kb-label>
        <kb-on value="viacep/succeeded:attribute/value|prop=estado"></kb-on>
        <kb-on value="viacep/failed:method/reset"></kb-on>
      </kb-input>

      <kb-input name="cidade" readonly>
        <kb-label>Cidade</kb-label>
        <kb-on value="viacep/succeeded:attribute/value|prop=localidade"></kb-on>
        <kb-on value="viacep/failed:method/reset"></kb-on>
      </kb-input>

      <kb-input name="bairro" readonly>
        <kb-label>Bairro</kb-label>
        <kb-on value="viacep/succeeded:attribute/value|prop=bairro"></kb-on>
        <kb-on value="viacep/failed:method/reset"></kb-on>
      </kb-input>

      <kb-input name="rua" readonly>
        <kb-label>Rua</kb-label>
        <kb-on value="viacep/succeeded:attribute/value|prop=logradouro"></kb-on>
        <kb-on value="viacep/failed:method/reset"></kb-on>
      </kb-input>

      <kb-input name="numero" required>
        <kb-label>Número</kb-label>
        <kb-validity state="valueMissing">Informe o número.</kb-validity>
        <kb-on value="viacep/failed:method/reset"></kb-on>
      </kb-input>

      <kb-input name="complemento">
        <kb-label>Complemento</kb-label>
        <kb-on value="viacep/failed:method/reset"></kb-on>
      </kb-input>

      <kb-button type="submit" width="fill">Salvar endereço</kb-button>
      <kb-button type="reset" variant="naked" width="fill">Limpar</kb-button>
    </template>
  </kb-form>
</div>

<kb-fetch name="viacep" url="https://viacep.com.br/ws/{}/json/">
  <kb-on value="cep/changed:method/get"></kb-on>
</kb-fetch>
```

O `<div>` em volta existe só nesta página: ele define `--form-align: stretch`
para os campos ocuparem a largura toda.

## Vale saber

### Um CEP incompleto falha de propósito

`changed` dispara a cada tecla, então `0100` também é consultado. A ViaCEP
recusa um CEP mal formado com `400` e um corpo HTML, o `<kb-fetch>` não consegue
lê-lo como JSON, e `failed` sai — o que esvazia todos os campos, número e
complemento incluídos. É a leitura pretendida dos arcos: enquanto o CEP não é
válido, não existe endereço. Se você preferir manter o que a pessoa digitou em
`numero` enquanto ela corrige o CEP, remova o arco de `failed` desse campo.

### Um CEP que não existe não é uma falha

Para um CEP bem formado que não está cadastrado — `99999999` — a ViaCEP responde
`200` com `{ "erro": "true" }`. Isso é `succeeded`, não `failed`: os campos
aplicam `prop` num JSON sem a chave deles, e o `setAttribute` escreve o texto
`undefined`. Trate o caso onde você trata a resposta:

```js
document.querySelector('kb-fetch[name="viacep"]').addEventListener('succeeded', (event) => {
  if (event.detail.erro) {
    // avise que o CEP não foi encontrado e resete o formulário
  }
})
```

### Salvando o endereço

`submitted` carrega todos os campos pelo `name`, inclusive os somente leitura:

```js
document.querySelector('kb-form[name="address"]').addEventListener('submitted', (event) => {
  save(event.detail) // { cep, estado, cidade, bairro, rua, numero, complemento }
})
```

Ou continue declarativo e envie com um segundo `<kb-fetch>` ligado a
`address/submitted:method/post`.

### Os campos vivem no shadow DOM do formulário

`<kb-form>` renderiza o template dentro do próprio shadow root, então
`document.querySelector('kb-input[name="cep"]')` não encontra nada. Os arcos não
se importam: o barramento do Echo vale para a página inteira, e um campo dentro
do formulário casa com um arco pelo `name` como qualquer outro elemento. Leia os
valores do `submitted`, não do DOM.

::: tip
`cep`, `viacep` e `address` são nomes globais no barramento. Numa aplicação,
prefixe-os com a funcionalidade (`checkout-cep`) para que um segundo formulário
na mesma página não se cruze com este.
:::

## Relacionados

- [Busca enquanto digita](/pt-br/build-ui/patterns/search-as-you-type) — o mesmo
  padrão de requisição, renderizado numa lista.
- [Form](/pt-br/components/form), [Input](/pt-br/components/input) e
  [Validity](/pt-br/components/validity) — todos os atributos e eventos usados
  aqui.
- [Eventos e Echo](/pt-br/foundations/events-and-echo) — a gramática do arco e
  seus filtros.
