# Button

Um botão dispara uma ação síncrona que pertence à página em que ele está —
submissão de formulário, reset de formulário, ou um evento `clicked` que outros
elementos assinam. Ele nunca muda a URL. Se o desfecho é um novo endereço, ligue
um `<kb-redirect>` ao evento `clicked` do botão em vez de colocar essa lógica no
botão.

```html preview
<kb-button>Salvar</kb-button>
<kb-button variant="naked">Cancelar</kb-button>
<kb-button variant="link">Saiba mais</kb-button>
<kb-button color="danger">Excluir</kb-button>
```

## Uso

```html
<kb-button type="submit" color="primary">Salvar</kb-button>
```

```js
document.querySelector('kb-button').addEventListener('clicked', (event) => {
  console.log(event.detail) // o `value` do botão
})
```

## Quando usar

- Submeter ou resetar um `<form>` (`type="submit"` / `type="reset"`).
- Disparar uma ação local à página — abrir um diálogo, adicionar uma linha,
  excluir um registro — onde a resposta é um evento `clicked`, e não uma mudança
  de URL.

## Quando não usar

- **Navegar para outra rota ou URL.** Use um `<a>` comum para navegação externa
  ou de página inteira, ou um `<kb-redirect>` ligado ao evento `clicked` de um
  botão para navegação interna. O `kb-button` não tem conceito de destino.

## Variantes

`variant` expressa ênfase, não decoração — escolha pela importância da ação em
relação às irmãs, não por gosto.

```html preview
<kb-button variant="solid">Solid</kb-button>
<kb-button variant="naked">Naked</kb-button>
<kb-button variant="ghost">Ghost</kb-button>
<kb-button variant="link">Link</kb-button>
<kb-button variant="icon"><kb-icon use="home"></kb-icon></kb-button>
```

| Variante | Ênfase | Use para |
|---|---|---|
| `solid` (padrão) | Máxima | A única ação primária de uma área. Mais de uma por área e nenhuma se lê como primária. |
| `naked` | Média | Uma ação secundária ao lado de uma `solid` — "Cancelar" ao lado de "Salvar". |
| `ghost` | Média-baixa | Uma ação dentro de uma superfície preenchida, onde um botão com borda competiria com ela. |
| `link` | Mínima | Uma ação que se lê como link de texto — inline na prosa ou numa célula de tabela. |
| `icon` | Compacta | Só ícone, onde o espaço é restrito. Sempre dê a ele um nome acessível. |

## Cor

`color` carrega significado; não é um botão de ajuste visual.

```html preview
<kb-button color="primary">Primary</kb-button>
<kb-button color="danger">Excluir</kb-button>
<kb-button color="success">Confirmar</kb-button>
<kb-button color="warning">Revisar</kb-button>
```

- `primary` — o padrão, para ações comuns.
- `danger` — reservado para ações destrutivas ou difíceis de desfazer. Não para
  ênfase.
- `master`, `complete`, `success`, `warning`, `info`, `menu` — apenas quando o
  desfecho realmente combina com aquela semântica.

## Largura

`width` controla como o botão preenche o contêiner, não o peso visual dele.

```html preview
<div style="width: 100%">
  <kb-button width="fill">Continuar</kb-button>
</div>
```

- `auto` (padrão) — abraça o rótulo; use inline, ao lado de outro conteúdo.
- `fill` — atravessa o contêiner; para uma única ação de largura total.
- `hug` — sinônimo explícito de `auto`.
- Um valor em `px`/`%` — apenas quando uma especificação exige. Uma largura fixa
  não se adapta a um rótulo traduzido.

## Composição

- **Pode conter**: texto puro (o rótulo), `<kb-icon>` para botões só de ícone ou
  ícone+rótulo, e um ou mais `<kb-on>` para arcos além do único atributo `on`.
  Qualquer outra coisa ainda renderiza, mas o conteúdo encaixado recebe
  `pointer-events: none`, então não consegue interceptar o clique destinado ao
  botão.
- **Pode ser filho de**: qualquer coisa. Comumente dentro de um `<kb-form>` como
  o controle de submissão, dentro de um `<kb-card>`, ou sozinho.

```html preview
<kb-button>
  <kb-icon use="download"></kb-icon>
  Baixar
</kb-button>
```

## Conteúdo

O rótulo deve ser uma frase verbal curta e específica — "Salvar", "Excluir
arquivo", "Adicionar linha" — e não um "OK" ou "Enviar" vago. Rótulos longos
quebram linha em vez de truncar; o botão não corta o texto.

## Atributos

| Atributo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `color` | `string` | `primary` | Cor semântica, resolvida contra `--color-{valor}`. |
| `variant` | `solid` \| `naked` \| `ghost` \| `link` \| `icon` | `solid` | Nível de ênfase. |
| `width` | `auto` \| `fill` \| `hug` \| comprimento | `auto` | Como o botão preenche o contêiner. |
| `type` | `submit` \| `reset` | `submit` | Comportamento dentro do `<form>` dono. |
| `value` | `string` | — | Payload enviado como `detail` do evento `clicked`. |
| `hidden` | `boolean` | `false` | Remove o botão do layout e da árvore de acessibilidade. |
| `on` | string de arco | — | Ligação do Echo, `origem/evento:tipo/destino`. |

## Eventos

| Evento | Dispara quando | `detail` |
|---|---|---|
| `clicked` | o botão é acionado | o atributo `value` |

## Estilo

Toda decisão visual é uma custom property `--button-*` com padrão em um token
global. Custom properties herdam através da fronteira do shadow, então defina no
elemento ou em qualquer ancestral — nunca alcance dentro do shadow DOM.

| Custom property | Padrão | Controla |
|---|---|---|
| `--button-color-accent` | `var(--color-{color})` | Destaque que preenche o `solid` e colore texto/borda dos demais. |
| `--button-color-text` | `var(--color-pure-white)` | Cor do rótulo no `solid`. |
| `--button-color-background-ghost` | `var(--color-master-lighter)` | Fundo do `ghost`. |
| `--button-font-family` | `var(--font-family-base)` | Família tipográfica do rótulo. |
| `--button-font-size` | `var(--font-size-xxs)` | Tamanho do rótulo. |
| `--button-font-weight` | `var(--font-weight-medium)` | Peso do rótulo. |
| `--button-line-height` | `var(--line-height-default)` | Entrelinha do rótulo. |
| `--button-letter-spacing` | `0.38px` | Espaçamento entre letras do rótulo. |
| `--button-size-height` | `40px` | Altura, e o lado do quadrado do `icon`. |
| `--button-size-min-width` | `40px` | Largura mínima, para rótulos curtos continuarem tocáveis. |
| `--button-space-inline` | `var(--spacing_inset-xs)` | Padding horizontal. |
| `--button-space-gap` | `var(--spacing_inset-nano)` | Espaçamento entre rótulo e ícone encaixado. |
| `--button-border-width` | `var(--border-width-thin)` | Espessura da borda. |
| `--button-border-radius` | `var(--border-radius-sm)` | Raio dos cantos. |
| `--button-transition` | `all 0.2s ease-out` | Transição na interação. |

```html preview
<div class="checkout" style="--button-size-height: 56px; --button-border-radius: 500px; --button-font-size: 16px;">
  <kb-button>Finalizar compra</kb-button>
</div>
```

## Estados e acessibilidade

- `hidden` remove o botão do layout e da interação. Prefira isso a não renderizar
  o elemento quando a presença ou ausência deve continuar rastreável no DOM.
- Um botão `icon` sem texto precisa de um nome acessível vindo do contexto —
  coloque `aria-label` no próprio `kb-button`. O glifo não comunica nada para a
  tecnologia assistiva.
- `type="submit"` só faz algo dentro de um `<form>`. Sozinho, ele não faz nada
  no clique, em silêncio.

## Certo e errado

| Faça | Não faça |
|---|---|
| Usar exatamente um botão `solid` por área para a ação primária | Colocar dois botões `solid` lado a lado — nenhum se lê como primário |
| Reservar `color="danger"` para ações destrutivas | Usar `danger` só para o botão se destacar |
| Dar um nome acessível a um botão só de ícone | Publicar um botão só de ícone sem rótulo para a tecnologia assistiva |
| Usar `width="fill"` para a ação única de um formulário estreito | Fixar `width` em px para um rótulo que pode crescer ao ser traduzido |
