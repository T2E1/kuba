# Redirect

Navega mediante `history.pushState` cuando se ejecuta su método `go()`, sin
recargar la página. No renderiza nada y no tiene interacción propia — es un
suscriptor headless de Echo, pensado para conectarse al evento de otro elemento,
lo más habitual el `clicked` de un botón.

```html
<kb-button id="open-profile" value="42">Ver perfil</kb-button>
<kb-redirect href="/user/{}" on="#open-profile/clicked:method/go"></kb-redirect>
```

?> No hay vista previa en vivo en esta página a propósito — cada ejemplo
cambiaría la URL del propio sitio de documentación.

## Uso

```html
<kb-button id="save" value="42">Guardar</kb-button>
<kb-redirect href="/user/{id}" on="#save/clicked:method/go"></kb-redirect>
```

```js
document.querySelector('kb-redirect').go({ id: 42 }) // → /user/42
```

## Cuándo usarlo

- **El desenlace de una interacción es una nueva ubicación** — conecta el evento
  del elemento que dispara a `go()` en lugar de escribir `history.pushState` en
  el código de la página.
- **Navegando a una ruta con nombre registrada en el router** mediante `route`, o
  a una ruta con segmentos dinámicos mediante placeholders de `href`
  interpolados a partir del payload del evento.

## Cuándo no usarlo

- **El desenlace de la interacción no es una navegación.** Un botón que envía un
  formulario no debería conectarse a un redirect — poner navegación en el botón
  lo acoplaría a un destino que no debería conocer.
- **Una navegación de página completa o una URL externa.** Esto solo llama a
  `history.pushState`, que nunca sale del documento actual. Usa un `<a>` normal.

## Composición

- **Puede contener**: nada. Sin slot, sin shadow DOM.
- **Puede ser hijo de**: cualquier cosa. Suele ser hermano del elemento cuyo
  evento suscribe — justo después del `<kb-button>` — y no anidado dentro de él.

## `href` vs `route`

| Atributo | Resuelve a | Notas |
|---|---|---|
| `href` | una URL directa — URL absoluta, ruta absoluta, o un fragmento `#`/`?` | Puede contener placeholders `{path.to.value}` interpolados a partir de los `params` pasados a `go()`. |
| `route` | un nombre de ruta registrado en el router, resuelto vía `urlFor` | **Tiene precedencia sobre `href`** cuando ambos están definidos. |

!> Definir ambos esperando que `href` actúe como reserva no funciona — cuando
`route` está definido, solo se usa `route`.

Los placeholders son lo que permite que un único redirect sirva a una lista
entera. El payload del evento que dispara los rellena:

```html
<kb-render>
  <kb-on value="users/changed:method/render"></kb-on>
  <template>
    <kb-card value="{id}">
      <kb-text size="xxs">{name}</kb-text>
    </kb-card>
  </template>
</kb-render>
<kb-redirect href="/user/{}" on="kb-card/clicked:method/go"></kb-redirect>
```

Cada tarjeta publica `clicked` con su propio `value`, y el mismo redirect
resuelve una URL distinta para cada una.

## Atributos

| Atributo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `href` | `string` | `'#'` | URL de destino, opcionalmente con placeholders `{path}`. |
| `route` | `string` | `''` | Nombre de ruta registrado en el router. Gana sobre `href` cuando está definido. |
| `on` | cadena de arco | — | Conexión de Echo, `origen/evento:tipo/destino`. |

## Métodos

| Método | Devuelve | Descripción |
|---|---|---|
| `go(params?)` | `this` | Navega mediante `history.pushState`, interpolando `params` en `href`. |

Este elemento no despacha eventos. La navegación en sí emite un evento
`pushstate` en `window`, que el paquete del router escucha.

## Estados y accesibilidad

- El elemento es headless e invisible — sin estado renderizado, sin superficie
  de accesibilidad propia.
- **El nombre accesible y el rol pertenecen a quien lo dispara.** Un redirect
  conectado a un `<kb-button>` no hereda nada de él; asegúrate de que el botón se
  lea como la acción que ejecuta.
- Como esto es `pushState` y no un enlace real, el destino no aparece al pasar
  el cursor, no se abre en una pestaña nueva, y no se anuncia como enlace.
  Cuando la interacción es genuinamente "ir a esta página", un `<a>` normal
  sirve mejor a las personas; recurre a `kb-redirect` cuando la navegación es la
  *consecuencia* de una acción, y no la acción en sí.

## Recomendado y no recomendado

| Haz | No hagas |
|---|---|
| Conectar el evento del elemento que dispara a `go()` | Llamar a `history.pushState` a mano cuando esto ya lo cubre |
| Usar `route` para destinos registrados en el router | Definir `href` y `route` esperando una reserva |
| Interpolar segmentos dinámicos a partir del payload del evento | Fijar un id dentro de `href` |
| Usar un `<a>` normal cuando la cosa *es* un enlace | Sustituir cada enlace por un botón más un redirect |
