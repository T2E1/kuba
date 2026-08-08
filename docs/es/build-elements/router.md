# router

```js
import router, { args, params, urlFor } from '@t2e1/kuba/router'
```

Un router del lado del cliente construido sobre `history.pushState`: registra
rutas contra callbacks, y la que coincide se ejecuta cuando la URL cambia.

```js
import router, { params } from '@t2e1/kuba/router'

router('/users/:id', function showUser() {
  render(params.id)
})('/about', function showAbout() {
  render('about')
})

router.fallback(function showNotFound() {
  render('404')
})
```

## `router(path, page)`

Registra una ruta y se devuelve a sí mismo, así que los registros se encadenan.

| Parámetro | Tipo | Descripción |
|---|---|---|
| `path` | `string` | Un patrón, p. ej. `/users/:id`. Un segmento `:name` coincide con uno o más de `[a-z0-9-_]`, sin distinguir mayúsculas. |
| `page` | `() => void` | Se ejecuta cuando el patrón coincide con la URL actual. |

!> **Nombra tus funciones de página.** `urlFor` encuentra una ruta por el
`.name` de su función de página, así que una arrow anónima (`() => {}`) nunca
puede resolverse de vuelta a una URL.

## `router.fallback(page)`

Registra el callback que se ejecuta cuando ninguna ruta coincide. Sin él, una
URL sin coincidencia no ejecuta absolutamente nada — sin error, sin salida.

## `router.handle()`

Resuelve la ruta que coincide con la URL actual e invoca su página. Pensado para
conectarse a `popstate` y `pushstate`, no para llamarse directamente.

## `params(path?)`

Extrae los valores de `:segment` del patrón que coincidió contra el pathname
actual. `router.handle` lo llama por ti con la ruta que coincidió.

```js
// URL: /users/42, registrada como router('/users/:id', showUser)
params.id // '42'
```

Llamarlo sin argumento limpia los params extraídos previamente.

?> `params` es una función cuyas propias propiedades guardan los valores — lee
`params.id`, no `params().id`. `args` funciona igual. Es una forma poco usual:
el módulo se muta a sí mismo para que los consumidores lean valores frescos sin
volver a importar.

## `args()`

Lee la query string de la URL actual sobre sí mismo, de la misma forma.

```js
// URL: /search?query=cats
args()
args.query // 'cats'
```

Llámalo de nuevo tras navegar para refrescar — a diferencia de `params`, nadie
lo llama por ti.

## `urlFor(name, params?)`

Construye una URL para la ruta cuya función de página tiene `.name` igual a
`name`, sustituyendo los segmentos `:key`.

```js
urlFor('showUser', { id: 42 }) // '/users/42'
```

| Comportamiento | Resultado |
|---|---|
| Una `:key` sin entrada correspondiente en `params` | queda como `:key`, no es un error — se permiten plantillas parciales |
| Ninguna ruta con ese nombre de página | **lanza `TypeError`** |

Es por aquí que resuelve el atributo `route` de `<kb-redirect>`.

## Navegación

Navegar con `history.pushState` emite un evento `pushstate` en `window`, que
este paquete escucha junto a `popstate` — así es como un cambio de ruta dispara
`handle()` sin recargar.

[`<kb-redirect>`](/es/components/redirect) es la fachada declarativa de esto:
conecta el evento de un elemento a su método `go()` en lugar de llamar tú mismo
a `pushState`.
