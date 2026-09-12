# Islands Architecture

## Problema

Uma SPA tradicional envia JavaScript para a página inteira, mesmo para as áreas
estáticas. O pattern envia código só para as regiões interativas.

## Como funciona

A página é HTML estático renderizado no servidor. Ilhas de interatividade são marcadas
com diretivas que decidem quando hidratar (ao carregar, quando visível, quando ocioso); o
resto permanece HTML puro sem JavaScript.

```html
<article>
  <p>Conteúdo estático...</p>
  <like-button client:load count="142"></like-button>
  <comment-section client:visible post-id="123"></comment-section>
</article>
```

## Quando não aplicar

- Aplicações com estado global compartilhado entre muitas partes da tela — a
  comunicação entre ilhas isoladas exige padrão adicional (event bus, skill `dataflow`).
- Superfícies altamente interativas de ponta a ponta: o ganho de "zero JS" desaparece
  quando quase tudo é ilha.

## Relação com as rules deste repositório

- **custom elements como unidade de ilha**: cada componente publicado por este
  repositório já é, por natureza, uma unidade hidratável isoladamente — o `connectedCallback`
  é o ponto de hidratação.
- **dataflow** (skill): é o mecanismo para comunicação entre ilhas que não se conhecem.
