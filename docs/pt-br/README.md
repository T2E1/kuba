# kuba

Primitivos de Web Components e custom elements. Sem framework, sem etapa de
build — o navegador é o runtime, o HTML é a API.

```html preview
<kb-stack direction="row" spacing="xs">
  <kb-button>Primário</kb-button>
  <kb-button variant="outlined">Contornado</kb-button>
  <kb-button variant="link">Link</kb-button>
</kb-stack>
```

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
