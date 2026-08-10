# ❌ Página que lista o contrato em vez de ensinar a escolher

Correto em: `page-structure.valid.md`

Este par é sobre **estrutura e o que demonstrar**. O texto abaixo não tem nenhum dos
padrões de linguagem que a skill [prose](../../prose/SKILL.md) caça — é conciso e sóbrio.
O defeito é outro: ele documenta o `types.d.ts` de novo, em prosa.

---

````markdown
# Button

The `<kb-button>` element renders a button.

## Attributes

| Attribute | Type | Default |
|---|---|---|
| `variant` | `solid \| naked \| ghost \| link \| icon` | `solid` |
| `color` | `primary \| danger \| warning \| success` | `primary` |
| `type` | `submit \| reset \| button` | `submit` |
| `width` | `auto \| full` | `auto` |
| `alt` | `string` | `''` |

## Examples

```html preview
<kb-button variant="solid" color="primary">Solid primary</kb-button>
<kb-button variant="solid" color="danger">Solid danger</kb-button>
<kb-button variant="solid" color="warning">Solid warning</kb-button>
<kb-button variant="naked" color="primary">Naked primary</kb-button>
<kb-button variant="naked" color="danger">Naked danger</kb-button>
<kb-button variant="ghost" color="primary">Ghost primary</kb-button>
<kb-button variant="ghost" color="danger">Ghost danger</kb-button>
<kb-button variant="link" color="primary">Link primary</kb-button>
<kb-button width="full">Full width</kb-button>
```

## Events

| Event | Detail |
|---|---|
| `clicked` | The button's `value` |

## Accessibility

The component supports ARIA attributes.
````

---

## Os defeitos, em ordem de gravidade

| Problema | Consequência |
|---|---|
| **Não diz o que o botão não faz** | O leitor usa `<kb-button>` para navegar, que é o erro mais comum, e a página não o impede |
| **Sem `When not to use`** | Nenhum caminho para o componente certo quando este parece servir |
| **Varredura combinatória — 9 blocos** | Nove exemplos que mostram nove aparências e **zero critérios**. Qual escolher continua sem resposta |
| **Tabela de atributos sem "use for"** | Duplica o `types.d.ts`, que o editor já mostra no autocomplete |
| **`variant="icon"` listado, nunca explicado** | É o único que **exige** `alt`; sem isso o botão é anunciado como "cloud_upload" |
| **"The component supports ARIA attributes"** | Verdadeiro e inútil: não diz o que ele publica sozinho nem o que exige do consumidor |
| **`type="submit"` como default, sem a pegadinha** | Fora de um `<form>` não faz nada e não lança erro — o caso mais difícil de depurar |

## O teste que a página não passa

> Depois de ler esta página, alguém consegue escolher entre `solid` e `naked`?

Não. A página mostra os dois e não diz quando usar cada um. É a diferença entre **listar
o contrato** e **ensinar a escolher** — e é toda a razão de a página existir, já que o
contrato o `types.d.ts` já dá, de forma mais confiável e sem risco de divergir.
