# Busca enquanto digita

Um input que consulta uma API a cada tecla, renderiza os resultados de um
template e os limpa quando a requisição falha. Três elementos, três arcos, nenhum
JavaScript.

## O resultado final

```html preview
<kb-stack direction="column" spacing="xs">
  <kb-input name="breed" placeholder="Tente 'akita' ou 'corgi'">
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
  <kb-on value="breed/changed:method/get"></kb-on>
</kb-fetch>
```

## Como é construído

### 1. O input publica

`<kb-input>` dispara `changed` a cada tecla, com o valor atual como payload.
Nomeá-lo importa — `name="breed"` é com o que o segmento `source` de um arco
casa.

```html
<kb-input name="breed" placeholder="Tente 'akita'"></kb-input>
```

### 2. O fetch assina e requisita

`<kb-fetch>` não renderiza nada. Sua `url` carrega um placeholder `{}`,
substituído pelo payload que chegar ao método `get` — que é exatamente o valor do
input.

```html
<kb-fetch name="dogs" url="https://api.thedogapi.com/v1/breeds/search?q={}">
  <kb-on value="breed/changed:method/get"></kb-on>
</kb-fetch>
```

Cada nova requisição aborta a que está em voo, então respostas fora de ordem não
sobrescrevem resultados mais novos — aquilo que de outra forma você escreveria à
mão com um `AbortController` e um número de sequência.

### 3. O renderizador assina o desfecho

`<kb-fetch>` publica `succeeded` com os dados parseados, ou `failed` com o erro.
`<kb-render>` interpola seu `<template>` uma vez por item do array, então uma
lista não precisa de laço:

```html
<kb-render>
  <kb-on value="dogs/succeeded:method/render"></kb-on>
  <kb-on value="dogs/failed:method/clear"></kb-on>
  <template>
    <kb-card>
      <kb-text size="xs" weight="bold">{name}</kb-text>
    </kb-card>
  </template>
</kb-render>
```

Ligar `failed` a `clear` é o que impede resultados velhos de sobrarem sob uma
consulta que falhou. Sem isso, um erro de rede deixa na tela as correspondências
anteriores, parecendo atuais.

## Coisas que vale saber

### Dispara a cada tecla

`changed` não tem contenção, e filtros de arco não conseguem contê-lo — são
transformações síncronas de payload e não adiam a chamada. Para uma API real,
limite a frequência antes de requisitar. Isso significa trocar o arco por um
listener no input:

```js
let timer
document.querySelector('kb-input').addEventListener('changed', (event) => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    document.querySelector('kb-fetch').get(event.detail)
  }, 300)
})
```

Esse é o limite honesto da abordagem declarativa: no momento em que tempo entra
em cena, um arco é a ferramenta errada. Todo o resto da página continua
declarativo.

### O estado vazio

`<kb-render>` não renderiza nada para um array vazio, então uma consulta sem
correspondências deixa um espaço em branco em vez de dizer "nenhum resultado". Se
a distinção importa, escute `succeeded` e ramifique por `detail.length`.

### Cabeçalhos

Uma API que exige chave recebe um filho `<kb-headers>`, um por nome de cabeçalho:

```html
<kb-fetch name="dogs" url="https://api.thedogapi.com/v1/breeds/search?q={}">
  <kb-headers key="x-api-key" value="SUA-CHAVE"></kb-headers>
  <kb-on value="breed/changed:method/get"></kb-on>
</kb-fetch>
```

!> Uma chave no markup é visível para qualquer pessoa que abrir a página. Use
apenas para chaves públicas de demonstração com limite de uso; algo real
pertence atrás do seu próprio endpoint.

## Relacionados

- [Eventos e Echo](/pt-br/learn/events-and-echo) — a gramática do arco completa.
- [Componentes › Fetch](/pt-br/components/fetch) — cada atributo e evento.
