# CRUD de usuarios

Una pequeña pantalla de gestión — añadir registros, listarlos, eliminar uno —
construida con cuatro elementos que nunca se referencian. Cada conexión es un
arco. **Ningún listener lo escribe quien monta la página.**

```html preview
<kb-card direction="column">
  <kb-form name="crud-form" autorender>
    <template>
      <kb-stack direction="column" align="stretch">
        <kb-input name="name" required>
          <kb-label>Nombre</kb-label>
        </kb-input>
        <kb-input name="age" type="number" required>
          <kb-label>Edad</kb-label>
        </kb-input>
        <kb-button type="submit">Añadir</kb-button>
      </kb-stack>
    </template>
    <kb-on value="crud-form/submitted:method/reset"></kb-on>
  </kb-form>
</kb-card>

<kb-render layout="list">
  <kb-on value="crud-users/changed:method/render"></kb-on>
  <template>
    <kb-stack direction="row" justify="space-between" align="center">
      <kb-text size="xxs">{name} — {age}</kb-text>
      <kb-button name="crud-delete" value="{id}" color="danger" variant="naked">
        Eliminar
      </kb-button>
    </kb-stack>
  </template>
</kb-render>

<kb-dataset name="crud-users" upsert="id">
  <kb-on value="crud-form/submitted:method/push"></kb-on>
  <kb-on value="crud-delete/clicked:method/delete"></kb-on>
</kb-dataset>

<script type="module">
  requestAnimationFrame(() =>
    document.querySelector('kb-dataset[name="crud-users"]').push([
      { id: 1, name: 'Ada Lovelace', age: 36 },
      { id: 2, name: 'Alan Turing', age: 41 },
    ]),
  )
</script>
```

## El flujo de datos

Cuatro arcos, y cada uno es una frase:

| Arco | Se lee como |
|---|---|
| `crud-form/submitted:method/push` | cuando se envíe el formulario, empuja sus datos al dataset |
| `crud-form/submitted:method/reset` | …y limpia el formulario |
| `crud-users/changed:method/render` | cuando cambie la colección, vuelve a renderizar la lista |
| `crud-delete/clicked:method/delete` | cuando se haga clic en un botón de eliminar, elimina ese registro |

El ciclo se cierra sobre sí mismo: el formulario alimenta el dataset, el dataset
alimenta la lista, y los botones de la lista vuelven a alimentar el dataset. Nada
importa nada.

## Cómo funciona cada pieza

### El formulario publica datos parseados

`<kb-form>` renderiza sus campos desde el `<template>` y publica `submitted` con
los datos del formulario ya parseados en un objeto, indexado por el `name` de
cada campo. La validación nativa corre primero, así que un campo obligatorio
vacío bloquea el evento por completo — no hay comprobación de "¿es válido?" en
ninguna parte de la página.

El segundo arco apunta el formulario hacia **sí mismo**: `submitted` dispara su
propio `reset()`, limpiando los campos tras un alta exitosa.

### El dataset fusiona por clave

`upsert="id"` convierte `push()` en una fusión, no en un append. El registro
enviado no tiene `id`, así que el dataset genera un uuid y lo escribe de vuelta
en el registro almacenado — que es lo que hace que `{id}` esté disponible para el
template después.

### La lista interpola por registro

`<kb-render>` renderiza su template una vez por registro del array, así que
`{name}`, `{age}` y `{id}` resuelven por fila. El `value="{id}"` del botón de
eliminar es el detalle clave: **el botón de cada fila lleva el id de su propio
registro como payload.**

### Un arco sirve al botón de cada fila

Todos los botones de eliminar comparten `name="crud-delete"`, y el segmento
`source` del arco coincide por nombre — así que un solo arco cubre todas las
filas, presentes y futuras. El botón publica `clicked` con su `value`, que es
exactamente el argumento que espera `delete(clave)`.

Por eso los botones renderizados *después* de conectarse el arco siguen
funcionando: los arcos se suscriben al bus compartido por nombre, no a
referencias de elemento.

## Cosas que conviene saber

### El bus es global, y coincide por nombre

El bus de Echo se comparte en toda la página. Un arco cuyo origen es `users`
dispara para **cualquier** elemento de la página llamado `users` — incluido uno
en otro componente, otro ejemplo u otra funcionalidad.

Por eso cada nombre de esta receta lleva prefijo (`crud-form`, `crud-users`,
`crud-delete`) en lugar de los más naturales `form`, `users`, `delete`: esta
página tiene varios ejemplos en vivo, y los nombres sin prefijo los cruzarían. En
una aplicación real, dale a los nombres el alcance de la funcionalidad por la
misma razón.

### Es solo memoria

`<kb-dataset>` guarda los registros en memoria. Una recarga la vacía. Para
persistir, añade un `<kb-fetch>` y un arco más:

```html
<kb-fetch name="api" url="/api/users">
  <kb-on value="crud-form/submitted:method/post"></kb-on>
</kb-fetch>

<kb-dataset name="crud-users" upsert="id">
  <kb-on value="api/succeeded:method/push"></kb-on>
</kb-dataset>
```

Ahora el formulario alimenta la petición, y la *respuesta* alimenta el dataset —
así la lista muestra lo que el servidor realmente guardó, incluido cualquier id o
campo que haya generado.

### Editar necesita un elemento más

Esta receta cubre crear, leer y eliminar. Actualizar es el mismo `push()` — como
fusiona por clave, enviar `{ id: 1, age: 37 }` corrige ese registro sin tocar
`name`. Lo que falta es una forma de cargar un registro de vuelta en el
formulario, que es para lo que existe [`<kb-find>`](/es/components/find).

### Eliminar es inmediato

No hay paso de confirmación. `color="danger"` marca la acción como destructiva
visualmente, pero nada la protege. Para algo más difícil de deshacer que esto,
pon una confirmación entre el clic y la eliminación — lo que implica un listener,
o un elemento de diálogo que publique su propio evento de confirmación.

## Relacionados

- [Eventos y Echo](/es/learn/events-and-echo) — la gramática del arco.
- [Dataset](/es/components/dataset) — la clave de upsert y sus métodos.
- [Form](/es/components/form) — el renderizado del template y el payload enviado.
