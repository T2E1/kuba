# Fetch

Embrulha requisições HTTP para a URL do seu atributo `url`, interpolando o
payload nessa URL, e publica o desfecho como `succeeded` ou `failed`. Ele não
renderiza nada. Iniciar uma requisição aborta a que ainda estiver em andamento,
então respostas fora de ordem não conseguem sobrescrever resultados mais novos.

```html preview
<kb-input name="breed" placeholder="Tente 'akita'">
  <kb-label>Buscar raças de cachorro</kb-label>
</kb-input>

<kb-render>
  <kb-on value="dogs/succeeded:method/render"></kb-on>
  <kb-on value="dogs/failed:method/clear"></kb-on>
  <template>
    <kb-text size="xxs">{name}</kb-text>
  </template>
</kb-render>

<kb-fetch name="dogs" url="https://api.thedogapi.com/v1/breeds/search?q={}">
  <kb-on value="breed/changed:method/get"></kb-on>
</kb-fetch>
```

## Uso

```html
<kb-fetch name="users" url="/api/users/{id}"></kb-fetch>
```

```js
const fetcher = document.querySelector('kb-fetch')
fetcher.addEventListener('succeeded', (event) => render(event.detail))
fetcher.get({ id: 1 }) // → GET /api/users/1
```

## Quando usar

- **Qualquer requisição JSON cujo resultado guia a página** — uma busca, uma
  tela de detalhe, um salvamento — onde você escreveria `fetch`, parse, catch e
  atualização.
- **Requisições disparadas pelo evento de outro elemento**, ligadas de forma
  declarativa para que o markup mostre o fluxo de dados.

## Quando não usar

- **Respostas que não são JSON.** Todo verbo chama `.json()` internamente; uma
  resposta em texto, blob ou streaming não é suportada.
- **Requisições que precisam de retry, progresso ou streaming customizados** —
  use o pacote `http` diretamente, ou `fetch` puro.
- **Uma requisição cujo resultado nada na página consome.** Todo o propósito
  deste elemento é publicar o desfecho como evento.

## O template da URL

`url` pode conter placeholders `{path.to.value}`, resolvidos contra o payload
por busca de caminho com ponto. Segmentos ausentes ou nulos viram string vazia.

| `url` | `get(payload)` | Requisita |
|---|---|---|
| `/api/users/{id}` | `{ id: 42 }` | `/api/users/42` |
| `/search?q={}` | `'akita'` | `/search?q=akita` |
| `/api/{group.name}/list` | `{ group: { name: 'admins' } }` | `/api/admins/list` |

`{}` — o placeholder vazio — é o payload inteiro, e é isso que faz um arco vindo
de um campo de texto funcionar sem transformação nenhuma.

## Composição

- **Pode conter**: um `<kb-headers>` por nome de header, e um ou mais `<kb-on>`
  para arcos. Nada renderiza.
- **Pode ser filho de**: qualquer coisa. Costuma ser irmão dos elementos que
  alimenta, perto do fim do markup.

```html
<kb-fetch name="api" url="/api/users/{id}">
  <kb-headers key="x-api-key" value="PUBLIC-DEMO-KEY"></kb-headers>
  <kb-headers key="accept-language" value="pt-BR"></kb-headers>
  <kb-on value="row/clicked:method/get"></kb-on>
</kb-fetch>
```

O `<kb-headers>` define um par chave/valor no pai depois que o pai subiu. Ele
muta o pai, não a si mesmo — colocado sob qualquer coisa que não seja um
`<kb-fetch>`, ele não faz nada.

!> Uma chave escrita no markup fica visível para qualquer pessoa que abrir a
página. Use isto apenas para chaves públicas e com limite de taxa; qualquer
coisa de verdade pertence atrás do seu próprio endpoint.

## Métodos

Cada verbo aborta qualquer requisição pendente, interpola a URL, e devolve uma
promise que resolve para `{ data, error }` — ele nunca lança.

| Método | Envia | Corpo |
|---|---|---|
| `get(payload)` | GET | — |
| `post(payload)` | POST | o payload |
| `put(payload)` | PUT | o payload |
| `delete(payload)` | DELETE | — |

Para `post` e `put`, o payload é usado **duas vezes**: interpolado na URL *e*
enviado como corpo. Isso é conveniente quando o id vive nos dois, e surpreendente
quando não — `post({ id: 1, name: 'Ada' })` contra `url="/api/users/{id}"` envia
`{ id: 1, name: 'Ada' }` para `/api/users/1`.

Você também pode dar `await` no resultado diretamente em vez de escutar:

```js
const { data, error } = await fetcher.get({ id: 1 })
```

## Atributos

| Atributo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `url` | `string` | `''` | Template de URL, com placeholders `{path}` opcionais. |
| `name` | `string` | — | Identifica este elemento como a `origem` de um arco. |
| `on` | string de arco | — | Ligação do Echo, `origem/evento:tipo/destino`. |

## Eventos

| Evento | Dispara quando | `detail` |
|---|---|---|
| `succeeded` | a requisição resolveu sem erro | o corpo JSON já convertido |
| `failed` | a requisição ou a conversão falhou | `null` |

!> **O `failed` carrega `null`, não o erro.** Os dois ramos disparam o `data` do
resultado, que é `null` sempre que `error` está preenchido — então o motivo da
falha nunca chega ao listener. Ligue o `failed` a algo que não precise de
detalhe (`clear`, alternar uma mensagem), e dê `await` na chamada do método
quando precisar inspecionar o erro. Isto parece um bug, e não uma decisão de
projeto.

O disparo é adiado com `requestIdleCallback`, então os listeners rodam depois
que a resposta foi tratada, não no meio dela.

## Cancelamento

Cada chamada aborta a anterior antes de começar. Para um campo de busca enquanto
digita isso é exatamente o certo: só a consulta mais nova pode resolver, então
uma resposta anterior lenta não consegue cair por cima de uma posterior mais
rápida.

O outro lado: dois consumidores diferentes não podem compartilhar um
`<kb-fetch>`. Se uma tela de detalhe e uma lista requisitam pelo mesmo elemento,
o que disparar em segundo cancela o primeiro. Use um elemento por requisição
concorrente.

## Estados e acessibilidade

- O elemento é headless e não renderiza nada — ele não tem superfície de
  acessibilidade.
- **Nada anuncia carregamento nem falha.** Ligue `succeeded`/`failed` a algo
  visível: um `<kb-progress>`, uma mensagem, ou um `<kb-render>` que limpa. Uma
  falha silenciosa é invisível para todo mundo, e duplamente para quem usa
  leitor de tela.

## Certo e errado

| Faça | Não faça |
|---|---|
| Usar um elemento por requisição concorrente | Compartilhar um `<kb-fetch>` entre dois consumidores — cada chamada aborta a outra |
| Ligar o `failed` a uma reação visível como o `clear` | Contar com o `detail` do `failed` para explicar o que deu errado — ele é `null` |
| Dar `await` no método quando você precisa do erro | Supor uma promise rejeitada; ela resolve com `{ data, error }` |
| Manter chaves de API atrás do seu próprio endpoint | Colocar uma credencial de verdade num valor de `<kb-headers>` |
