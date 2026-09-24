---
layout: page
sidebar: false
title: Manifesto
---

<script setup>
import PageHero from '@page/PageHero.vue'
import EventLog from '@page/EventLog.vue'
import Band from '@page/Band.vue'
import Chapter from '@page/Chapter.vue'
import EventFigure from '@page/EventFigure.vue'
import WindowGrid from '@page/WindowGrid.vue'
import Window from '@page/Window.vue'
import Closing from '@page/Closing.vue'
import Notes from '@page/Notes.vue'
</script>

<PageHero>
  <template #art><EventLog /></template>
  <template #eyebrow>manifesto</template>
  <template #title>HTML is the application, not the target.</template>
</PageHero>

<Band tone="fog">

<Chapter>
  <template #label>01 — our mission</template>
  <template #lead>

Offer a small, cohesive set of primitives that any team can adopt
progressively<sup>1</sup> — and shrink the distance between "the server
delivers HTML" and "the interface reacts as if a framework were behind it".

  </template>
</Chapter>

<Chapter>
  <template #label>02 — two schools</template>
  <template #body>

React, Vue, and Angular treat the DOM as an implementation detail to be
abstracted away. State lives in JavaScript, the UI is a function of it, and the
cost is a parallel universe: a runtime shipped to the browser, a build step,
and a state model that has nothing to do with the DOM it produces.

htmx goes the opposite direction and restores HTML as the application. But it
has no dataflow *inside the client*: a filter reacting to an input becomes a
network request, because there is no other channel.<sup>2</sup>

The gap between these two schools is the one kuba closes: <mark>client-side
dataflow without leaving HTML, and without a JavaScript state runtime to
maintain.</mark>

  </template>
</Chapter>

<EventFigure alt="Three kuba elements — kb-input, kb-fetch and kb-render — connected by the changed and succeeded event arcs.">
  <template #caption>fig. 1 — the DOM event system, available since 1995<sup>3</sup></template>
  <template #label>03 — how kuba solves it</template>
  <template #body>

Every element can dispatch an event; every element can listen for one.
Frameworks reinvented this in userland — props, stores, observables — because
raw DOM events are too unstructured to compose an application from.

kuba's answer is to standardize the vocabulary, not to replace the mechanism.
An `on` attribute describes, in plain markup, which event of which element
drives which method, property, or attribute.

The native `CustomEvent` does the actual delivery; kuba only supplies the
grammar. Two elements react to each other, and neither imports the other.

Written in plain JavaScript, with <mark>zero runtime dependencies</mark>.<sup>4</sup>

  </template>
</EventFigure>

<WindowGrid :columns="2">
  <template #label>04 — four things we believe</template>
<Window file="belief-1.txt">
  <template #title>Trust the platform before reinventing it</template>

We write code only when the browser genuinely doesn't offer the behavior —
never out of stylistic preference.

</Window>
<Window file="belief-2.txt">
  <template #title>Be creative, but stay accountable</template>

A `types.d.ts` with no implementation isn't a contract; an implementation with
no `types.d.ts` isn't a public component.

</Window>
<Window file="belief-3.txt">
  <template #title>Every interaction matters</template>

How an event is named, the wording of a validation message, the `aria-*`
attribute missing from an element.

</Window>
<Window file="belief-4.txt">
  <template #title>Don't treat a constraint as an excuse</template>

When a scenario doesn't fit the model, the way forward is to understand why it
resists, not to route around it.

</Window>
</WindowGrid>

<Chapter>
  <template #label>05 — what we're aiming for</template>
  <template #body>

**Lower the cost of change.** Leaning on native APIs, each element evolves in
isolation, with no cascade of edits across other layers.

**Living documentation.** This site runs against the published package from a
CDN — so <mark>a broken release breaks the documentation, visibly</mark>,
instead of passing unnoticed.

**Make the reasoning visible.** Why Echo overrides `dispatchEvent`, why there
is no central store. That's what lets someone extend the library instead of
only consuming it.

  </template>
</Chapter>

<Closing>
  <template #title>We build with the DOM, not on top of it.</template>
  <template #actions>

[Read the docs](/learn/introduction) [View on GitHub](https://github.com/T2E1/kuba)

  </template>
</Closing>

<Notes>
  <template #file>notes.txt</template>

1. A single `<kb-button>` on an existing page, or an entire screen orchestrated
   through the Echo bus.
2. Interactivity that should be instant and local is modeled as a round trip
   to the server.
3. Every element dispatches and listens for events; Echo only gives them a
   grammar: `source/event:type/sink`.
4. Check `package.json`: the `dependencies` section is empty. The only shim is
   `setImmediate`.

</Notes>

</Band>
