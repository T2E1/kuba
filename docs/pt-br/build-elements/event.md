# event

```js
import on, {
  customEvent,
  dataset,
  detail,
  files,
  formData,
  prevent,
  stop,
  value,
} from '@t2e1/kuba/event'
```

Escutar dentro do seu próprio componente, e construir os eventos que ele
publica. Onde o [`echo`](/pt-br/build-elements/echo) conecta *elementos*, este
pacote conecta um elemento ao *seu próprio* shadow DOM.

## `on.<tipo>(selector, ...filtros)`

Fábrica de decorator de método. `on` é um proxy, então qualquer tipo de evento
funciona: `on.click`, `on.input`, `on.submit`, `on.clicked`.

```js
@on.input('input', value)
[change](newValue) {
  this.value = newValue
  return this
}
```

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `type` | nome de propriedade | O tipo de evento a escutar. |
| `selector` | `string` | Comparado com `event.target`; o método só roda se casar. |
| `...filters` | `(event) => unknown` | Aplicados em ordem; o resultado é o argumento do método. |

Três propriedades que definem o comportamento dele:

- **O listener está no `shadowRoot`, não no host.** Ele só vê eventos que
  nascem dentro do componente. Um evento disparado no próprio host nunca o
  aciona.
- **É delegação.** O selector é comparado no momento do disparo, então elementos
  adicionados por um repaint posterior já estão cobertos sem rebind.
- **A desmontagem é automática.** O listener é escopado a um `AbortController`
  que aborta no `disconnectedCallback`.

## Filtros

Cada um transforma o evento antes que o método o receba. Eles compõem da
esquerda para a direita.

| Filtro | Produz |
|---|---|
| `value` | `event.target.value` |
| `files` | `event.target.files` |
| `formData` | os dados do formulário, convertidos em objeto simples |
| `dataset` | `event.target.dataset` |
| `detail` | `event.detail` |
| `prevent` | o evento, depois do `preventDefault()` |
| `stop` | o evento, depois do `stopPropagation()` |

Uma única declaração consegue expressar interceptar-e-converter:

```js
@on.submit('form', prevent, stop, formData)
[submitted](data) {
  this.dispatchEvent(customEvent('submitted', data))
  return this
}
```

## `customEvent(type, detail?)`

Constrói um `CustomEvent` que **borbulha** e é **cancelável**, para que se
comporte como um evento nativo quando disparado de dentro de uma shadow tree.

```js
this.dispatchEvent(customEvent('changed', this.value))
```

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `type` | `string` | Nome do evento. Use o passado — veja a [convenção de nomes de evento](/pt-br/foundations/events-and-echo). |
| `detail` | `unknown` | Payload entregue como `event.detail`. |

Prefira isto a `new CustomEvent`, para que todo evento da biblioteca carregue as
mesmas opções de propagação.
