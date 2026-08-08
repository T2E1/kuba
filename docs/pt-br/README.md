# kuba

Primitivos de Web Components e custom elements. Sem framework, sem etapa de
build — o navegador é o runtime, o HTML é a API.

Uma funcionalidade completa — buscar raças de cachorro enquanto se digita e
renderizar os resultados — ligada inteiramente em HTML, sem nenhum JavaScript
escrito por você. Digite nela:

```html preview
<kb-stack direction="column" spacing="xs" width="fill">
  <kb-input name="dog" width="fill">
    <kb-label>Busca de raças de cachorro</kb-label>
    <kb-helper>Tente 'akita' ou 'corgi'.</kb-helper>
  </kb-input>

  <kb-render layout="grid">
    <template>
      <kb-card>
        <kb-inset side="top">
          <kb-cover src="{image.url}"></kb-cover>
        </kb-inset>
        <kb-text family="highlight" weight="medium" size="xs" color="primary-dark">{name}</kb-text>
        <kb-stack direction="column" spacing="quarck">
          <kb-text size="xxxs"><strong>Criado para:</strong> {bred_for}</kb-text>
          <kb-text size="xxxs"><strong>Expectativa de vida:</strong> {life_span}</kb-text>
          <kb-text size="xxxs"><strong>Temperamento:</strong> {temperament}</kb-text>
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

Cada conexão é um **arco** — `origem/evento:tipo/destino`:

- `<kb-input name="dog">` publica um evento `changed`; o `<kb-fetch>` assina com
  `dog/changed:method/get` e busca `…/search?q={o valor digitado}`.
- `<kb-fetch name="api">` publica `succeeded` (ou `failed`); o `<kb-render>`
  assina com `api/succeeded:method/render` para pintar seu `<template>` uma vez
  por resultado, e com `api/failed:method/clear` para esvaziá-lo.
- Os placeholders `{name}`, `{bred_for}`, `{temperament}`… no template são
  preenchidos a partir de cada objeto de resultado.

Nenhum componente referencia o outro em código — eles só concordam com nomes de
evento. A mesma funcionalidade é destrinchada passo a passo em
**[Busca enquanto digita](/pt-br/build-ui/patterns/search-as-you-type)**.

Tudo neste site roda contra o pacote publicado, carregado de um CDN — as mesmas
duas linhas que você colocaria na sua própria página. Se um exemplo aqui
renderiza, o release funciona.

## O que é

kuba é um conjunto de custom elements e os pequenos primitivos que os compõem:
decorators para o ciclo de vida do custom element, mixins para atributos comuns,
uma camada de eventos e um sistema declarativo de fiação chamado Echo.

- **Componentes são HTML.** `<kb-input name="email" required>` é toda a API —
  atributos entram, eventos saem. Não há instância para importar, nem objeto de
  props, nem função de render.
- **Componentes conversam por eventos.** Nenhum elemento importa outro. Eles
  concordam com nomes de evento, e o Echo os conecta a partir do markup:
  `on="query/changed:method/get"`.
- **Estilo é CSS custom property.** Toda decisão visual é um token que você
  sobrescreve de fora; nada exige alcançar um shadow root.

## Comece por aqui

- **[Introdução](/pt-br/learn/introduction)** — por que existe, e a lacuna
  que ocupa entre um framework e HTML puro.
- **[Instalação](/pt-br/learn/installation)** — uma tag de script, ou instalação
  via pacote.
- **[Início rápido](/pt-br/learn/quick-start)** — um formulário funcionando em
  dez minutos.
- **[Componentes](/pt-br/components/)** — cada elemento, com exemplos ao vivo.
- **[Receitas](/pt-br/build-ui/patterns/)** — telas completas: busca enquanto digita,
  CRUD, navegação declarativa.

## O que não é

kuba não é uma alternativa ao React no sentido de substituir um modelo de
componentes — não há virtual DOM, sistema de reatividade nem reconciliação. O
estado vive no DOM e nos seus próprios objetos. Se sua aplicação precisa de
grafos de estado derivado e re-renderização granular, use um framework feito
para isso; kuba é para construir interfaces com elementos que a plataforma já
entende.

?> Esta tradução está em andamento. Páginas ainda não traduzidas aparecem em
inglês — a navegação continua funcionando normalmente.
