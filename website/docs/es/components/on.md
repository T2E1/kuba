# On

Adjunta un arco adicional — `origen/evento:tipo/destino` — al host Echo que es
su padre. No renderiza nada y nunca conecta nada en nombre propio. Si un host
necesita una sola suscripción, usa su propio atributo `on`; `<kb-on>` existe
porque un elemento solo puede llevar uno de esos.

```html preview
<kb-input name="live" placeholder="Escribe para ver dispararse dos arcos">
  <kb-label>Origen</kb-label>
</kb-input>

<kb-render>
  <kb-on value="live/changed:method/render"></kb-on>
  <template>
    <kb-text size="xxs">Escribiste: {}</kb-text>
  </template>
</kb-render>
```

## Uso

```html
<kb-render>
  <kb-on value="api/succeeded:method/render"></kb-on>
  <kb-on value="api/failed:method/clear"></kb-on>
  <template>{name}</template>
</kb-render>
```

## Cuándo usarlo

- **Un host necesita una segunda (o tercera) suscripción** más allá de lo que su
  propio atributo `on` puede expresar — la gramática soporta exactamente un arco
  por atributo, así que cada arco adicional tiene que ser un hijo `<kb-on>`.
- **Mantener cada suscripción legible de forma independiente** en el markup, una
  por línea, en lugar de un valor de atributo largo.

## Cuándo no usarlo

- **Una única suscripción** — establece el atributo `on` del propio host. Un
  hijo `<kb-on>` añade un elemento y un paso de upgrade sin ningún beneficio.
- **Conexiones que no son dirigidas por eventos.** Esto solo tiende el puente
  entre un `CustomEvent` del bus compartido de Echo y un método, atributo o
  propiedad de su padre.

## Composición

- **Puede contener**: nada. No tiene slot y no renderiza shadow DOM; existe por
  su atributo `value` y por su efecto sobre `parentElement`.
- **Puede ser hijo de**: cualquier elemento construido con el mixin `Echo` — es
  decir, cada custom element de kuba. Bajo un elemento HTML normal o un custom
  element que no sea Echo no tiene efecto, ya que la conexión apunta
  directamente a `parentElement`.

Espera a `customElements.whenDefined(parentElement.localName)` antes de
conectar, así que declararlo antes de que el padre se haya inicializado es
seguro.

## La cadena del arco

`value` recibe la misma gramática que el atributo `on` — mira
[Eventos y Echo](/foundations/events-and-echo) para la referencia completa:

```
origen/evento:tipo/destino|filtro=valor
```

| Segmento | Significado |
|---|---|
| `origen` | `*` (cualquiera), `#id`, un `name`, o un nombre de etiqueta |
| `evento` | el evento a escuchar en el bus compartido |
| `tipo` | `method`, `setter` o `attribute` |
| `destino` | el método, propiedad o atributo a aplicar en el padre |
| `filtro` | transformaciones opcionales separadas por `\|`, aplicadas en orden |

## Atributos

| Atributo | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `value` | cadena de arco | — | El arco a adjuntar al host Echo que es el padre. |

Este elemento no despacha eventos y no renderiza nada.

## Tiempo de vida

Cada arco tiene su propio `AbortController`. Cambiar `value` desmonta la
suscripción antigua y crea la nueva; eliminar el `<kb-on>` — o su padre — la
desmonta. No hay nada que cancelar manualmente.

## Recomendado y no recomendado

| Haz | No hagas |
|---|---|
| Usar el atributo `on` del propio host para una única suscripción | Envolver un solo arco en un hijo `<kb-on>` cuando el atributo bastaría |
| Añadir un `<kb-on>` por cada arco extra en el mismo host | Concatenar varios arcos en un solo `on` — la gramática soporta uno |
| Anidarlo directamente bajo el host Echo que conecta | Colocarlo bajo un elemento que no sea Echo y esperar que funcione |
