---
layout: page
sidebar: false
---

<!--
  Esta página compõe nove componentes de seção sob
  `.vitepress/theme/components/home/` (importados aqui pelo alias `@home`).
  Esses nove arquivos `.vue` ainda não existem — construí-los é trabalho do
  `designer`/`developer`, não desta página. Este arquivo só carrega a
  estrutura e a copy que cada seção recebe via props e slots; trate um
  `@home/*.vue` ausente como pendência, não como erro desta página.
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
  <template #title>Componentes que conversam entre si.<br>Sem framework. Sem estado para gerenciar.</template>
  <template #subtitle>

Um barramento de eventos declarativo liga os elementos direto na marcação —
um **arc**, `source/event:type/sink`, substitui a cola que você escreveria à
mão para fazer dois componentes se entenderem.

  </template>
  <template #proof>

```html
<kb-input name="dog">…</kb-input>

<kb-fetch name="api" url="…/search?q={}">
  <kb-on value="dog/changed:method/get"></kb-on>
</kb-fetch>
```

Um arc: `dog/changed:method/get`. Quando `<kb-input name="dog">` dispara
`changed`, `<kb-fetch name="api">` chama seu próprio `get` — nenhum listener
escrito à mão, nenhuma referência de um elemento ao outro.

  </template>
</Hero>

<Problem>
  <template #title>Toda interface acaba precisando de um framework — só para dois componentes se falarem.</template>
  <template #body>

Dois elementos numa página raramente precisam *compartilhar estado*. Eles
precisam **concordar que algo aconteceu**: um valor mudou, uma requisição
terminou, um modal deve fechar. Isso não é um problema de gerenciamento de
estado — é encanamento. Mas sem um canal compartilhado para isso, o
encanamento é exatamente o que puxa um framework para dentro: algum lugar
precisa guardar referência aos dois elementos, escutar um e chamar o outro.

A aposta do kuba é que o encanamento é a parte que vale a pena automatizar, e
a regra de negócio é a parte que vale a pena escrever à mão. Um arc substitui
o encanamento; seu código fica livre para fazer o resto.

  </template>
  <template #code-before-label>Sem o kuba — a ligação é imperativa</template>
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
  <template #code-after-label>Com o kuba — a ligação é marcação</template>
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

Nenhum `useState`, nenhum `useEffect`, nenhum `AbortController` escrito à mão
— `<kb-fetch>` aborta sozinho uma requisição obsoleta. Passo a passo completo:
[Busca enquanto digita](/pt-br/build-ui/patterns/search-as-you-type).

  </template>
</Problem>

<HowItWorks>
  <template #title>Como funciona</template>
  <template #body>

Todo elemento do kuba que reage a outro carrega um atributo `on` (ou
`<kb-on>`) descrevendo uma conexão — um **arc**:

```
source/event:type/sink
```

- **`source`** é o `name` do elemento que dispara o evento.
- **`event`** é o nome do evento — `changed`, `succeeded`, `failed`, o que o
  source publicar.
- **`type`** é o que o arc aciona no sink: `method` chama uma função,
  `property` atribui um valor, `attribute` define um no DOM.
- **`sink`** é o que é chamado, atribuído ou definido.

```html
<kb-on value="dog/changed:method/get"></kb-on>
```

lê-se: *quando o elemento chamado `dog` disparar `changed`, chame o método
`get` deste elemento com o payload do evento.* O Echo — o barramento por
baixo — escuta o `CustomEvent` nativo, resolve `source` pelo `name`, e faz a
chamada. Nenhum elemento guarda referência a outro; eles só concordam num
nome e num evento.

  </template>
</HowItWorks>

<Boundary>
  <template #title>O que o kuba não é</template>
  <template #body>

O kuba não modela seu domínio. Ele não sabe o que é uma "raça de cachorro" ou
um "usuário" — só sabe que um elemento publicou um evento e outro pediu para
ser chamado quando isso acontece. O arc é o contrato inteiro: o que o payload
significa, e o que fazer com ele, fica inteiramente a cargo dos elementos em
cada ponta.

O kuba remove a cola de comunicação entre componentes. Ele não substitui as
decisões que sua aplicação ainda precisa tomar.

  </template>
</Boundary>

<ZeroFramework>
  <template #title>Zero framework</template>
  <template #body>

Todo elemento do kuba é um custom element padrão, registrado uma vez, que
roda sobre `CustomEvent` — uma capacidade do navegador, não de uma
biblioteca. Nada aqui precisa de bundler, runtime, ou um backend específico.
Duas tags `<script>` e `<link>` são a instalação inteira; coloque-as num
template PHP, numa view Rails, num template Django, ou num `.html` estático,
e cada tag abaixo funciona exatamente do mesmo jeito.

  </template>
</ZeroFramework>

<Accessible>
  <template #title>Acessível por padrão</template>
  <template #body>

Suporte a teclado e atributos ARIA não são um retoque de última hora na
marcação — eles vivem nos mixins dos quais todo elemento é construído.
`<kb-input>` delega a validação à Constraint Validation API; elementos de
formulário relatam estados customizados como `:state(invalid)` através de
`ElementInternals` em vez de reimplementar o que `<form>` já faz
nativamente.

  </template>
</Accessible>

<Comparison>
  <template #title>Onde o kuba se encaixa</template>
  <template #table>

| | Web Components crus | Biblioteca de componentes | Framework completo | kuba |
|---|---|---|---|---|
| Ligação entre componentes | Escrita à mão, toda vez | Não é o trabalho dela | Um runtime de estado | Arcs declarativos na marcação |
| Etapa de build | Nenhuma | Geralmente nenhuma | Obrigatória | Nenhuma |
| Runtime enviado ao navegador | Nenhum | Varia | Um runtime de framework | Zero dependências |
| Exigência de backend | Nenhuma | Nenhuma | Muitas vezes um backend específico | Nenhuma — qualquer stack |
| Onde vive o estado | Onde você colocar | Onde você colocar | Uma árvore de estado em JS | O DOM e seus próprios objetos |

  </template>
</Comparison>

<Playground>
  <template #title>Experimente</template>
  <template #body>

A mesma funcionalidade de busca de raça de cachorro do topo desta página,
editável ao vivo — mude um atributo, adicione um arc, veja reagir na hora.

  </template>
</Playground>

<Cta>
  <template #install>npm install kuba</template>
  <template #docs-label>Ler a documentação</template>
  <template #docs-link>/pt-br/learn/introduction</template>
  <template #github-label>Ver no GitHub</template>
  <template #github-link>https://github.com/T2E1/kuba</template>
</Cta>
