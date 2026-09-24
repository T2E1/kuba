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
  <template #title>O HTML é a aplicação, não o alvo.</template>
</PageHero>

<Band tone="fog">

<Chapter>
  <template #label>01 — nossa missão</template>
  <template #lead>

Oferecer um conjunto pequeno e coeso de primitivos que qualquer time possa
adotar progressivamente<sup>1</sup> — e encurtar a distância entre "o servidor
entrega HTML" e "a interface reage como se houvesse um framework por trás".

  </template>
</Chapter>

<Chapter>
  <template #label>02 — duas escolas</template>
  <template #body>

React, Vue e Angular tratam o DOM como detalhe de implementação a ser
abstraído. O estado vive no JavaScript, a interface é uma função dele, e o
custo é um universo paralelo: um runtime enviado ao navegador, uma etapa de
build, e um modelo de estado sem relação nenhuma com o DOM que ele produz.

O htmx vai na direção oposta e devolve ao HTML o papel de aplicação. Mas não há
fluxo de dados *dentro do cliente*: um filtro reagindo a um input vira
requisição de rede, porque não há outro canal.<sup>2</sup>

A lacuna entre essas duas escolas é a que o kuba fecha: <mark>fluxo de dados no
cliente sem sair do HTML, e sem um runtime de estado em JavaScript para
manter.</mark>

  </template>
</Chapter>

<EventFigure alt="Três elementos do kuba — kb-input, kb-fetch e kb-render — ligados pelos arcos dos eventos changed e succeeded.">
  <template #caption>fig. 1 — o sistema de eventos do DOM, disponível desde 1995<sup>3</sup></template>
  <template #label>03 — como o kuba resolve</template>
  <template #body>

Todo elemento consegue disparar um evento; todo elemento consegue escutar um.
Os frameworks reinventaram essa capacidade em userland — props, stores,
observables — porque eventos crus são desestruturados demais para compor uma
aplicação.

A resposta do kuba é padronizar o vocabulário, não substituir o mecanismo. Um
atributo `on` descreve, em markup puro, qual evento de qual elemento guia qual
método, propriedade ou atributo de destino.

O `CustomEvent` nativo faz a entrega de verdade; o kuba só fornece a gramática.
Dois elementos reagem um ao outro, e nenhum importa o outro.

Escrito em JavaScript puro, com <mark>zero dependências de runtime</mark>.<sup>4</sup>

  </template>
</EventFigure>

<WindowGrid :columns="2">
  <template #label>04 — quatro coisas em que acreditamos</template>
<Window file="crenca-1.txt">
  <template #title>Confie na plataforma antes de reinventá-la</template>

Só escrevemos código quando o navegador genuinamente não oferece o
comportamento — nunca por preferência estilística.

</Window>
<Window file="crenca-2.txt">
  <template #title>Seja criativo, mas responsável</template>

Um `types.d.ts` sem implementação não é contrato; uma implementação sem
`types.d.ts` não é componente público.

</Window>
<Window file="crenca-3.txt">
  <template #title>Toda interação importa</template>

O nome de um evento, a redação de uma mensagem de validação, o atributo
`aria-*` que falta num elemento.

</Window>
<Window file="crenca-4.txt">
  <template #title>Não trate uma restrição como desculpa</template>

Quando um cenário não cabe no modelo, o caminho é entender por que ele resiste,
não contorná-lo.

</Window>
</WindowGrid>

<Chapter>
  <template #label>05 — o que buscamos</template>
  <template #body>

**Reduzir o custo da mudança.** Apoiado em APIs nativas, cada elemento evolui
isolado, sem cascata de edições por outras camadas.

**Documentação viva.** Este site roda contra o pacote publicado a partir de um
CDN — então <mark>um release quebrado quebra a documentação, de forma
visível</mark>, em vez de passar despercebido.

**Deixar o raciocínio visível.** Por que o Echo sobrescreve `dispatchEvent`, por
que não existe store central. É o que permite estender a biblioteca, não apenas
consumi-la.

  </template>
</Chapter>

<Closing>
  <template #title>Construímos com o DOM, não sobre ele.</template>
  <template #actions>

[Ler a documentação](/pt-br/learn/introduction) [Ver no GitHub](https://github.com/T2E1/kuba)

  </template>
</Closing>

<Notes>
  <template #file>notas.txt</template>

1. Um único `<kb-button>` numa página existente, ou uma tela inteira
   orquestrada pelo barramento do Echo.
2. Interatividade que deveria ser instantânea e local é modelada como ida e
   volta ao servidor.
3. Todo elemento dispara e escuta eventos; o Echo só dá a eles uma gramática:
   `origem/evento:tipo/destino`.
4. Confira o `package.json`: a seção `dependencies` está vazia. O único shim é o
   `setImmediate`.

</Notes>

</Band>
