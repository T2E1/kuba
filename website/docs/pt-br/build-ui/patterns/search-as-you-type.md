---
description: "Receita do Cookbook: um campo de busca que consulta uma API enquanto você digita e renderiza os resultados de um template, ligado por três arcos do Echo e nenhum JavaScript."
---

<script setup>
const steps = [
  { node: { tag: 'kb-input', name: 'breed', note: 'você digita "corgi"' } },
  { arcs: [{ arc: 'breed/changed:method/get', payload: 'detail: "corgi"' }] },
  {
    node: {
      tag: 'kb-fetch',
      name: 'dogs',
      note: 'GET com o payload no {}',
      external: { host: 'api.thedogapi.com', path: '/v1/breeds/search?q=corgi' },
    },
  },
  {
    arcs: [
      { arc: 'dogs/succeeded:method/render', payload: 'detail: [{ name, temperament }, …]', kind: 'ok' },
      { arc: 'dogs/failed:method/clear', payload: 'detail: o erro', kind: 'fail' },
    ],
  },
  { node: { tag: 'kb-render', name: 'resultados', note: 'um card por item' } },
]
</script>

# Busca enquanto digita

Um input que consulta uma API a cada tecla, renderiza os resultados de um
template e os limpa quando a requisição falha. Três elementos, três arcos, nenhum
JavaScript.

## O código, bloco a bloco

### 1. O input publica

`<kb-input>` dispara `changed` a cada tecla, com o valor atual como payload. O
nome importa — `name="breed"` é o que o segmento `source` de um arco compara. O
`<kb-stack>` em volta só organiza o layout; não participa da fiação.

```html
<kb-stack direction="column" spacing="xs" width="fill">
  <kb-input name="breed" width="fill" placeholder="Tente 'akita' ou 'corgi'">
    <kb-label>Buscar raças de cachorro</kb-label>
    <kb-helper>Os resultados atualizam enquanto você digita.</kb-helper>
  </kb-input>
```

### 2. O renderizador assina o resultado

`<kb-render>` interpola seu `<template>` uma vez por item de um array, então uma
lista não precisa de laço: `{name}` e `{temperament}` são lidos de cada item da
resposta. Os dois arcos dizem o que fazer com cada desfecho da requisição —
`succeeded` renderiza a lista, `failed` a limpa.

```html
  <kb-render>
    <kb-on value="dogs/succeeded:method/render"></kb-on>
    <kb-on value="dogs/failed:method/clear"></kb-on>
    <template>
      <kb-card>
        <kb-text size="xs" weight="bold">{name}</kb-text>
        <kb-text size="xxxs" color="master">{temperament}</kb-text>
      </kb-card>
    </template>
  </kb-render>
</kb-stack>
```

Ligar `failed` a `clear` é o que impede resultados velhos de ficarem na tela
depois de uma consulta que falhou. Sem isso, um erro de rede deixa os resultados
anteriores visíveis, parecendo atuais.

### 3. O fetch assina e requisita

`<kb-fetch>` não renderiza nada. O arco dele chama `get` com o valor do input, e
o `{}` na `url` — o placeholder vazio — é substituído pelo payload inteiro.
Quando a resposta chega, ele publica `succeeded` com os dados já parseados, ou
`failed` com o erro.

```html
<kb-fetch name="dogs" url="https://api.thedogapi.com/v1/breeds/search?q={}">
  <kb-headers key="x-api-key" value="DEMO-API-KEY"></kb-headers>
  <kb-on value="breed/changed:method/get"></kb-on>
</kb-fetch>
```

Cada nova requisição aborta a que está em andamento, então respostas fora de
ordem não sobrescrevem resultados mais novos — o que você escreveria à mão com um
`AbortController` e um número de sequência.

## O dataflow

<Dataflow :steps="steps" caption="Nenhum dos três elementos guarda referência a outro. Cada um só conhece o nome da origem que escuta." />

| Arco | Lê-se |
|---|---|
| `breed/changed:method/get` | quando `breed` mudar, chame o `get` deste fetch com o novo valor |
| `dogs/succeeded:method/render` | quando `dogs` der certo, renderize o template uma vez por item |
| `dogs/failed:method/clear` | quando `dogs` falhar, limpe o que foi renderizado |

## Experimente

Digite uma raça. Cada tecla é uma requisição de verdade para a The Dog API.

```html preview
<kb-stack direction="column" spacing="xs" width="fill">
  <kb-input name="breed" width="fill" placeholder="Tente 'akita' ou 'corgi'">
    <kb-label>Buscar raças de cachorro</kb-label>
    <kb-helper>Os resultados atualizam enquanto você digita.</kb-helper>
  </kb-input>

  <kb-render>
    <kb-on value="dogs/succeeded:method/render"></kb-on>
    <kb-on value="dogs/failed:method/clear"></kb-on>
    <template>
      <kb-card>
        <kb-text size="xs" weight="bold">{name}</kb-text>
        <kb-text size="xxxs" color="master">{temperament}</kb-text>
      </kb-card>
    </template>
  </kb-render>
</kb-stack>

<kb-fetch name="dogs" url="https://api.thedogapi.com/v1/breeds/search?q={}">
  <kb-headers key="x-api-key" value="DEMO-API-KEY"></kb-headers>
  <kb-on value="breed/changed:method/get"></kb-on>
</kb-fetch>
```

## Vale saber

### Dispara a cada tecla

`changed` não tem debounce, e filtros de arco não conseguem fazer debounce —
são transformações síncronas do payload e não podem adiar a chamada. Para uma
API real, limite a frequência antes de requisitar. Isso significa trocar o arco
por um listener no input:

```js
let timer
document.querySelector('kb-input').addEventListener('changed', (event) => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    document.querySelector('kb-fetch').get(event.detail)
  }, 300)
})
```

Essa é a fronteira honesta da abordagem declarativa: no momento em que o tempo
entra na conta, um arco é a ferramenta errada. Todo o resto da página continua
declarativo.

### O estado vazio

`<kb-render>` não renderiza nada para um array vazio, então uma busca sem
resultados deixa um espaço em branco em vez de dizer "nenhum resultado". Se a
diferença importa, escute `succeeded` e decida pelo `detail.length`.

### Headers

Uma API que exige chave recebe um filho `<kb-headers>`, um por nome de header.

::: warning
Uma chave no markup fica visível para qualquer pessoa que abra a página. Use isso
só para chaves de demonstração públicas e com limite de uso; qualquer coisa real
fica atrás do seu próprio endpoint.
:::

## Relacionados

- [Eventos e Echo](/pt-br/foundations/events-and-echo) — a gramática do arco
  completa.
- [Fetch](/pt-br/components/fetch) — todos os atributos e eventos.
- [Endereço pelo CEP](/pt-br/build-ui/patterns/address-by-cep) — o mesmo padrão
  de requisição, com a resposta espalhada por um formulário.
