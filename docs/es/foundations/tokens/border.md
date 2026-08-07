# Borde

Definidos en `packages/pixel/tokens/borderRadius.css` y `borderWidth.css`.

## Radio de borde

Las esquinas de formas y elementos.

| Token | Valor | Muestra |
|---|---|---|
| `--border-radius-none` | 0 | <span class="box" style="border-radius: var(--border-radius-none)"></span> |
| `--border-radius-sm` | 8px | <span class="box" style="border-radius: var(--border-radius-sm)"></span> |
| `--border-radius-md` | 16px | <span class="box" style="border-radius: var(--border-radius-md)"></span> |
| `--border-radius-lg` | 24px | <span class="box" style="border-radius: var(--border-radius-lg)"></span> |
| `--border-radius-pill` | 500px | <span class="box" style="border-radius: var(--border-radius-pill)"></span> |
| `--border-radius-circular` | 50% | <span class="box" style="border-radius: var(--border-radius-circular); width: 2.5rem"></span> |

`pill` es para elementos totalmente redondeados en los extremos — badges, tags,
una llamada a la acción con `width="fill"`. `circular` es para elementos
perfectamente redondos: avatares, y el disco tras el icono de `<kb-fileupload>`.

?> `pill` es una longitud fija grande, no una palabra clave. En una caja de más
de 1000px de alto las esquinas dejan de parecer una píldora — por eso pertenece a
controles, no a superficies.

Dónde se usa cada uno por defecto: `sm` en botones, inputs, covers e insets; `md`
en tarjetas.

```html preview
<kb-stack direction="row" spacing="nano" align="center">
  <kb-button>Por defecto (sm)</kb-button>
  <kb-button style="--button-border-radius: var(--border-radius-pill)">Píldora</kb-button>
  <kb-button style="--button-border-radius: var(--border-radius-none)">Recto</kb-button>
</kb-stack>
```

## Grosor de borde

| Token | Valor | Muestra |
|---|---|---|
| `--border-width-none` | 0 | <span class="box box--bordered" style="border-width: var(--border-width-none)"></span> |
| `--border-width-hairline` | 1px | <span class="box box--bordered" style="border-width: var(--border-width-hairline)"></span> |
| `--border-width-thin` | 2px | <span class="box box--bordered" style="border-width: var(--border-width-thin)"></span> |
| `--border-width-thick` | 4px | <span class="box box--bordered" style="border-width: var(--border-width-thick)"></span> |
| `--border-width-heavy` | 8px | <span class="box box--bordered" style="border-width: var(--border-width-heavy)"></span> |

`hairline` es el valor por defecto para lo que bordea una superficie — inputs,
tarjetas contorneadas, el área del fileupload. `thin` es el borde del botón, para
que un botón contorneado se lea como control y no como contenedor.
