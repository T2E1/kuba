# directive

```js
import {
  adopted,
  attributeChanged,
  connected,
  define,
  disconnected,
  execute,
  formAssociated,
  formDisabled,
  formReset,
  formStateRestore,
} from '@t2e1/kuba/directive'
```

Decorators sobre o ciclo de vida nativo dos custom elements. Cada um envolve um
callback em vez de substituí-lo, então vários podem se enganchar no mesmo
callback e eles encadeiam. Veja
[Ciclo de vida](/pt-br/build-elements/lifecycle) para como se encaixam.

## `define(name, options?)`

Decorator de classe. Registra a classe no registro de custom elements, pulando o
registro quando `name` já existe — assim um módulo avaliado duas vezes não
lança.

```js
@define('my-counter')
class Counter extends HTMLElement {}
```

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `name` | `string` | Nome da tag. Precisa conter um hífen, por exigência da plataforma. |
| `options` | `ElementDefinitionOptions` | Repassado ao `customElements.define`, ex. `{ extends: 'button' }`. |

## `attributeChanged(attribute, ...filters)`

Decorator de accessor. Adiciona `attribute` a `observedAttributes` e sincroniza
a propriedade decorada a partir dele a cada `attributeChangedCallback`, passando
antes a string crua pelos `filters`, em ordem.

```js
@attributeChanged('count')
set count(value) { this.#count = Number(value) }

@attributeChanged('hidden', booleanAttribute)
set hidden(value) { this.#hidden = value }
```

A direção é apenas atributo → propriedade. Definir a propriedade **não** escreve
o atributo de volta.

### Filtros

Importáveis de `@t2e1/kuba/directive/attributeChanged`:

| Filtro | Transforma o valor cru em |
|---|---|
| `booleanAttribute` | `true` quando o atributo está presente, `false` quando removido |
| `resizing` | um comprimento CSS — valores numéricos px/% passam direto, palavras-chave são normalizadas |

## Ganchos de ciclo de vida

Decorators de método. Cada um roda o método decorado **depois** do callback
nativo correspondente, recebendo os mesmos argumentos.

| Decorator | Roda depois de |
|---|---|
| `connected` | `connectedCallback` |
| `disconnected` | `disconnectedCallback` |
| `adopted` | `adoptedCallback` |
| `formAssociated` | `formAssociatedCallback` |
| `formDisabled` | `formDisabledCallback` |
| `formReset` | `formResetCallback` |
| `formStateRestore` | `formStateRestoreCallback` |

```js
@connected
[slottable]() {
  this.setAttribute('slot', 'helper')
  return this
}
```

Métodos com chave de símbolo são a convenção aqui — eles mantêm o gancho fora da
superfície pública do elemento. Cada pacote define os seus num `interface.js`.

## `execute(method)`

O construtor por trás de todos os ganchos acima. Use para escrever o seu:

```js
const ready = (target, method) =>
  execute(method).on(target).after('connectedCallback')
```

| Passo | Argumento | Descrição |
|---|---|---|
| `execute(method)` | `string \| symbol` | O método a invocar na instância. |
| `.on(target)` | prototype | Onde instalar o wrapper. |
| `.after(event)` | `string` | Nome do callback a envolver. |

Ele faz proxy do callback existente em vez de sobrescrevê-lo, e é isso que torna
os ganchos componíveis.
