# Inicio rápido

Vas a construir un formulario de registro funcionando — campos etiquetados,
validación nativa, mensajes de error por regla y un handler de submit que recibe
los datos ya parseados — y luego conectar un segundo elemento sin escribir un
listener.

Todo esto funciona en un archivo HTML plano con las dos etiquetas de la
**[Instalación](/es/learn/installation)**. Sin build, sin bundler, sin
framework.

## 1. Un campo

Empieza con un input. `name` es cómo se enviará el valor; `type` y `required` se
reenvían a un `<input>` real dentro del shadow root, así que el navegador valida
por ti.

```html preview
<kb-input name="email" type="email" required>
  <kb-label>Correo</kb-label>
  <kb-helper>Nunca lo compartiremos.</kb-helper>
</kb-input>
```

Dos cosas ocurrieron sin configuración. `<kb-label>` y `<kb-helper>` se
asignaron a los slots `label` y `helper` al conectarse — tú anidas, no conectas.
Y el campo está asociado al formulario, así que se enviará como un control
nativo.

## 2. Mensajes de error por regla

Un único mensaje "inválido" obliga a la persona a adivinar qué regla rompió.
Añade un `<kb-validity>` por modo de fallo; cada uno observa una clave del
`ValidityState` nativo y aparece solo para ese fallo.

```html preview
<kb-input name="password" type="password" required minlength="8">
  <kb-label>Contraseña</kb-label>
  <kb-helper>Al menos 8 caracteres.</kb-helper>
  <kb-validity state="valueMissing">Elige una contraseña.</kb-validity>
  <kb-validity state="tooShort">Al menos 8 caracteres.</kb-validity>
</kb-input>
```

Escribe un carácter y bórralo para ver cómo se alternan los dos mensajes. Fíjate
en que el texto de ayuda desaparece mientras el campo es inválido — el error
ocupa su lugar en vez de apilarse debajo.

## 3. El formulario

`<kb-form>` renderiza sus campos desde un `<template>` hijo y convierte el submit
en un evento con los datos ya parseados. `autorender` le dice que renderice al
conectarse, ya que todavía no hay datos que interpolar.

```html preview
<kb-form autorender id="signup">
  <template>
    <kb-input name="email" type="email" required>
      <kb-label>Correo</kb-label>
      <kb-validity state="valueMissing">El correo es obligatorio.</kb-validity>
      <kb-validity state="typeMismatch">Eso no es un correo.</kb-validity>
    </kb-input>
    <kb-input name="password" type="password" required minlength="8">
      <kb-label>Contraseña</kb-label>
      <kb-validity state="tooShort">Al menos 8 caracteres.</kb-validity>
    </kb-input>
    <kb-button type="submit">Crear cuenta</kb-button>
  </template>
</kb-form>

<kb-text id="signup-output" size="xxs" color="master">nada enviado aún</kb-text>

<script type="module">
  document.querySelector('#signup').addEventListener('submitted', (event) => {
    document.querySelector('#signup-output').textContent = JSON.stringify(
      event.detail,
    )
  })
</script>
```

Envía con un campo vacío: no dispara nada, porque la validación nativa corre
primero y lo bloquea. Rellena ambos correctamente y `submitted` llega con
`{ email: …, password: … }` — indexado por el `name` de cada campo, ya parseado.
Nunca tocas `FormData`.

?> Los campos viven dentro de un `<template>`, no como hijos normales.
`<kb-form>` renderiza ese template en su shadow root; los hijos fuera de él no se
proyectan. Ve **[Componentes › Form](/es/components/)** para saber por qué.

## 4. Conectar sin listeners

Hasta aquí escribiste un `addEventListener`. Ahora conecta dos elementos sin
script alguno. Todo elemento de kuba es un host Echo: su atributo `on` — o un
hijo `<kb-on>` — declara un **arco**, `origen/evento:tipo/destino`.

```html preview
<kb-input name="greeting" placeholder="Escribe tu nombre">
  <kb-label>Nombre</kb-label>
</kb-input>

<kb-render>
  <kb-on value="greeting/changed:method/render"></kb-on>
  <template>¡Hola, {}!</template>
</kb-render>
```

Lee el arco como una frase: *cuando el elemento llamado `greeting` dispare
`changed`, llama al método `render` en mí, con el payload*. `<kb-render>`
interpola el payload en su `<template>` — `{}` es el valor completo.

Ninguno de los dos referencia al otro en código. El input no sabe que existe un
renderizador; el renderizador no importa el input. Acuerdan un nombre de evento.
Ese es todo el modelo de acoplamiento, y por eso kuba no tiene árbol de
componentes.

## Qué leer después

- **[Ciclo de vida](/es/learn/lifecycle)** — qué hacen `@define`, `@paint` y
  `@repaint` entre "elemento en el HTML" y "píxeles en pantalla".
- **[Eventos y Echo](/es/learn/events-and-echo)** — la gramática completa del
  arco, incluidos los filtros, y cuándo preferir un listener.
- **[Componentes](/es/components/)** — cada elemento con sus atributos, estados
  y ganchos de estilo.
- **[Recetario](/es/cookbook/)** — pantallas completas: búsqueda al escribir,
  CRUD, navegación declarativa.
