# Navegação declarativa

Navegar sem escrever `history.pushState` em lugar nenhum: um botão publica
`clicked`, e um `<kb-redirect>` assina. O botão nunca aprende para onde leva, que
é o que o mantém reutilizável.

```html
<kb-button id="to-profile">Ver perfil</kb-button>
<kb-redirect href="/profile" on="#to-profile/clicked:method/go"></kb-redirect>
```

?> Não há preview ao vivo nesta página. Todo exemplo chamaria `pushState` e
mudaria a URL da própria documentação.

## Por que o botão não conhece o destino

A alternativa que a maioria das bases escolhe coloca a navegação dentro do
controle:

```html
<!-- Não faça: o botão agora conhece o roteamento -->
<kb-button onclick="location.href = '/profile'">Ver perfil</kb-button>
```

Esse botão não pode ser reutilizado onde o destino for outro, e não pode ser
testado sem um router. Dividir em dois mantém cada elemento responsável por uma
coisa: o botão relata que foi pressionado, o redirect decide o que isso significa.

## Segmentos dinâmicos

Um único redirect serve uma lista inteira quando o destino tem um placeholder
preenchido pelo payload do evento:

```html
<kb-render>
  <kb-on value="users/changed:method/render"></kb-on>
  <template>
    <kb-card value="{id}">
      <kb-text size="xxs">{name}</kb-text>
    </kb-card>
  </template>
</kb-render>

<kb-redirect href="/user/{}" on="kb-card/clicked:method/go"></kb-redirect>
```

Duas coisas fazem isso funcionar:

- O `value="{id}"` de cada card é interpolado por registro, então cada card
  publica o próprio id como payload do `clicked`.
- A origem do arco é o **nome da tag** `kb-card`, casando com todo card da página
  em vez de um por id — então cards renderizados depois também estão cobertos.

`{}` no `href` é o payload inteiro. Para um payload em objeto, nomeie o caminho:
`href="/user/{id}/settings"`.

## Rotas nomeadas

Quando o router é dono dos formatos de URL, use `route` em vez de `href` e deixe
o `urlFor` resolver:

```js
import router from '@t2e1/kuba/router'

router('/user/:id', function showUser() {
  // renderiza a página do usuário
})
```

```html
<kb-redirect route="showUser" on="kb-card/clicked:method/go"></kb-redirect>
```

A rota é encontrada pelo **nome da função de página** — `showUser` — então ela
não pode ser uma arrow anônima. Nomeá-la é o que a torna endereçável.

!> Definir `route` e `href` juntos não dá um fallback. Com `route` definido,
`href` nunca é usado.

## Reagindo à navegação

`go()` chama `history.pushState`, que emite um evento `pushstate` no `window`. O
router escuta esse evento e roda a rota correspondente, então a página atualiza
sem reload:

```js
import router, { params } from '@t2e1/kuba/router'

router('/user/:id', function showUser() {
  document.querySelector('kb-fetch[name="user"]').get({ id: params.id })
})
```

A cadeia de ponta a ponta: card clicado → redirect navega → router casa → callback
da rota requisita → fetch publica `succeeded` → um renderizador assina. Dois
desses cinco passos são JavaScript, e ambos são sobre roteamento, não sobre
fiação.

## Quando usar um link de verdade

Este padrão abre mão de coisas que um `<a href>` puro dá de graça:

- o destino no hover, e na barra de status
- abrir em nova aba, copiar endereço, favoritar
- ser anunciado como link por tecnologia assistiva
- funcionar antes de o JavaScript carregar

**Quando a coisa genuinamente *é* um link, use um `<a>`.** Recorra ao
`<kb-redirect>` quando a navegação é *consequência* de uma ação — um salvar que
volta para uma lista, uma seleção que abre um detalhe — e não a ação em si.

## Relacionados

- [Redirect](/pt-br/components/redirect) — `href` versus `route`, e `go()`.
- [router](/pt-br/build-elements/router) — registro de rotas, `params`, `urlFor`.
- [Eventos e Echo](/pt-br/foundations/events-and-echo) — casar origens por id, nome ou
  tag.
