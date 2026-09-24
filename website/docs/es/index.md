---
layout: page
sidebar: false
---

<!--
  Las secciones de abajo viven en `.vitepress/theme/components/home/`,
  importadas con el alias `@home`. Este archivo solo lleva el texto que cada
  sección recibe por sus slots; el diseño y el aspecto son de los componentes.
-->

<script setup>
import Hero from '@home/Hero.vue'
import Problem from '@home/Problem.vue'
import HowItWorks from '@home/HowItWorks.vue'
import Principles from '@home/Principles.vue'
import Principle from '@home/Principle.vue'
import Comparison from '@home/Comparison.vue'
import Playground from '@home/Playground.vue'
import Faq from '@home/Faq.vue'
</script>

<Hero>
  <template #source>

```html
<kb-input name="dog">…</kb-input>
```

  </template>
  <template #arc>dog/changed:method/get</template>
  <template #sink>

```html
<kb-fetch name="api" url="…/search?q={}">
  <kb-on value="dog/changed:method/get"></kb-on>
</kb-fetch>
```

Un arc. Cuando `dog` dispara `changed`, `<kb-fetch>` llama a su propio `get` —
ningún listener escrito a mano.

  </template>
  <template #meta>Web Components · Cero dependencias · MIT</template>
  <template #title>Componentes que conversan entre sí.</template>
  <template #tagline>Sin framework. Sin estado que gestionar.</template>
  <template #subtitle>

Un bus de eventos declarativo conecta los elementos directamente en el
marcado — un **arc**, `source/event:type/sink`, reemplaza el pegamento que
escribirías a mano para que dos componentes se entiendan.

  </template>
  <template #actions>

[Leer la documentación](/es/learn/introduction) [Ver en GitHub](https://github.com/T2E1/kuba)

  </template>
</Hero>

<Problem>
  <template #eyebrow>01 — el problema</template>
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

  </template>
  <template #code-after-caption>

Ningún `useState`, ningún `useEffect`, ningún `AbortController` escrito a
mano — `<kb-fetch>` aborta solo una petición obsoleta. Recorrido completo:
[Búsqueda al escribir](/es/build-ui/patterns/search-as-you-type).

  </template>
  <template #stat>0 useState.<br>0 useEffect.</template>
  <template #stat-caption>La misma búsqueda de razas.<br>El mismo comportamiento.<br>Solo marcado.</template>
</Problem>

<HowItWorks>
  <template #eyebrow>02 — cómo funciona</template>
  <template #title>Un arc. Cuatro partes.</template>
  <template #intro>

Todo elemento de kuba que reacciona a otro lleva un atributo `on` (o un
`<kb-on>`) describiendo una conexión — un **arc**.

  </template>
  <template #source>

El `name` del elemento que dispara el evento.

  </template>
  <template #event>

El nombre del evento — `changed`, `succeeded`, `failed`, lo que el source publique.

  </template>
  <template #type>

Lo que el arc activa: `method` llama a una función, `property` asigna un valor, `attribute` escribe en el DOM.

  </template>
  <template #sink>

Lo que se llama, asigna o establece en el elemento que lleva el arc.

  </template>
  <template #reading>

Se lee: *cuando el elemento llamado `dog` dispare `changed`, llama al método
`get` de este elemento con el payload del evento.* Echo escucha el
`CustomEvent` nativo, resuelve el source por nombre y hace la llamada. Ningún
elemento guarda referencia a otro.

  </template>
</HowItWorks>

<Principles>

<Principle file="no-es.txt">
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
</Principle>

<Principle file="cero-framework.txt">
  <template #title>Cero framework</template>
  <template #body>

Todo elemento de kuba es un custom element estándar, registrado una vez, que
corre sobre `CustomEvent` — una capacidad del navegador, no de una
biblioteca. Nada aquí necesita bundler, runtime, ni un backend específico.
Dos etiquetas `<script>` y `<link>` son toda la instalación; ponlas en una
plantilla PHP, una vista Rails, una plantilla Django, o un `.html` estático,
y cada etiqueta de abajo funciona exactamente igual.

  </template>
</Principle>

<Principle file="a11y.txt">
  <template #title>Accesible por defecto</template>
  <template #body>

El soporte de teclado y los atributos ARIA no son un retoque de último
momento sobre el marcado — viven en los mixins de los que se construye cada
elemento. `<kb-input>` delega la validación a la Constraint Validation API;
los elementos de formulario reportan estados personalizados como
`:state(invalid)` mediante `ElementInternals` en vez de reimplementar lo que
`<form>` ya hace de forma nativa.

  </template>
</Principle>

</Principles>

<Comparison>
  <template #eyebrow>03 — dónde encaja</template>
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
  <template #eyebrow>04 — pruébalo</template>
  <template #title>Cambia un atributo.<br>Mira cómo reacciona.</template>
  <template #body>

La misma funcionalidad de búsqueda de razas de perro del inicio de esta
página, editable en vivo — cambia un atributo, agrega un arc, míralo
reaccionar al instante.

  </template>
</Playground>

<Faq>
  <template #title>Preguntas</template>

<details>
<summary>¿kuba reemplaza mi framework?</summary>

Reemplaza el pegamento de comunicación entre componentes, no las decisiones de tu aplicación. kuba no modela tu dominio: el arc es todo el contrato, y lo que significa el payload queda con los elementos en cada extremo.

</details>

<details>
<summary>¿Necesito un bundler o un paso de build?</summary>

No. Cada elemento es un custom element estándar, registrado una vez, sobre `CustomEvent`. Un `<script>` y un `<link>` son toda la instalación.

</details>

<details>
<summary>¿Funciona con mi backend?</summary>

Con cualquiera. En una página estática, una plantilla PHP, una vista Rails o una plantilla Django, cada etiqueta funciona igual.

</details>

<details>
<summary>¿Dónde vive el estado?</summary>

En el DOM y en tus propios objetos. Ningún elemento guarda referencia a otro: se conectan por un nombre y un evento.

</details>

<details>
<summary>¿Es accesible?</summary>

El teclado y ARIA viven en los mixins de los que se construye cada elemento. Los campos de formulario usan la Constraint Validation API y reportan estado mediante `ElementInternals`.

</details>

</Faq>
