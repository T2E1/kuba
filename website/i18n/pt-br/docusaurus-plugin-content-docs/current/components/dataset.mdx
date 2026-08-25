# Dataset

Uma coleção de registros em memória, indexada pelo campo nomeado em `upsert`,
que publica `changed` sempre que é mutada. Ele não renderiza nada — é o estado
ao qual outros elementos reagem.

```html preview
<kb-dataset id="people-demo" name="people" upsert="id"></kb-dataset>

<kb-render>
  <kb-on value="people/changed:method/render"></kb-on>
  <template>
    <kb-card>
      <kb-text size="xxs" weight="bold">{name}</kb-text>
      <kb-text size="xxxs" color="master">{role}</kb-text>
    </kb-card>
  </template>
</kb-render>

<script type="module">
  const dataset = document.querySelector('#people-demo')
  requestAnimationFrame(() =>
    dataset.push([
      { id: 1, name: 'Ada Lovelace', role: 'Matemática' },
      { id: 2, name: 'Grace Hopper', role: 'Contra-almirante' },
    ]),
  )
</script>
```

## Uso

```html
<kb-dataset name="users" upsert="id"></kb-dataset>
```

```js
const dataset = document.querySelector('kb-dataset')
dataset.addEventListener('changed', (event) => render(event.detail))
dataset.push({ id: 1, name: 'Ada' })
```

## Quando usar

- **Guardando uma lista a partir da qual a página renderiza** — resultados de
  busca, uma tabela, um carrinho — onde vários elementos devem reagir à mesma
  coleção.
- **Mesclando atualizações parciais em registros existentes** — um patch de
  websocket, uma resposta que devolve só os campos alterados — sem perder o que
  estava guardado.

## Quando não usar

- **Persistência.** Isto é só memória: um reload esvazia. Combine com
  `<kb-fetch>` ou `localStorage` se os dados precisam sobreviver.
- **Um único valor.** Para um registro, ou um escalar, um atributo no elemento
  consumidor é mais simples.
- **Coleções grandes.** Toda mutação dispara a coleção *inteira* como detalhe do
  evento, e os consumidores rerrenderizam do zero.

## Composição

- **Pode conter**: filhos `<kb-filter>` e `<kb-find>`, que leem o `value` deste
  elemento e publicam resultados estreitados **neste elemento**; mais `<kb-on>`
  para arcos. Nada renderiza.
- **Pode ser filho de**: qualquer coisa.

```html
<kb-dataset name="users" upsert="id">
  <kb-filter key="active" value="true"></kb-filter>
</kb-dataset>
```

## A chave de upsert

`upsert` nomeia o campo que identifica um registro. É ele que faz do `push` uma
mesclagem em vez de um acréscimo:

- Um registro cuja chave **casa** com um existente é **mesclado** nele —
  `Object.assign`, então campos ausentes do registro novo mantêm o valor
  guardado. É isso que torna atualizações parciais seguras.
- Um registro **sem valor** para essa chave recebe um uuid gerado, então é
  sempre inserido como novo.
- A chave é escrita de volta no registro guardado, então toda entrada carrega o
  próprio identificador mesmo quando chegou sem um.

```js
dataset.push({ id: 1, name: 'Ada', role: 'Matemática' })
dataset.push({ id: 1, role: 'Condessa' })
// → [{ id: 1, name: 'Ada', role: 'Condessa' }]  — o name sobreviveu
```

!> Com o `upsert` não definido, a chave de todo registro é `undefined`, então
todos colidem numa única entrada mesclada. Defina sempre que os registros
tiverem qualquer identidade.

## Métodos

| Método | Devolve | Descrição |
|---|---|---|
| `push(data)` | `this` | Insere ou mescla um registro ou um array de registros. |
| `delete(key)` | `this` | Remove o registro cujo valor da chave de upsert é igual a `key`. |
| `reset()` | `this` | Limpa todos os registros guardados. |

Os três disparam `changed` em seguida, num tick posterior — a mutação termina de
forma síncrona, o evento vem depois.

## Atributos

| Atributo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `upsert` | `string` | — | Nome do campo usado como chave do registro ao mesclar. |
| `name` | `string` | — | Identifica este elemento como a `origem` de um arco. |
| `on` | string de arco | — | Ligação do Echo, `origem/evento:tipo/destino`. |

## Propriedades

| Propriedade | Tipo | Descrição |
|---|---|---|
| `value` | `unknown[]` | Os registros atuais, na ordem de inserção. Somente leitura. |

## Eventos

| Evento | Dispara quando | `detail` |
|---|---|---|
| `changed` | depois de `push`, `delete` ou `reset` | a coleção completa, como array |

O detalhe é sempre a coleção **inteira**, nunca um delta — os consumidores
renderizam a partir da lista completa toda vez, e é por isso que o `<kb-render>`
não precisa de diffing.

## Ligando a um fetch

O par comum: uma requisição preenche o dataset, e o dataset alimenta a tela.
Nada importa nada.

```html
<kb-fetch name="api" url="/api/users">
  <kb-on value="load/clicked:method/get"></kb-on>
</kb-fetch>

<kb-dataset name="users" upsert="id">
  <kb-on value="api/succeeded:method/push"></kb-on>
</kb-dataset>

<kb-render>
  <kb-on value="users/changed:method/render"></kb-on>
  <template>{name}</template>
</kb-render>
```

## Estados e acessibilidade

- O elemento é headless e não renderiza nada — sem superfície de acessibilidade
  própria.
- Uma coleção que muda sem sinal visível é invisível para quem usa leitor de
  tela. Quando os registros chegam de forma assíncrona, dê à região que os
  renderiza um valor de `aria-live` para que a atualização seja anunciada.

## Certo e errado

| Faça | Não faça |
|---|---|
| Definir `upsert` com um campo identificador de verdade | Deixá-lo indefinido e ver todo registro mesclar num só |
| Empurrar registros parciais para atualizar os guardados | Empurrar uma substituição completa quando só um campo mudou |
| Manter as coleções pequenas o bastante para rerrenderizar inteiras | Guardar milhares de linhas e rerrenderizar a cada mutação |
| Tratá-lo como estado efêmero | Contar que ele sobreviva a um reload |
