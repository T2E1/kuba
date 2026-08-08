# Find

Seleciona o **primeiro** registro da coleção do pai cujo campo `key` é igual a
`value`, e o publica. Como o `<kb-filter>`, ele não renderiza nada e dispara o
resultado **no pai**, não em si mesmo — a diferença é que ele devolve um
registro em vez de um array.

```html preview
<kb-dataset id="detail-demo" name="breeds" upsert="id">
  <kb-find key="id" value="2"></kb-find>
</kb-dataset>

<kb-render>
  <kb-on value="breeds/found:method/render"></kb-on>
  <template>
    <kb-card>
      <kb-text size="xs" weight="bold">{name}</kb-text>
      <kb-text size="xxxs" color="master">{temperament}</kb-text>
    </kb-card>
  </template>
</kb-render>

<script type="module">
  const dataset = document.querySelector('#detail-demo')
  requestAnimationFrame(() => {
    dataset.push([
      { id: '1', name: 'Akita', temperament: 'Dócil, corajoso' },
      { id: '2', name: 'Corgi', temperament: 'Tenaz, brincalhão' },
    ])
    document.querySelector('kb-find').value = '2'
  })
</script>
```

## Uso

```html
<kb-dataset name="users" upsert="id">
  <kb-find key="id" value="1"></kb-find>
</kb-dataset>
```

```js
document.querySelector('kb-dataset').addEventListener('found', (event) => {
  showDetail(event.detail) // um registro, ou undefined
})
```

## Quando usar

- **Uma tela de detalhe guiada por uma seleção** — uma lista publica o id
  clicado, um arco o atribui ao `value` deste elemento, e o registro
  correspondente chega ao renderizador de detalhe.
- **Lendo um registro de uma coleção que você já tem**, sem uma segunda
  requisição.

## Quando não usar

- **Várias correspondências.** Este devolve apenas a primeira. Use o
  `<kb-filter>` quando mais de um registro puder casar, mesmo que você espere
  um.
- **Um predicado além de igualdade.** A comparação é um `===` estrito entre o
  campo `key` do registro e `value`.
- **Buscar um registro que você não tem.** Este procura na memória; ele não faz
  requisição nenhuma. Combine com `<kb-fetch>` quando o registro puder não estar
  carregado.

## A inversão do pai

Igual ao `<kb-filter>`: o evento `found` é disparado no `parentElement`, então um
arco precisa nomear o **pai** como origem.

```html
<kb-dataset name="breeds" upsert="id">
  <kb-find key="id" value="2"></kb-find>
</kb-dataset>

<!-- a origem é o dataset, não o find -->
<kb-render>
  <kb-on value="breeds/found:method/render"></kb-on>
</kb-render>
```

!> Um arco apontando para o `name` do próprio elemento find nunca dispara. Este
é o motivo mais provável de uma tela de detalhe ficar vazia.

## Composição

- **Pode conter**: nada.
- **Pode ser filho de**: um elemento que exponha um array em `value` — na
  prática, o `<kb-dataset>`. Ele espera o pai subir antes de lê-lo.

## Guiando a partir de uma seleção

O padrão para o qual este elemento existe — uma lista de cards, cada um
publicando o próprio id, alimentando uma tela de detalhe:

```html
<kb-dataset name="breeds" upsert="id">
  <kb-find key="id" value=""></kb-find>
</kb-dataset>

<kb-render>
  <kb-on value="breeds/changed:method/render"></kb-on>
  <template>
    <kb-card value="{id}"><kb-text size="xxs">{name}</kb-text></kb-card>
  </template>
</kb-render>

<kb-render>
  <kb-on value="breeds/found:method/render"></kb-on>
  <template><kb-text size="sm">{name}</kb-text></template>
</kb-render>
```

O payload do `clicked` do card precisa chegar ao `value` do elemento find —
ligue com um arco no próprio find: `on="kb-card/clicked:setter/value"`.

## Quando ele reavalia

A busca roda quando **`value` muda**, e só então. Um registro empurrado ao pai
depois disso não a redispara; reatribua o `value` para forçar uma nova passada.
Atribuir o *mesmo* valor duas vezes também não necessariamente redispara, já que
o setter roda na mudança de atributo.

## Atributos

| Atributo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `key` | `string` | — | Campo do registro a comparar. |
| `value` | `string` | — | Valor com o qual ele precisa ser igual. Atribuí-lo dispara uma nova passada. |
| `on` | string de arco | — | Ligação do Echo, `origem/evento:tipo/destino`. |

## Eventos

| Evento | Disparado em | `detail` |
|---|---|---|
| `found` | **o elemento pai** | o primeiro registro correspondente, ou `undefined` |

!> **Nenhuma correspondência dispara `undefined`, não um objeto vazio.** Um
consumidor que o interpola — o `<kb-render>`, por exemplo — renderiza
placeholders contra nada em vez de mostrar um estado vazio. Proteja-se disso
quando uma busca sem resultado for possível.

## Estados e acessibilidade

- Headless: sem saída renderizada, sem superfície de acessibilidade.
- Uma região de detalhe que muda sem mover o foco deixa quem usa leitor de tela
  sem saber. Quando a seleção é guiada pela pessoa, mova o foco para a região de
  detalhe ou dê a ela um valor de `aria-live`.

## Certo e errado

| Faça | Não faça |
|---|---|
| Apontar a `origem` do arco para o **pai** | Usar o `name` do próprio elemento find como origem |
| Usar o `<kb-filter>` quando vários registros podem casar | Contar com o `find` e descartar o resto em silêncio |
| Tratar o caso `undefined` de uma busca sem resultado | Supor que um registro sempre volta |
| Reatribuir o `value` para reavaliar depois que novos dados chegam | Esperar que um `push` posterior refaça a busca |
