# echo

```js
import Echo, { dispatchEvent } from '@t2e1/kuba/echo'
```

A camada de ligação declarativa. O `Echo` transforma uma classe num host que
ecoa os próprios eventos num barramento compartilhado e assina esse barramento
através de **arcos**. Veja
[Eventos e Echo](/foundations/events-and-echo) para os conceitos; esta
página é o contrato.

## `Echo(Base)`

Mixin. Devolve uma subclasse de `Base` que:

- adiciona `on` a `observedAttributes`,
- conecta um arco quando `on` muda, desconectando o anterior,
- ecoa toda chamada de `dispatchEvent` no barramento compartilhado, marcada com
  o `id`, o `name` e o nome da tag do elemento,
- desmonta todos os arcos no `disconnectedCallback`.

```js
class Counter extends Echo(HTMLElement) {}
```

Todo custom element do kuba é construído sobre ele, e é por isso que qualquer um
deles pode ser origem ou destino de um arco sem configuração extra.

## A gramática do arco

```
origem/evento:tipo/destino|filtro=valor|filtro=valor
```

| Segmento | Aceita | Significado |
|---|---|---|
| `origem` | `*`, `#id`, um `name`, um nome de tag | De qual elemento escutar os eventos. Não diferencia maiúsculas. |
| `evento` | qualquer tipo de evento | O nome do evento no barramento compartilhado. |
| `tipo` | `method`, `setter`, `attribute` | Como o payload é aplicado. |
| `destino` | nome de método, propriedade ou atributo | A que aplicá-lo, no host. |
| `filtro` | pares `nome=valor`, separados por `\|` | Transformações aplicadas ao payload, em ordem. |

Os três valores de `tipo`:

| `tipo` | Efeito no host |
|---|---|
| `method` | `this[destino](payload)` |
| `setter` | `this[destino] = payload` |
| `attribute` | `this.setAttribute(destino, payload)` |

Um arco que não casa com a gramática é ignorado em silêncio — não existe erro de
parse.

## Filtros

Resolvidos pelo nome através do registro
[`spark`](/build-elements/spark) e aplicados da esquerda para a direita,
cada um recebendo `(payload, value)`.

```html
<kb-text on="user/changed:setter/textContent|prop=email"></kb-text>
```

!> Um nome de filtro desconhecido resolve para a função identidade em vez de
lançar, então um erro de digitação deixa o payload intacto e sem erro nenhum.

Filtros são transformações síncronas de payload. Eles não conseguem atrasar,
descartar nem agrupar uma chamada, então **fazer debounce de um arco não é
possível** — faça o throttle dentro do método de destino.

## `dispatchEvent(eventName)`

Decorator de método ou accessor. Redispara o valor de retorno do método decorado
— ou o novo valor do setter — como um `CustomEvent` que borbulha e é composto,
assim que o host estiver conectado.

```js
@dispatchEvent('clicked')
click() {
  return this.value
}
```

Ele torna uma propriedade ou método observável por arcos sem escrever
`dispatchEvent` à mão.

## O barramento

Arcos não assinam elementos; eles assinam um alvo compartilhado em memória. Todo
host Echo redispara seus eventos ali, embrulhados com informação de identidade,
e cada arco filtra pelo seu segmento de `origem`.

Duas consequências que vale conhecer:

- **Nenhuma referência a elemento é necessária.** Um assinante pode ser
  declarado antes de sua origem existir, ou numa parte totalmente diferente da
  árvore.
- **Os eventos chegam ao barramento mesmo através de fronteiras de shadow**, já
  que não se trata de propagação do DOM.

!> **O barramento é global, e `origem` casa por identidade, não por
proximidade.** Um arco cuja origem é `users` dispara para *todo* elemento da
página chamado `users` — em outro componente, em outra funcionalidade, em outra
instância do mesmo widget. Não existe mecanismo de escopo, então os nomes
precisam carregar o escopo por conta própria: prefixe-os por funcionalidade
(`checkout-items`, não `items`) sempre que uma página possa conter mais de uma
coisa do mesmo tipo.

## Tempo de vida

Cada arco recebe seu próprio `AbortController`, guardado por string de arco.
Mudar o atributo `on` aborta a assinatura antiga e cria a nova; desconectar o
elemento aborta todas. Não há nada para cancelar manualmente, e um elemento
removido não deixa listener para trás.
