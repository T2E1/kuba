---
layout: page
sidebar: false
title: Sobre
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
  <template #eyebrow>sobre</template>
  <template #title>Feito à mão, sobre a plataforma.</template>
  <template #actions>

[Ver no GitHub](https://github.com/deMGoncalves) [Ler o manifesto](/pt-br/manifesto)

  </template>
</PageHero>

<Band tone="cloud" pattern="dots">

<Heading>
  <template #label>01 — criador</template>
  <template #title>Quem constrói</template>
</Heading>

<Creator photo="https://github.com/deMGoncalves.png" alt="Retrato de Cleber de M. Goncalves">
  <template #name>Cleber de M. Goncalves</template>
  <template #role>criador e mantenedor do kuba</template>
  <template #bio>

Escreve e mantém o kuba — os custom elements, o barramento do Echo e este site.

  </template>
  <template #links>

[github/deMGoncalves](https://github.com/deMGoncalves)

  </template>

<Window file="stack.txt">

JavaScript puro, Web Components, Bun, Biome, Vitest e Playwright.

</Window>
<Window file="org.txt">

Publica o kuba como `@t2e1/kuba`, pela organização **T2E1**, sob licença MIT.

</Window>
<Window file="agora.txt">

Trabalhando rumo à primeira versão estável.

</Window>
</Creator>

</Band>

<Band tone="blush">

<Heading>
  <template #label>02 — por que o kuba existe</template>
  <template #title>A versão curta</template>
  <template #body>

Encurtar a distância entre "o servidor entrega HTML" e "a interface reage como
se houvesse um framework por trás" — sem runtime de estado, sem etapa de build,
sem uma nova linguagem de template. A versão longa é o
[manifesto](/pt-br/manifesto).

  </template>
</Heading>

<Closing>
  <template #title>"kuba não abstrai o DOM — ele confia nele."</template>
</Closing>

</Band>

<Band>

<Heading>
  <template #label>03 — valores</template>
  <template #title>O que guia cada decisão</template>
</Heading>

<WindowGrid :columns="3">
<Window file="simple.txt" icon="simple" swatch="#f28aa0">
  <template #title>Simples</template>

Um elemento que precisa de documentação extensa para ser entendido
provavelmente faz demais.

</Window>
<Window file="accessible.txt" icon="accessible" swatch="#b8acf3">
  <template #title>Acessível</template>

A plataforma faz o trabalho pesado: um `<input>` real, um `<form>` real,
landmarks nativos.

</Window>
<Window file="flexible.txt" icon="flexible" swatch="#afbfbc">
  <template #title>Flexível</template>

O mesmo `<kb-button>`, com outra aparência, trocando só quais tokens estão
ativos.

</Window>
<Window file="platform.txt" icon="platform" swatch="#f8d053">
  <template #title>Confie na plataforma</template>

Só escrever código quando o navegador genuinamente não oferece o comportamento.

</Window>
<Window file="interaction.txt" icon="interaction" swatch="#48b0f7">
  <template #title>Toda interação importa</template>

O nome de um evento, a redação de uma mensagem de validação, o `aria-*` que
falta.

</Window>
<Window file="token.txt" icon="token" swatch="#e03ad2">
  <template #title>Token, não exceção</template>

Um valor que não é token é um bug no design system, não um atalho.

</Window>
</WindowGrid>

</Band>

<Band tone="fog">

<Closing>
  <template #title>Construa junto.</template>
  <template #body>

O kuba tem licença MIT e é aberto a contribuições. Comece pelo guia de
contribuição, abra uma issue ou envie um pull request.

  </template>
  <template #actions>

[Ler o guia de contribuição](/pt-br/contributing) [Ver as issues](https://github.com/T2E1/kuba/issues)

  </template>
</Closing>

</Band>
