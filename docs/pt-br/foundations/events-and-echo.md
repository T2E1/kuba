# Eventos e Echo

Elementos do kuba nunca importam uns aos outros. Eles disparam eventos, e o Echo
os conecta a partir do markup. Esta página explica as duas metades: os eventos
que um componente publica, e a gramática de arco que assina esses eventos.

## Eventos são a API pública

Todo componente do kuba que faz algo dispara um `CustomEvent` descrevendo o que
aconteceu, com o valor relevante em `detail`. Os eventos borbulham e são
compostos, então atravessam fronteiras de shadow como os nativos.

Os nomes estão sempre no **passado** — relatam um fato, não pedem uma ação:

| Elemento | Evento | `detail` |
|---|---|---|
| `<kb-button>`, `<kb-card>` | `clicked` | o `value` do elemento |
| `<kb-input>`, `<kb-textarea>`, `<kb-fileupload>` | `changed` | o novo valor |
| `<kb-form>` | `submitted` | os dados do formulário parseados |
| `<kb-form>` | `resetted` | `{}` |
| `<kb-dataset>` | `changed` | a coleção completa de registros |
| `<kb-filter>` | `filtered` | os registros correspondentes |
| `<kb-find>` | `found` | o registro correspondente |
| `<kb-fetch>` | `succeeded` | o corpo da resposta parseado |
| `<kb-fetch>` | `failed` | `null` — veja [Fetch](/pt-br/components/fetch) |

?> `<kb-filter>` e `<kb-find>` disparam no **pai**, não em si mesmos — a única
exceção à regra acima. O `source` de um arco precisa nomear a coleção pai.

Você pode consumir qualquer um deles do jeito comum:

```js
document.querySelector('kb-form').addEventListener('submitted', (event) => {
  save(event.detail)
})
```

## O arco

A alternativa do Echo é declarativa. Todo elemento é um host Echo: ele observa um
atributo `on` cujo valor é um **arco**.

```
origem/evento:tipo/destino|filtro=valor
```

Leia da esquerda para a direita: *quando `origem` disparar `evento`, aplique
`destino` em mim, usando `tipo`, depois de passar o payload pelos filtros.*

```html
<kb-render on="results/succeeded:method/render"></kb-render>
```

Um filho `<kb-on>` faz o mesmo e é mais legível quando um elemento tem vários
arcos — um por linha, em vez de um atributo longo:

```html
<kb-render>
  <kb-on value="api/succeeded:method/render"></kb-on>
  <kb-on value="api/failed:method/clear"></kb-on>
  <template>{name}</template>
</kb-render>
```

### `origem` — qual elemento escutar

| Forma | Casa com |
|---|---|
| `*` | qualquer elemento |
| `#id` | o elemento cujo `id` é `id` |
| `nome` | o elemento cujo atributo `name` é `nome` |
| `tag-name` | qualquer elemento daquela tag |

A correspondência ignora maiúsculas e acontece num barramento compartilhado: todo
host Echo ecoa os próprios disparos ali, marcados com seu `id`, `name` e tag.

### `tipo` — como o payload é aplicado

| `tipo` | Efeito |
|---|---|
| `method` | chama `this[destino](payload)` |
| `setter` | atribui `this[destino] = payload` |
| `attribute` | chama `this.setAttribute(destino, payload)` |

### Filtros — transformando o payload

Filtros são pares `nome=valor` separados por `|`, aplicados em ordem, cada um
uma função de `(payload, valor)`:

```html
<kb-text on="user/changed:setter/textContent|prop=email"></kb-text>
```

Os nomes disponíveis vêm do registro do `spark`: `prop`, `equals`, `different`,
`not`, `truthy`, `len`, `add`, `subtract`, `inc`, `dec`, `gt`, `gte`, `lt`, `lte`
e `always`. Registre os seus em runtime:

```js
import spark from '@t2e1/kuba/spark'

spark.set('uppercase', (value) => String(value).toUpperCase())
```

!> **Um nome de filtro desconhecido é ignorado em silêncio.** `spark.get` cai na
função identidade em vez de lançar erro, então um erro de digitação — ou um
filtro que não existe — deixa o payload intacto e não dá aviso nenhum. Confira o
nome primeiro quando um arco "funciona mas não faz nada".

?> **Não existe filtro `debounce`, e não pode existir.** Filtros são
transformações síncronas do payload; não conseguem atrasar nem descartar a
chamada ao destino. Para conter um `changed` que dispara a cada tecla, faça isso
dentro do método de destino ou use um listener comum.

## Quando usar cada um

Arcos valem a pena quando a conexão é **estrutural** — este elemento sempre reage
àquele, e quem lê o HTML deveria enxergar isso. É a maior parte da fiação numa
página kuba, e é por isso que o markup é o diagrama de arquitetura.

Prefira um listener quando:

- o payload precisa de lógica real antes do uso (mais que uma cadeia de filtros),
- você precisa aguardar algo, conter a frequência ou tratar um caminho de erro,
- a reação não é uma única chamada de método num único elemento.

Misturar os dois é normal. Um formulário costuma ter arcos para a fiação de
exibição e um listener para o submit de fato.

## Tempo de vida

Cada arco ganha seu próprio `AbortController`. Mudar o atributo `on` desmonta a
assinatura antiga e cria a nova; desconectar o elemento desmonta todas. Você
nunca cancela inscrição manualmente, e um elemento removido não deixa listener
para trás.

## Um exemplo completo

Dois elementos, sem script: digitar no input publica `changed`, o fetch assina e
requisita, depois publica `succeeded`, que o renderizador assina.

```html preview
<kb-input name="breed" placeholder="Tente 'akita'">
  <kb-label>Buscar raças de cachorro</kb-label>
</kb-input>

<kb-render>
  <kb-on value="api/succeeded:method/render"></kb-on>
  <kb-on value="api/failed:method/clear"></kb-on>
  <template>
    <kb-text size="xxs">{name}</kb-text>
  </template>
</kb-render>

<kb-fetch name="api" url="https://api.thedogapi.com/v1/breeds/search?q={}">
  <kb-headers key="x-api-key" value="DEMO-API-KEY"></kb-headers>
  <kb-on value="breed/changed:method/get"></kb-on>
</kb-fetch>
```

Três elementos, três arcos, nenhum import entre eles. Troque o fetch por outra
fonte de dados e nada mais muda — o contrato é o nome do evento.

## Depois

- **[Decorators](/pt-br/build-elements/decorators)** — `@on` para escutar dentro do seu
  próprio componente, e os decorators de middleware.
- **[Receitas › Busca enquanto digita](/pt-br/build-ui/patterns/search-as-you-type)** — o
  exemplo acima, construído passo a passo com estados de erro e vazio.
