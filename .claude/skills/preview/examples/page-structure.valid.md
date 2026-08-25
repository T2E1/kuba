# ✅ Página com a estrutura completa

Incorreto em: `page-structure.invalid.md`

Este par é sobre **estrutura e o que demonstrar**. Para a linguagem da prosa — o que
denuncia texto gerado —, veja a skill [prose](../../prose/SKILL.md).

Adaptado de `website/docs/components/button.mdx`.

---

````markdown
# Button

A button triggers a synchronous action owned by the page it's on — form
submission, form reset, or a `clicked` event other elements subscribe to. It
never changes the URL. If the outcome is a new location, wire `<kb-redirect>` to
the button's `clicked` event instead of putting that logic in the button.

```html preview
<kb-button>Save</kb-button>
<kb-button variant="naked">Cancel</kb-button>
<kb-button color="danger">Delete</kb-button>
```

## Usage

```html
<kb-button type="submit" color="primary">Save</kb-button>
```

```js
document.querySelector('kb-button').addEventListener('clicked', (event) => {
  console.log(event.detail) // the button's `value`
})
```

## When to use

- Submitting or resetting a `<form>` (`type="submit"` / `type="reset"`).
- Triggering an action local to the page — opening a dialog, adding a row —
  where the response is a `clicked` event, not a URL change.

## When not to use

- **Navigating to another route or URL.** Use a plain `<a>` for external or
  full-page navigation, or `<kb-redirect>` wired to a button's `clicked` event
  for in-app navigation. `kb-button` has no concept of a destination.

## Variants

`variant` expresses emphasis, not decoration — pick by how important the action
is relative to its siblings, not by taste.

| Variant | Emphasis | Use for |
|---|---|---|
| `solid` (default) | Highest | The one primary action in an area. More than one and neither reads as primary. |
| `naked` | Medium | A secondary action next to a `solid` one — "Cancel" beside "Save". |

## States and accessibility

- **`variant="icon"` requires `alt`.** Without it the button is announced by the
  Material Symbols ligature name — `cloud_upload` is read aloud as
  "cloud_upload".
- `type="submit"` is a no-op outside a `<form>`. It does not throw; nothing
  happens, which is harder to notice.

## Do's and don'ts

| Do | Don't |
|---|---|
| Give `variant="icon"` an `alt` | Ship an icon button with no accessible name |
| Use one `solid` button per area | Make every action primary |
| Wire navigation through `clicked` | Put a URL in the button |
````

---

## O que a estrutura faz

**O propósito diz o limite na primeira frase.** "It never changes the URL" — e já entrega
a alternativa. O leitor decide se veio ao lugar certo antes da primeira seção.

**O bloco de preview vem antes de qualquer `##`**, com três variantes que se contrastam.
Não são as sete que o componente aceita: são as que mostram o eixo.

**`When not to use` nomeia a alternativa com link.** É a seção que evita o erro, e a
única que documentação gerada nunca tem.

**A tabela de variantes tem a coluna "Use for", não "Appearance".** A aparência o preview
já mostrou; o que falta é o critério — inclusive o limite, "more than one and neither
reads as primary".

**A seção de estados traz a pré-condição não óbvia.** `type="submit"` fora de um form não
lança erro; simplesmente não faz nada. Isso é impossível de descobrir lendo o `types.d.ts`.

**Os do's e don'ts são pareados linha a linha** — a linha 1 de cada coluna trata do mesmo
aspecto. Três pares bastam.

## O que não está aqui

Nenhuma varredura de `variant` × `color` × `width`. Nenhuma demonstração de `:hover`, que
o navegador dá de graça. Nenhuma seção para atributo que é só forma — esses ficam na
tabela de atributos.
