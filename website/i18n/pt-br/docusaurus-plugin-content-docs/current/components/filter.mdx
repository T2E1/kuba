# Filter

Estreita a coleção de registros do **pai** comparando o campo `key` de cada
registro contra `value`, e publica os que casam. Ele não renderiza nada e — esta
é a parte que surpreende todo mundo — dispara o resultado **no pai**, não em si
mesmo.

```html preview
<kb-dataset id="stock-demo" name="stock" upsert="id">
  <kb-filter key="available" value="true"></kb-filter>
</kb-dataset>

<kb-render>
  <kb-on value="stock/filtered:method/render"></kb-on>
  <template>
    <kb-text size="xxs">{name} — disponível</kb-text>
  </template>
</kb-render>

<script type="module">
  const dataset = document.querySelector('#stock-demo')
  requestAnimationFrame(() => {
    dataset.push([
      { id: 1, name: 'Akita', available: 'true' },
      { id: 2, name: 'Corgi', available: 'false' },
      { id: 3, name: 'Beagle', available: 'true' },
    ])
    document.querySelector('kb-filter').value = 'true'
  })
</script>
```

## Uso

```html
<kb-dataset name="users" upsert="id">
  <kb-filter key="active" value="true"></kb-filter>
</kb-dataset>
```

```js
document.querySelector('kb-dataset').addEventListener('filtered', (event) => {
  render(event.detail) // os registros que casaram
})
```

## Quando usar

- **Mostrando um subconjunto de uma coleção** — usuários ativos, itens
  disponíveis, uma categoria — guiado por um atributo em vez de por script.
- **Refiltrando a partir do evento de outro elemento**, ligando um arco ao
  `value` deste elemento.

## Quando não usar

- **Predicados complexos.** A comparação é um `===` estrito entre o campo `key`
  do registro e `value`. Não há faixa, não há substring, não há comparação sem
  diferenciar maiúsculas, não há lógica multi-campo. Filtre no seu próprio
  código e empurre o resultado para um segundo `<kb-dataset>` quando a regra for
  mais que igualdade.
- **Filtrar algo que não é uma coleção do pai.** Ele lê `parentElement.value`;
  sem esse pai, ele não faz nada.

## A inversão do pai

Todos os outros elementos da biblioteca disparam os eventos em si mesmos. Este
não:

```html
<kb-dataset name="stock" upsert="id">
  <kb-filter key="available" value="true"></kb-filter>
</kb-dataset>

<!-- A origem do arco é o DATASET, não o filter -->
<kb-render>
  <kb-on value="stock/filtered:method/render"></kb-on>
</kb-render>
```

!> **Ligar um arco ao `name` do próprio filter nunca dispara.** O evento
`filtered` é disparado no `parentElement`, então o segmento de `origem` precisa
casar com o pai — o `name` dele, o `#id` dele, ou o nome da tag
(`kb-dataset`). Este é o motivo mais provável de um filtro "não fazer nada".

O mesmo vale para o `<kb-find>`. É o único lugar onde a regra "um elemento
publica os próprios eventos" da biblioteca não se sustenta.

## Composição

- **Pode conter**: nada. Ele não renderiza shadow DOM.
- **Pode ser filho de**: um elemento que exponha um array em `value` — na
  prática, o `<kb-dataset>`. Ele espera o pai subir antes de lê-lo, então
  declará-lo antes de o pai estar definido é seguro.

Vários filtros sob o mesmo pai publicam cada um o próprio evento `filtered`
naquele pai, de forma independente — eles não compõem um AND. Dois filtros
significam dois eventos com dois conjuntos de resultados diferentes, e o que
disparar por último vence no consumidor.

## Quando ele reavalia

A filtragem roda quando **`value` muda** — esse é o único gatilho. Duas
consequências:

- **É definir o atributo que dispara**, então um filtro com `value` estático
  avalia uma vez, no upgrade, contra o que o pai continha naquele momento.
- **Um `push` posterior no pai não refiltra.** O dataset dispara `changed`, não
  `filtered`. Se a coleção crescer depois, redefina o `value` do filtro para
  forçar uma nova passada, ou ligue o consumidor ao `changed` do pai.

## Atributos

| Atributo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `key` | `string` | — | Campo do registro a comparar. |
| `value` | `string` | — | Valor com o qual ele precisa ser igual. Atribuí-lo dispara uma nova passada. |
| `on` | string de arco | — | Ligação do Echo, `origem/evento:tipo/destino`. |

## Eventos

| Evento | Disparado em | `detail` |
|---|---|---|
| `filtered` | **o elemento pai** | um array dos registros que casaram |

Um resultado vazio publica um array vazio, e não nada — o consumidor ainda
dispara e consegue mostrar um estado vazio.

## Estados e acessibilidade

- Headless: sem saída renderizada, sem superfície de acessibilidade.
- Filtrar muda o que está na tela sem mover o foco nem anunciar nada. Quando um
  filtro é guiado pela pessoa, dê à região de resultados um valor de
  `aria-live` para que a mudança seja perceptível.

## Certo e errado

| Faça | Não faça |
|---|---|
| Apontar a `origem` do arco para o **pai** | Usar o `name` do próprio filter como origem — ele nunca dispara em si mesmo |
| Usá-lo para uma única checagem de igualdade | Esperar faixas, substrings ou lógica multi-campo |
| Redefinir o `value` para reavaliar depois que os dados mudam | Supor que um `push` posterior refiltra automaticamente |
| Ligar o consumidor ao `changed` quando o que importa é a coleção | Empilhar dois filtros esperando que se combinem |
