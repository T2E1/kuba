---
layout: page
sidebar: false
---

<!--
  The sections below live in `.vitepress/theme/components/home/`, imported
  through the `@home` alias. This file only carries the copy each section
  receives through slots; the layout and the look belong to the components.
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

One arc. When `dog` dispatches `changed`, `<kb-fetch>` calls its own `get` —
no listener written by hand.

  </template>
  <template #meta>Web Components · Zero dependencies · MIT</template>
  <template #title>Components that talk to each other.</template>
  <template #tagline>No framework. No state to manage.</template>
  <template #subtitle>

A declarative event bus wires elements together right in the markup — an
**arc**, `source/event:type/sink`, replaces the glue code you'd otherwise
write by hand to make two components agree.

  </template>
  <template #actions>

[Read the docs](/learn/introduction) [View on GitHub](https://github.com/T2E1/kuba)

  </template>
</Hero>

<Problem>
  <template #eyebrow>01 — the problem</template>
  <template #title>Every interface ends up needing a framework — just so two components can talk.</template>
  <template #body>

Two elements on a page rarely need to *share state*. They need to **agree that
something happened**: a value changed, a request finished, a modal should
close. That's not a state-management problem — it's plumbing. But without a
shared channel for it, the plumbing is exactly what pulls a framework in:
somewhere has to hold a reference to both elements, listen on one, and call
the other.

kuba's bet is that the plumbing is the part worth automating, and the
business rule is the part worth writing by hand. An arc replaces the
plumbing; your code stays free to do the rest.

  </template>
  <template #code-before-label>Without kuba — the wiring is imperative</template>
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
  <template #code-after-label>With kuba — the wiring is markup</template>
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

No `useState`, no `useEffect`, no `AbortController` written by hand — `<kb-fetch>`
aborts a stale request on its own. Full walkthrough:
[Search as you type](/build-ui/patterns/search-as-you-type).

  </template>
  <template #stat>0 useState.<br>0 useEffect.</template>
  <template #stat-caption>Same breed search.<br>Same behavior.<br>Just markup.</template>
</Problem>

<HowItWorks>
  <template #eyebrow>02 — how it works</template>
  <template #title>One arc. Four parts.</template>
  <template #intro>

Every kuba element that reacts to another carries an `on` attribute (or a
`<kb-on>`) describing one connection — an **arc**.

  </template>
  <template #source>

The `name` of the element that dispatches the event.

  </template>
  <template #event>

The event name — `changed`, `succeeded`, `failed`, whatever the source publishes.

  </template>
  <template #type>

What the arc drives: `method` calls a function, `property` assigns a value, `attribute` writes to the DOM.

  </template>
  <template #sink>

What gets called, assigned, or set on the element that carries the arc.

  </template>
  <template #reading>

Reads as: *when the element named `dog` dispatches `changed`, call this
element's `get` method with the event's payload.* Echo listens for the native
`CustomEvent`, resolves the source by name, and makes the call. No element
holds a reference to another.

  </template>
</HowItWorks>

<Principles>

<Principle file="not.txt">
  <template #title>What kuba is not</template>
  <template #body>

kuba does not model your domain. It has no idea what a "dog breed" or a "user"
is — it only knows that one element published an event and another asked to
be called when that happens. The arc is the whole contract: what the payload
means, and what to do with it, stays entirely up to the elements at each end.

kuba removes the communication glue between components. It does not replace
the decisions your application still has to make.

  </template>
</Principle>

<Principle file="zero-framework.txt">
  <template #title>Zero framework</template>
  <template #body>

Every kuba element is a standard custom element, registered once, that runs
on `CustomEvent` — a browser capability, not a library's. Nothing here needs a
bundler, a runtime, or a specific backend. Two `<script>` and `<link>` tags is
the entire installation; drop them into a PHP template, a Rails view, a
Django template, or a static `.html` file, and every tag below works exactly
the same way.

  </template>
</Principle>

<Principle file="a11y.txt">
  <template #title>Accessible by default</template>
  <template #body>

Keyboard support and ARIA attributes are not an afterthought bolted onto the
markup — they live in the mixins every element is built from. `<kb-input>`
delegates validation to the Constraint Validation API; form elements report
custom states like `:state(invalid)` through `ElementInternals` instead of
reimplementing what `<form>` already does natively.

  </template>
</Principle>

</Principles>

<Comparison>
  <template #eyebrow>03 — where it fits</template>
  <template #title>Where kuba sits</template>
  <template #table>

| | Hand-rolled Web Components | Component library | Full framework | kuba |
|---|---|---|---|---|
| Cross-component wiring | Written by hand, every time | Not its job | A state runtime | Declarative arcs in markup |
| Build step | None | Usually none | Required | None |
| Runtime shipped to the browser | None | Varies | A framework runtime | Zero dependencies |
| Backend requirement | None | None | Often a matching backend | None — any stack |
| Where state lives | Wherever you put it | Wherever you put it | A JS state tree | The DOM and your own objects |

  </template>
</Comparison>

<Playground>
  <template #eyebrow>04 — try it</template>
  <template #title>Change an attribute.<br>Watch it react.</template>
  <template #body>

The same search-dog-breeds feature from the top of this page, editable live —
change an attribute, add an arc, see it react immediately.

  </template>
</Playground>

<Faq>
  <template #title>Questions</template>

<details>
<summary>Does kuba replace my framework?</summary>

It replaces the communication glue between components, not the decisions your application makes. kuba does not model your domain: the arc is the whole contract, and what the payload means stays with the elements at each end.

</details>

<details>
<summary>Do I need a bundler or a build step?</summary>

No. Every element is a standard custom element, registered once, running on `CustomEvent`. A `<script>` and a `<link>` are the whole installation.

</details>

<details>
<summary>Does it work with my backend?</summary>

With any of them. In a static page, a PHP template, a Rails view, or a Django template, every tag works the same way.

</details>

<details>
<summary>Where does state live?</summary>

In the DOM and in your own objects. No element holds a reference to another: they connect through a name and an event.

</details>

<details>
<summary>Is it accessible?</summary>

Keyboard support and ARIA live in the mixins every element is built from. Form fields use the Constraint Validation API and report state through `ElementInternals`.

</details>

</Faq>
