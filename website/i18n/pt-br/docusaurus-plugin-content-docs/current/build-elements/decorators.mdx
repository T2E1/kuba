# Decorators

Decorators são como um elemento kuba declara seu comportamento. Eles se dividem
em quatro grupos: **ciclo de vida** (coberto em
[Ciclo de vida](/build-elements/lifecycle)), **escuta**, **middleware** e
**disparo**. Esta página cobre os três últimos, e como escrever os seus.

Todos são decorators de método/acessor aplicados a um membro de classe — sem
registro em runtime, sem contêiner de injeção de dependência. Cada um envolve uma
função.

## Escutando: `@on`

`@on` registra um listener delegado no **shadow root** do elemento, com escopo
de um `AbortController` que aborta na desconexão. Qualquer tipo de evento
funciona — o objeto é um proxy, então `on.click`, `on.input`, `on.submit`,
`on.clicked` são todos válidos.

```js
import on from '@t2e1/kuba/event'

@on.input('input', value)
[change](newValue) {
  this.value = newValue
  return this
}
```

Leia assim: *quando um evento `input` disparar dentro do meu shadow root em algo
que casa com o seletor `input`, passe o evento pelo filtro `value` e chame este
método com o resultado.*

Três detalhes que importam:

- **O listener vive no `shadowRoot`, não no host.** Ele só enxerga eventos
  originados dentro do componente. Um evento disparado no próprio host não o
  aciona.
- **O seletor é comparado com `event.target`.** É delegação, então elementos
  adicionados por um repaint posterior já estão cobertos sem religar nada.
- **A desmontagem é automática.** O controller aborta no `disconnectedCallback`.

### Filtros de evento

Os argumentos depois do seletor são filtros, aplicados da esquerda para a
direita, cada um transformando o evento antes de o método recebê-lo:

| Filtro | Transforma o evento em |
|---|---|
| `value` | `event.target.value` |
| `files` | `event.target.files` |
| `formData` | os dados do formulário, parseados num objeto simples |
| `dataset` | `event.target.dataset` |
| `detail` | `event.detail` |
| `prevent` | o evento, depois de `preventDefault()` |
| `stop` | o evento, depois de `stopPropagation()` |

Eles compõem, e é assim que uma única declaração expressa "intercepte o submit
nativo, não deixe navegar, e me entregue os dados parseados":

```js
@on.submit('form', prevent, stop, formData)
[submitted](data) {
  this.dispatchEvent(customEvent('submitted', data))
  return this
}
```

## Middleware: `@before`, `@after`, `@around`

Eles envolvem um método ou setter com outro método da mesma classe. Existem para
que um componente separe *o que* um setter guarda de *o que mais* precisa
acontecer quando aquilo muda.

```js
@attributeChanged('hidden', booleanAttribute)
@around(hideable)
@before(cleanup)
set hidden(value) {
  this.#hidden = value
}
```

- **`@before(método)`** roda `método` primeiro, de forma síncrona, e o retorno
  dele é passado ao original — use para normalizar a entrada.
- **`@after(método)`** roda `método` com o resultado do original.
- **`@around(método)`** agenda `método` num tick posterior via `setImmediate`,
  **descarta o retorno dele** e devolve o valor do original inalterado.

!> `@around` não envolve a chamada do jeito que o nome sugere. Ele não roda antes
*e* depois, e não consegue modificar o retorno — é "e também faça isto, logo".
Use quando uma mudança de estado tem um efeito colateral que não deve bloquear o
setter, como refletir um estado customizado.

## Disparando: `@dispatchEvent`

Redispara o retorno de um método (ou o novo valor de um setter) como um
`CustomEvent` que borbulha, assim que o host estiver conectado — então uma
propriedade vira observável pelo Echo sem escrever `dispatchEvent` à mão:

```js
import { dispatchEvent } from '@t2e1/kuba/echo'

@dispatchEvent('clicked')
click() {
  return this.value
}
```

## Escrevendo os seus

Um decorator aqui é só uma função que recebe o descriptor e substitui a função
envolvida. Este registra toda chamada ao método que decora:

```js
const logged = (label) => (_target, _key, descriptor) => {
  const original = descriptor.value

  descriptor.value = function (...args) {
    console.log(label, args)
    return original.apply(this, args)
  }
}
```

Se você está se enganchando num callback nativo em vez de um método, use o helper
`execute` em vez de sobrescrever o callback — ele encadeia, então vários
decorators podem usar o mesmo:

```js
import execute from '@t2e1/kuba/directive'

const ready = (target, method) =>
  execute(method).on(target).after('connectedCallback')
```

É exatamente assim que `@connected`, `@disconnected`, `@adopted` e os callbacks
de formulário são implementados — cada um são duas linhas sobre o `execute`.

## Um elemento completo

Juntando os grupos: um elemento que renderiza um contador, reage a um clique
dentro do seu shadow root e publica o novo valor como evento.

```js
import { connected, define } from '@t2e1/kuba/directive'
import attributeChanged from '@t2e1/kuba/directive/attributeChanged'
import { paint, repaint } from '@t2e1/kuba/dom'
import Echo, { dispatchEvent } from '@t2e1/kuba/echo'
import on from '@t2e1/kuba/event'
import { html, css } from '@t2e1/kuba/dom'

const component = (counter) => html`<button>${counter.count}</button>`
const style = () => css`:host { display: inline-block; }`

@define('my-counter')
@paint(component, style)
class Counter extends Echo(HTMLElement) {
  #count

  get count() {
    return (this.#count ??= 0)
  }

  @attributeChanged('count')
  @repaint
  set count(value) {
    this.#count = Number(value)
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  @on.click('button')
  @dispatchEvent('counted')
  increment() {
    this.count = this.count + 1
    return this.count
  }
}
```

Como ele estende `Echo(HTMLElement)`, outro elemento já pode reagir a ele só pelo
markup: `on="my-counter/counted:setter/textContent"`.

## Depois

- **[Componentes](/components/)** — os elementos construídos com estes
  decorators.
- **[Reference › Packages](/build-elements/)** — cada export, por pacote.
