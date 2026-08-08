# dom

```js
import { css, html, paint, repaint, retouch } from '@t2e1/kuba/dom'
```

Renderização. O `paint` escreve o shadow DOM de um elemento uma vez, na conexão;
`repaint` e `retouch` agendam atualizações depois disso. Veja
[Ciclo de vida](/pt-br/build-elements/lifecycle) para a sequência.

## `paint(component, ...styles)`

Decorator de classe. Envolve o `connectedCallback` para que, depois de rodar a
lógica de conexão do próprio elemento, seu shadow DOM seja escrito.

```js
@define('my-counter')
@paint(component, style)
class Counter extends HTMLElement {}
```

| Parâmetro | Tipo | Devolve |
|---|---|---|
| `component` | `(element) => string` | O markup a escrever dentro do shadow root. |
| `...styles` | `(element) => CSSStyleSheet` | Folhas de estilo adotadas pelo shadow root. |

Ambos recebem o elemento, e é assim que markup e estilos leem os atributos
atuais dele. A sequência por paint:

1. `willPaintCallback`, se definido na classe.
2. Markup e estilos escritos — ambos adiados para o mesmo
   `requestAnimationFrame`, então caem no mesmo frame.
3. A flag de pintado é marcada.
4. `didPaintCallback`, se definido.

!> **O shadow root fica vazio até esse frame.** Consultá-lo de forma síncrona no
`connectedCallback` devolve `null`. Use o `didPaintCallback`, ou espere um
frame.

## `repaint`

Decorator de método ou accessor. Reexecuta o paint completo — markup e estilos —
depois que a função decorada retorna.

```js
@attributeChanged('use')
@repaint
set use(value) { this.#use = value }
```

## `retouch`

A metade mais barata: reexecuta **apenas** a folha de estilo, deixando o markup
intacto. Para propriedades que afetam a aparência, mas não a estrutura.

```js
@attributeChanged('size')
@retouch
set size(value) { this.#size = value }
```

O `<kb-icon>` usa os dois, e a divisão mostra por quê: `use` muda o glifo
renderizado, então repinta; `size` e `color` só alimentam o CSS, então
retocam.

Ambos compartilham três propriedades:

- **Agrupados.** O trabalho é agendado com `setImmediate`, então a função
  decorada retorna de forma síncrona e várias escritas numa mesma tarefa
  colapsam num único paint.
- **Protegidos.** Escrever numa propriedade antes do primeiro paint não dispara
  uma renderização redundante.
- **Não reativos.** Nada rastreia o que o markup leu; a função de componente
  inteira roda de novo. Não há diffing.

## `html` e `css`

Template literals com tag. O `html` devolve uma string de markup; o `css`
devolve um `CSSStyleSheet` pronto para adotar.

```js
const component = (button) => html`<button>${button.label}</button>`
const style = (button) => css`
  :host { width: ${button.width}; }
`
```

A interpolação é substituição pura de string — **os valores não são escapados**.
Nunca interpole entrada não confiável dentro do `html`.

## Callbacks de ciclo de vida

Métodos opcionais que uma classe pintada pode definir. São procurados por
símbolo, então importe as chaves quando for implementá-los:

| Símbolo | Roda |
|---|---|
| `willPaintCallback` | antes de cada paint |
| `didPaintCallback` | depois que cada paint assenta |
| `isPainted` | flag, legível para saber se o primeiro paint terminou |

`htmlCallback` e `cssCallback` são internos — guardados na instância pelo
`paint` para que `repaint` e `retouch` consigam reexecutar exatamente o mesmo
trabalho.
