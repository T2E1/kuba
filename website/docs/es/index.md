---
layout: page
sidebar: false
---

<!--
  Esta página compone nueve componentes de sección bajo
  `.vitepress/theme/components/home/` (importados aquí mediante el alias
  `@home`). Esos nueve archivos `.vue` todavía no existen — construirlos es
  trabajo de `designer`/`developer`, no de esta página. Este archivo solo
  lleva la estructura y la copy que cada sección recibe vía props y slots;
  trata un `@home/*.vue` ausente como pendiente, no como un error de esta
  página.
-->

<script setup>
import Hero from '@home/Hero.vue'
import Problem from '@home/Problem.vue'
import HowItWorks from '@home/HowItWorks.vue'
import Boundary from '@home/Boundary.vue'
import ZeroFramework from '@home/ZeroFramework.vue'
import Accessible from '@home/Accessible.vue'
import Comparison from '@home/Comparison.vue'
import Playground from '@home/Playground.vue'
import Cta from '@home/Cta.vue'
</script>

<Hero>
  <template #eyebrow>kuba</template>
  <template #title>Componentes que conversan entre sí.<br>Sin framework. Sin estado que gestionar.</template>
  <template #subtitle>

Un bus de eventos declarativo conecta los elementos directamente en el
marcado — un **arc**, `source/event:type/sink`, reemplaza el pegamento que
escribirías a mano para que dos componentes se entiendan.

  </template>
  <template #proof>

```html
<kb-input name="dog">…</kb-input>

<kb-fetch name="api" url="…/search?q={}">
  <kb-on value="dog/changed:method/get"></kb-on>
</kb-fetch>
```

Un arc: `dog/changed:method/get`. Cuando `<kb-input name="dog">` dispara
`changed`, `<kb-fetch name="api">` llama a su propio `get` — ningún listener
escrito a mano, ninguna referencia de un elemento al otro.

  </template>
</Hero>

<Problem>
  <template #title>Toda interfaz termina necesitando un framework — solo para que dos componentes se hablen.</template>
  <template #body>

Dos elementos en una página rara vez necesitan *compartir estado*. Necesitan
**acordar que algo pasó**: un valor cambió, una petición terminó, un modal
debe cerrarse. Eso no es un problema de gestión de estado — es plomería.
Pero sin un canal compartido para eso, la plomería es exactamente lo que
atrae a un framework: en algún lugar hay que guardar referencia a los dos
elementos, escuchar uno y llamar al otro.

La apuesta de kuba es que la plomería es la parte que vale la pena
automatizar, y la regla de negocio es la parte que vale la pena escribir a
mano. Un arc reemplaza la plomería; tu código queda libre para hacer el
resto.

  </template>
  <template #code-before-label>Sin kuba — la conexión es imperativa</template>
  <template #code-before-react-label>React</template>
  <template #code-before-react>

```jsx
function DogSearch() {
  const [query, setQuery] = useState('')
  const [breeds, setBreeds] = useState([])
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!query) return
    const controller = new AbortController()
    fetch(`https://api.thedogapi.com/v1/breeds/search?q=${query}`, {
      headers: { 'x-api-key': 'DEMO-API-KEY' },
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then(setBreeds)
      .catch(() => setFailed(true))
    return () => controller.abort()
  }, [query])

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {failed ? null : breeds.map((breed) => (
        <Card
          key={breed.id}
          name={breed.name}
          bredFor={breed.bred_for}
          lifeSpan={breed.life_span}
          temperament={breed.temperament}
        />
      ))}
    </div>
  )
}
```

  </template>
  <template #code-before-vue-label>Vue</template>
  <template #code-before-vue>

```vue
<script setup>
import { ref, watchEffect } from 'vue'

const query = ref('')
const breeds = ref([])
const failed = ref(false)

watchEffect((onCleanup) => {
  if (!query.value) return
  const controller = new AbortController()
  fetch(`https://api.thedogapi.com/v1/breeds/search?q=${query.value}`, {
    headers: { 'x-api-key': 'DEMO-API-KEY' },
    signal: controller.signal,
  })
    .then((res) => res.json())
    .then((data) => { breeds.value = data })
    .catch(() => { failed.value = true })
  onCleanup(() => controller.abort())
})
</script>

<template>
  <div>
    <input v-model="query" />
    <template v-if="!failed">
      <Card
        v-for="breed in breeds"
        :key="breed.id"
        :name="breed.name"
        :bred-for="breed.bred_for"
        :life-span="breed.life_span"
        :temperament="breed.temperament"
      />
    </template>
  </div>
</template>
```

  </template>
  <template #code-before-angular-label>Angular</template>
  <template #code-before-angular>

```ts
@Component({
  selector: 'app-dog-search',
  standalone: true,
  imports: [CardComponent],
  template: `
    <div>
      <input [value]="query()" (input)="query.set($any($event.target).value)" />
      @if (!failed()) {
        @for (breed of breeds(); track breed.id) {
          <app-card
            [name]="breed.name"
            [bredFor]="breed.bred_for"
            [lifeSpan]="breed.life_span"
            [temperament]="breed.temperament"
          />
        }
      }
    </div>
  `,
})
export class DogSearchComponent {
  private http = inject(HttpClient)
  query = signal('')
  breeds = signal<Breed[]>([])
  failed = signal(false)

  constructor() {
    effect((onCleanup) => {
      const query = this.query()
      if (!query) return
      const subscription = this.http
        .get<Breed[]>(`https://api.thedogapi.com/v1/breeds/search?q=${query}`, {
          headers: { 'x-api-key': 'DEMO-API-KEY' },
        })
        .subscribe({
          next: (data) => this.breeds.set(data),
          error: () => this.failed.set(true),
        })
      onCleanup(() => subscription.unsubscribe())
    })
  }
}
```

  </template>
  <template #code-after-label>Con kuba — la conexión es marcado</template>
  <template #code-after>

```html
<kb-stack direction="column" spacing="xs" width="fill">
  <kb-input name="dog" width="fill">
    <kb-label>Dog Breed Search</kb-label>
    <kb-helper>Try 'akita' or 'corgi'.</kb-helper>
  </kb-input>

  <kb-render layout="grid">
    <template>
      <kb-card>
        <kb-inset side="top">
          <kb-cover src="{image.url}"></kb-cover>
        </kb-inset>
        <kb-text family="highlight" weight="medium" size="xs" color="primary-dark">{name}</kb-text>
        <kb-stack direction="column" spacing="quarck">
          <kb-text size="xxxs"><strong>Bred for:</strong> {bred_for}</kb-text>
          <kb-text size="xxxs"><strong>Life span:</strong> {life_span}</kb-text>
          <kb-text size="xxxs"><strong>Temperament:</strong> {temperament}</kb-text>
        </kb-stack>
      </kb-card>
    </template>
    <kb-on value="api/succeeded:method/render"></kb-on>
    <kb-on value="api/failed:method/clear"></kb-on>
  </kb-render>
</kb-stack>

<kb-fetch name="api" url="https://api.thedogapi.com/v1/breeds/search?q={}">
  <kb-headers key="x-api-key" value="DEMO-API-KEY"></kb-headers>
  <kb-on value="dog/changed:method/get"></kb-on>
</kb-fetch>
```

Ningún `useState`, ningún `useEffect`, ningún `AbortController` escrito a
mano — `<kb-fetch>` aborta solo una petición obsoleta. Recorrido completo:
[Búsqueda al escribir](/es/build-ui/patterns/search-as-you-type).

  </template>
</Problem>

<HowItWorks>
  <template #title>Cómo funciona</template>
  <template #body>

Todo elemento de kuba que reacciona a otro lleva un atributo `on` (o
`<kb-on>`) describiendo una conexión — un **arc**:

```
source/event:type/sink
```

- **`source`** es el `name` del elemento que dispara el evento.
- **`event`** es el nombre del evento — `changed`, `succeeded`, `failed`, lo
  que el source publique.
- **`type`** es lo que el arc activa en el sink: `method` llama a una
  función, `property` asigna un valor, `attribute` establece uno en el DOM.
- **`sink`** es lo que se llama, asigna o establece.

```html
<kb-on value="dog/changed:method/get"></kb-on>
```

se lee: *cuando el elemento llamado `dog` dispare `changed`, llama al método
`get` de este elemento con el payload del evento.* Echo — el bus por debajo —
escucha el `CustomEvent` nativo, resuelve `source` por `name`, y hace la
llamada. Ningún elemento guarda referencia a otro; solo acuerdan un nombre y
un evento.

  </template>
</HowItWorks>

<Boundary>
  <template #title>Lo que kuba no es</template>
  <template #body>

kuba no modela tu dominio. No tiene idea de qué es una "raza de perro" o un
"usuario" — solo sabe que un elemento publicó un evento y otro pidió ser
llamado cuando eso pasa. El arc es todo el contrato: qué significa el
payload, y qué hacer con él, queda enteramente a cargo de los elementos en
cada extremo.

kuba elimina el pegamento de comunicación entre componentes. No reemplaza
las decisiones que tu aplicación todavía tiene que tomar.

  </template>
</Boundary>

<ZeroFramework>
  <template #title>Cero framework</template>
  <template #body>

Todo elemento de kuba es un custom element estándar, registrado una vez, que
corre sobre `CustomEvent` — una capacidad del navegador, no de una
biblioteca. Nada aquí necesita bundler, runtime, ni un backend específico.
Dos etiquetas `<script>` y `<link>` son toda la instalación; ponlas en una
plantilla PHP, una vista Rails, una plantilla Django, o un `.html` estático,
y cada etiqueta de abajo funciona exactamente igual.

  </template>
</ZeroFramework>

<Accessible>
  <template #title>Accesible por defecto</template>
  <template #body>

El soporte de teclado y los atributos ARIA no son un retoque de último
momento sobre el marcado — viven en los mixins de los que se construye cada
elemento. `<kb-input>` delega la validación a la Constraint Validation API;
los elementos de formulario reportan estados personalizados como
`:state(invalid)` mediante `ElementInternals` en vez de reimplementar lo que
`<form>` ya hace de forma nativa.

  </template>
</Accessible>

<Comparison>
  <template #title>Dónde encaja kuba</template>
  <template #table>

| | Web Components a mano | Biblioteca de componentes | Framework completo | kuba |
|---|---|---|---|---|
| Conexión entre componentes | Escrita a mano, cada vez | No es su trabajo | Un runtime de estado | Arcs declarativos en el marcado |
| Paso de build | Ninguno | Generalmente ninguno | Obligatorio | Ninguno |
| Runtime enviado al navegador | Ninguno | Varía | Un runtime de framework | Cero dependencias |
| Requisito de backend | Ninguno | Ninguno | Frecuentemente un backend específico | Ninguno — cualquier stack |
| Dónde vive el estado | Donde lo pongas | Donde lo pongas | Un árbol de estado en JS | El DOM y tus propios objetos |

  </template>
</Comparison>

<Playground>
  <template #title>Pruébalo</template>
  <template #body>

La misma funcionalidad de búsqueda de razas de perro del inicio de esta
página, editable en vivo — cambia un atributo, agrega un arc, míralo
reaccionar al instante.

  </template>
</Playground>

<Cta>
  <template #install>npm install kuba</template>
  <template #docs-label>Leer la documentación</template>
  <template #docs-link>/es/learn/introduction</template>
  <template #github-label>Ver en GitHub</template>
  <template #github-link>https://github.com/T2E1/kuba</template>
</Cta>
