# Cover

Uma única imagem recortada, restrita a uma proporção fixa, construída a partir
de um par `src`/`alt`. Uma primitiva de exibição, não um contêiner: ela não tem
`<slot>`, então nada compõe dentro dela, e ela não carrega comportamento de
clique próprio.

```html preview
<kb-cover
  src="https://picsum.photos/id/1025/640/360"
  alt="Um pug enrolado num cobertor"
></kb-cover>
```

## Uso

```html
<kb-cover src="/banner.jpg" alt="Time no encontro de 2026"></kb-cover>
```

## Quando usar

- **Uma imagem recortada de proporção fixa** — um banner, um hero, uma
  miniatura — onde o layout precisa de uma proporção previsível
  independentemente das dimensões da imagem de origem.
- **A área de imagem de um card**, tipicamente envolvida em
  `<kb-inset side="top">` para um visual de ponta a ponta.

## Quando não usar

- **Conteúdo que não é puramente uma imagem.** Não há `<slot>`; use `<kb-card>`
  ou markup comum para qualquer coisa que misture imagem com texto ou ações.
- **Direção de arte responsiva** — múltiplas fontes por viewport, carregamento
  preguiçoso nativo. Este aceita um único `src`; use um `<img>` ou `<picture>`
  comum quando precisar de `srcset`, `sizes` ou `loading`.

## Composição

- **Pode conter**: nada. O elemento renderiza um `<img>` interno a partir de
  `src` e `alt`; qualquer coisa colocada entre as tags é ignorada.
- **Pode ser filho de**: qualquer coisa. Costuma ficar aninhado dentro de um
  `<kb-inset>` dentro de um `<kb-card>`.

```html preview
<kb-card>
  <kb-inset side="top">
    <kb-cover
      src="https://picsum.photos/id/1062/640/360"
      alt="Um golden retriever num campo"
    ></kb-cover>
  </kb-inset>
  <kb-text size="xs" weight="bold">Golden Retriever</kb-text>
  <kb-text size="xxxs" color="master">Inteligente, amigável, dedicado</kb-text>
</kb-card>
```

## Orientação

O `orientation` define a proporção para a qual a imagem é recortada, via
`object-fit: cover` no `<img>` interno. Ele não toca no `src`, então a mesma
imagem funciona em qualquer uma das proporções.

```html preview
<kb-cover
  src="https://picsum.photos/id/1025/640/360"
  alt="Recorte em paisagem"
  orientation="landscape"
></kb-cover>
<kb-cover
  src="https://picsum.photos/id/1025/640/360"
  alt="Recorte em retrato da mesma imagem"
  orientation="portrait"
></kb-cover>
```

| Orientação | Proporção | Use para |
|---|---|---|
| `landscape` (padrão) | 16/9 | Banners largos, heros, miniaturas num layout horizontal. |
| `portrait` | 4/5 | Imagens altas — fotos em retrato, cards mobile-first, miniaturas verticais. |

## Conteúdo

O `alt` deve descrever a imagem para quem não consegue vê-la. Deixe vazio
(`alt=""`) apenas quando a imagem é decorativa e o texto ao redor já transmite a
mesma informação — nunca omita, e nunca repita uma legenda visível ao pé da
letra.

## Atributos

| Atributo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `src` | `string` | `''` | URL da imagem, repassada ao `<img>` interno. |
| `alt` | `string` | `''` | Texto alternativo, repassado ao `<img>` interno. |
| `orientation` | `landscape` \| `portrait` | `landscape` | Proporção para a qual a imagem é recortada. |
| `on` | string de arco | — | Ligação do Echo, `origem/evento:tipo/destino`. |

Este elemento não dispara eventos.

## Estilo

| Custom property | Padrão | Controla |
|---|---|---|
| `--cover-aspect-ratio-landscape` | `16/9` | Proporção quando `orientation="landscape"`. |
| `--cover-aspect-ratio-portrait` | `4/5` | Proporção quando `orientation="portrait"`. |
| `--cover-color-background` | `var(--color-pure-white)` | Fundo visível enquanto a imagem carrega, ou se ela falhar. |
| `--cover-border-radius` | `var(--border-radius-md)` | Raio dos cantos do host e da imagem recortada. |

```html preview
<div style="--cover-aspect-ratio-landscape: 1/1; --cover-border-radius: 8px;">
  <kb-cover
    src="https://picsum.photos/id/1074/400/400"
    alt="Uma miniatura quase quadrada"
  ></kb-cover>
</div>
```

## Estados e acessibilidade

- `kb-cover` não tem atributo `hidden` nem custom states — ele não usa o mixin
  `Hidden`, então remova ou envolva o elemento quando ele deve sumir do layout.
- O `<img>` interno mantém o papel nativo. Um `alt` ausente ou vazio numa imagem
  com significado a torna invisível para leitores de tela.
- O elemento não tem comportamento de clique. Envolva num `<kb-card>` ou num
  `<a>` quando a imagem precisar ser acionável.

## Certo e errado

| Faça | Não faça |
|---|---|
| Escrever um `alt` de verdade descrevendo a imagem | Deixar o `alt` vazio para uma imagem que carrega significado |
| Escolher a `orientation` pela proporção do layout | Supor que um dado `src` combina com ela — o `object-fit: cover` recorta de qualquer forma |
| Envolver num `<kb-card>` ou `<a>` quando precisa ser clicável | Esperar que o `kb-cover` dispare um evento de clique |
| Sobrescrever os tokens `--cover-*` para re-skin | Alcançar dentro do shadow DOM para mudar fundo ou raio |
