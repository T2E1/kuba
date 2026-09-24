---
layout: page
sidebar: false
title: About
---

<script setup>
import PageHero from '@page/PageHero.vue'
import Band from '@page/Band.vue'
import Heading from '@page/Heading.vue'
import Creator from '@page/Creator.vue'
import WindowGrid from '@page/WindowGrid.vue'
import Window from '@page/Window.vue'
import Closing from '@page/Closing.vue'
</script>

<PageHero>
  <template #eyebrow>about</template>
  <template #title>Handmade, on top of the platform.</template>
  <template #actions>

[View on GitHub](https://github.com/deMGoncalves) [Read the manifesto](/manifesto)

  </template>
</PageHero>

<Band tone="cloud" pattern="dots">

<Heading>
  <template #label>01 — creator</template>
  <template #title>Who builds it</template>
</Heading>

<Creator photo="https://github.com/deMGoncalves.png" alt="Portrait of Cleber de M. Goncalves">
  <template #name>Cleber de M. Goncalves</template>
  <template #role>creator and maintainer of kuba</template>
  <template #bio>

Writes and maintains kuba — the custom elements, the Echo bus, and this site.

  </template>
  <template #links>

[github/deMGoncalves](https://github.com/deMGoncalves)

  </template>

<Window file="stack.txt">

Plain JavaScript, Web Components, Bun, Biome, Vitest and Playwright.

</Window>
<Window file="org.txt">

Publishes kuba as `@t2e1/kuba`, under the **T2E1** organization, MIT licensed.

</Window>
<Window file="now.txt">

Working toward the first stable release.

</Window>
</Creator>

</Band>

<Band tone="blush">

<Heading>
  <template #label>02 — why kuba exists</template>
  <template #title>The short version</template>
  <template #body>

Shrink the distance between "the server delivers HTML" and "the interface
reacts as if a framework were behind it" — without a state runtime, a build
step, or a new templating language. The long version is the
[manifesto](/manifesto).

  </template>
</Heading>

<Closing>
  <template #title>"kuba doesn't abstract the DOM away — it trusts it."</template>
</Closing>

</Band>

<Band>

<Heading>
  <template #label>03 — values</template>
  <template #title>What guides every decision</template>
</Heading>

<WindowGrid :columns="3">
<Window file="simple.txt" icon="simple" swatch="#f28aa0">
  <template #title>Simple</template>

An element that needs extensive documentation to be understood is probably
doing too much.

</Window>
<Window file="accessible.txt" icon="accessible" swatch="#b8acf3">
  <template #title>Accessible</template>

The platform does the heavy lifting: a real `<input>`, a real `<form>`, native
landmarks.

</Window>
<Window file="flexible.txt" icon="flexible" swatch="#afbfbc">
  <template #title>Flexible</template>

The same `<kb-button>`, looking different, by changing only which tokens are
active.

</Window>
<Window file="platform.txt" icon="platform" swatch="#f8d053">
  <template #title>Trust the platform</template>

Write code only when the browser genuinely doesn't offer the behavior.

</Window>
<Window file="interaction.txt" icon="interaction" swatch="#48b0f7">
  <template #title>Every interaction matters</template>

How an event is named, the wording of a validation message, the missing
`aria-*`.

</Window>
<Window file="token.txt" icon="token" swatch="#e03ad2">
  <template #title>Tokens, not exceptions</template>

A value that isn't a token is a bug in the design system, not a shortcut.

</Window>
</WindowGrid>

</Band>

<Band tone="fog">

<Closing>
  <template #title>Build it together.</template>
  <template #body>

kuba is MIT licensed and open to contributions. Start with the contributing
guide, open an issue, or send a pull request.

  </template>
  <template #actions>

[Read the contributing guide](/contributing) [See the issues](https://github.com/T2E1/kuba/issues)

  </template>
</Closing>

</Band>
