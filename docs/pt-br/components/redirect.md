# Redirect

Navega via `history.pushState` quando seu método `go()` roda, sem recarregar a
página. Ele não renderiza nada e não tem interação própria — é um assinante
headless do Echo, feito para ser ligado ao evento de outro elemento, na maioria
das vezes o `clicked` de um botão.

```html
<kb-button id="open-profile" value="42">Ver perfil</kb-button>
<kb-redirect href="/user/{}" on="#open-profile/clicked:method/go"></kb-redirect>
```

?> Não há preview ao vivo nesta página de propósito — todo exemplo mudaria a URL
do próprio site da documentação.

## Uso

```html
<kb-button id="save" value="42">Salvar</kb-button>
<kb-redirect href="/user/{id}" on="#save/clicked:method/go"></kb-redirect>
```

```js
document.querySelector('kb-redirect').go({ id: 42 }) // → /user/42
```

## Quando usar

- **O desfecho de uma interação é um novo endereço** — ligue o evento do
  elemento que dispara ao `go()` em vez de escrever `history.pushState` no
  código da página.
- **Navegando para uma rota nomeada e registrada no router** via `route`, ou
  para um caminho com segmentos dinâmicos via placeholders de `href`
  interpolados a partir do payload do evento.

## Quando não usar

- **O desfecho da interação não é uma navegação.** Um botão que submete um
  formulário não deveria ser ligado a um redirect — colocar navegação no botão o
  acoplaria a um destino que ele não deveria conhecer.
- **Uma navegação de página inteira ou uma URL externa.** Isto só chama
  `history.pushState`, que nunca sai do documento atual. Use um `<a>` comum.

## Composição

- **Pode conter**: nada. Sem slot, sem shadow DOM.
- **Pode ser filho de**: qualquer coisa. Costuma ser irmão do elemento cujo
  evento ele assina — logo depois do `<kb-button>` — e não aninhado dentro dele.

## `href` vs `route`

| Atributo | Resolve para | Notas |
|---|---|---|
| `href` | uma URL direta — URL absoluta, caminho absoluto, ou um fragmento `#`/`?` | Pode conter placeholders `{path.to.value}` interpolados a partir dos `params` passados ao `go()`. |
| `route` | um nome de rota registrado no router, resolvido via `urlFor` | **Tem precedência sobre o `href`** quando os dois estão definidos. |

!> Definir os dois esperando que o `href` funcione como fallback não funciona —
quando `route` está definido, só o `route` é usado.

Os placeholders são o que permite um único redirect servir uma lista inteira. O
payload do evento que dispara os preenche:

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

Cada card publica `clicked` com o próprio `value`, e o mesmo redirect resolve uma
URL diferente para cada um.

## Atributos

| Atributo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `href` | `string` | `'#'` | URL de destino, opcionalmente com placeholders `{path}`. |
| `route` | `string` | `''` | Nome de rota registrado no router. Vence o `href` quando definido. |
| `on` | string de arco | — | Ligação do Echo, `origem/evento:tipo/destino`. |

## Métodos

| Método | Devolve | Descrição |
|---|---|---|
| `go(params?)` | `this` | Navega via `history.pushState`, interpolando `params` no `href`. |

Este elemento não dispara eventos. A navegação em si emite um evento `pushstate`
no `window`, que o pacote do router escuta.

## Estados e acessibilidade

- O elemento é headless e invisível — sem estado renderizado, sem superfície de
  acessibilidade própria.
- **O nome acessível e o papel pertencem a quem dispara.** Um redirect ligado a
  um `<kb-button>` não herda nada dele; garanta que o botão se leia como a ação
  que executa.
- Como isto é `pushState` e não um link de verdade, o destino não aparece no
  hover, não abre em nova aba, e não é anunciado como link. Quando a interação é
  genuinamente "ir para esta página", um `<a>` comum serve melhor às pessoas;
  recorra ao `kb-redirect` quando a navegação é a *consequência* de uma ação, e
  não a ação em si.

## Certo e errado

| Faça | Não faça |
|---|---|
| Ligar o evento de um elemento que dispara ao `go()` | Chamar `history.pushState` à mão quando isto já cobre |
| Usar `route` para destinos registrados no router | Definir `href` e `route` esperando um fallback |
| Interpolar segmentos dinâmicos a partir do payload do evento | Fixar um id dentro do `href` |
| Usar um `<a>` comum quando a coisa *é* um link | Trocar todo link por um botão mais um redirect |
