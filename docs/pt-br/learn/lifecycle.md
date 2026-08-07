# Ciclo de vida

Um elemento kuba não tem loop de render nem sistema de reatividade. O que ele tem
é o ciclo de vida nativo de custom element, mais quatro decorators que decidem
*quando* seu shadow DOM é escrito. Entender esses quatro é a maior parte de
entender a biblioteca.

## O ciclo nativo, inalterado

kuba não substitui os callbacks da plataforma — ele os envolve. Um elemento
continua passando por:

| Callback | Dispara quando |
|---|---|
| `constructor` | o elemento é criado ou atualizado |
| `connectedCallback` | ele é inserido no documento |
| `attributeChangedCallback` | um atributo observado muda |
| `disconnectedCallback` | ele é removido do documento |

Todo decorator abaixo se engancha em um desses. Nada agenda trabalho por conta
própria fora deles, e não há scheduler para você pensar a respeito.

## Registrando: `@define`

```js
@define('my-counter')
class Counter extends HTMLElement {}
```

`@define` registra a classe no registro de custom elements — e pula o registro se
a tag já existe, então um módulo avaliado duas vezes (duas cópias empacotadas, um
hot reload) não lança erro.

Nada acontece no momento da definição além do registro. Elementos já presentes na
página são atualizados naquele instante; elementos adicionados depois, na
inserção.

## Pintando: `@paint`

```js
@define('my-counter')
@paint(component, style)
class Counter extends HTMLElement {}
```

`@paint` recebe uma função **component** (retorna a string de markup) e qualquer
número de funções **style** (cada uma retorna um `CSSStyleSheet`), e envolve o
`connectedCallback` para que, depois da sua própria lógica de conexão rodar, o
elemento:

1. Rode `willPaintCallback`, se a classe definir um.
2. Escreva o markup em `shadowRoot.innerHTML` e adote as folhas de estilo — ambos
   adiados para o mesmo `requestAnimationFrame`, para caírem no mesmo quadro em
   vez de forçar layout no meio do callback.
3. Marque-se como pintado.
4. Rode `didPaintCallback`, se a classe definir um.

As duas funções recebem o elemento, que é como markup e estilo leem os atributos
atuais:

```js
const component = (button) => html`<button>${button.label}</button>`
const style = (button) => css`:host { width: ${button.width}; }`
```

?> **O shadow root não existe até aquele quadro.** Essa é a surpresa mais comum:
consultar `shadowRoot.querySelector('button')` de forma síncrona dentro do
`connectedCallback` retorna `null`. Espere a pintura — em teste, com `waitFor`;
em código, com `didPaintCallback`.

## Repintando: `@repaint` e `@retouch`

Um setter decorado com `@repaint` reexecuta a pintura inteira — markup e estilo —
depois que o setter retorna:

```js
@attributeChanged('use')
@repaint
set use(value) {
  this.#use = value
}
```

`@retouch` é a metade barata: reexecuta **apenas** a folha de estilo, deixando o
markup intacto. Use quando uma propriedade afeta aparência mas não estrutura:

```js
@attributeChanged('size')
@retouch
set size(value) {
  this.#size = value
}
```

`<kb-icon>` usa os dois, e a divisão mostra por que são separados: `use` muda o
glifo renderizado, então repinta; `size` e `color` só alimentam custom
properties, então retocam. Repintar numa troca de cor reescreveria o DOM à toa.

Três propriedades desse desenho valem saber:

- **Ambos são agrupados.** O trabalho é agendado com `setImmediate`, então o
  setter decorado retorna de forma síncrona e várias escritas na mesma tarefa
  colapsam numa pintura só.
- **Ambos são protegidos pela flag de pintado.** Escrever uma propriedade antes
  da primeira pintura não dispara render redundante — a pintura inicial vai pegar
  o valor de qualquer forma.
- **Nenhum é reativo.** Nada rastreia o que o markup leu. O decorator reexecuta a
  função de componente inteira; não faz diff.

## Reagindo a atributos: `@attributeChanged`

```js
@attributeChanged('width')
set width(value) {
  this.#width = value
}
```

Isso adiciona o atributo a `observedAttributes` e sincroniza a propriedade a
partir dele em todo `attributeChangedCallback`. Filtros opcionais transformam a
string bruta antes — `booleanAttribute` converte presença em `true`:

```js
@attributeChanged('hidden', booleanAttribute)
set hidden(value) {
  this.#hidden = value
}
```

A direção é atributo → propriedade. Definir a propriedade diretamente **não**
escreve o atributo de volta.

## Enganchando conexão e desconexão: `@connected`, `@disconnected`

```js
@connected
[slottable]() {
  this.setAttribute('slot', 'helper')
  return this
}
```

Eles rodam um método *depois* do callback nativo correspondente, sem sobrescrever
uma implementação que já exista — vários decorators podem se enganchar no mesmo
callback e eles se encadeiam. `<kb-helper>` usa `@connected` para atribuir o
próprio slot, que é por que aninhar um dentro de um campo é toda a fiação
necessária.

`@disconnected` é onde a limpeza pertence. Os controles de formulário abortam um
`AbortController` ali, o que remove de uma vez todos os listeners registrados no
formulário dono.

Há diretivas equivalentes para o resto dos callbacks da plataforma: `@adopted`,
`@formAssociated`, `@formDisabled`, `@formReset` e `@formStateRestore`.

## Juntando tudo

```js
import { attributeChanged, connected, define } from '@t2e1/kuba/directive'
import { paint, repaint } from '@t2e1/kuba/dom'

@define('my-counter')
@paint(component, style)
class Counter extends HTMLElement {
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

  @connected
  [ready]() {
    // Roda depois do connectedCallback, antes da primeira pintura cair.
    return this
  }
}
```

A ordem para um elemento entrando na página: constructor →
`attributeChangedCallback` para cada atributo presente → `connectedCallback` →
seus ganchos `@connected` → `willPaintCallback` → markup e estilo escritos num
quadro → flag de pintado → `didPaintCallback`.

## Depois

- **[Eventos e Echo](/pt-br/learn/events-and-echo)** — como elementos conversam
  depois de estarem na tela.
- **[Decorators](/pt-br/learn/decorators)** — escrever os seus, e os decorators
  de middleware (`@before`, `@after`, `@around`).
