<!-- TODO(058): sincronizar com docs/components/logo.md — a proporção da marca
     mudou de quadrado 1:1 para retrato 60:93 (--logo-size agora é altura, não
     lado); esta tradução ainda descreve "quadrado"/"1:1" em vários pontos. -->

# Logo

A marca como SVG inline, dimensionada num quadrado e colorida a partir de
`currentColor`. É só a marca — sem atributos, sem logotipo escrito, sem
comportamento de link.

```html preview
<kb-logo></kb-logo>
```

## Uso

```html
<kb-logo></kb-logo>
```

## Quando usar

- **Identificando o produto no topo de uma página** — encaixada na região
  `leading` do `<kb-header>`, que é para isso que essa região existe.
- **Ancorando uma tela de entrada** — login, splash, estado vazio, onde a marca
  aparece sozinha acima do conteúdo.
- **Marcando propriedade numa barra de fechamento** — ao lado da linha de
  copyright no `<kb-footer>`.

## Quando não usar

- **Como link para a home, por si só.** O elemento não renderiza âncora
  nenhuma; envolva num `<a href="/">` para a marca virar navegável e focável.
- **Como ícone genérico** — use o `<kb-icon>`, que resolve qualquer glifo do
  Material Symbols pelo nome. Este renderiza um SVG fixo.
- **Para um conjunto com o nome do produto.** Aqui é só o símbolo; coloque um
  `<kb-text>` ao lado dentro de um `<kb-stack>` quando precisar de marca mais
  nome escrito.

## Composição

- **Pode conter**: nenhum filho relevante. O shadow root renderiza um `<svg>`
  fixo e não declara slot, então filhos do light DOM nunca aparecem.
- **Pode ser filho de**: qualquer coisa. É um quadrado de tamanho fixo que nem
  cresce nem encolhe com o contêiner, então compõe de forma previsível dentro de
  uma linha flex.

```html preview
<kb-stack direction="row" align="center" spacing="nano">
  <kb-logo></kb-logo>
  <kb-text size="sm" weight="bold">kuba</kb-text>
</kb-stack>
```

## Atributos

| Atributo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `alt` | `string` | `''` | Nome acessível da marca. Vazio, o logo fica escondido da tecnologia assistiva. |

Ele não dispara eventos; todo o resto nele é controlado via CSS.

## Estilo

| Custom property | Padrão | Controla |
|---|---|---|
| `--logo-color` | `var(--color-primary)` | Cor de preenchimento. O SVG se preenche com `currentColor`, então isso é o `color` do host. |
| `--logo-size` | `40px` | Lado do quadrado; altura e largura andam juntas, mantendo a proporção 1:1. |

Como a marca herda `currentColor`, uma única declaração de `color` num ancestral
a inverte numa superfície escura — o `--logo-color` é para o caso em que a marca
*não* deve acompanhar o texto ao redor.

```html preview
<div style="--logo-size: 64px; --logo-color: var(--color-danger);">
  <kb-logo></kb-logo>
</div>
```

## Estados e acessibilidade

- `kb-logo` não tem atributo `hidden` e não tem custom states.
- **Um logo sem nome se esconde sozinho.** O SVG inline não carrega `<title>`,
  então ele seria um gráfico sem rótulo. Sem `alt`, o elemento define
  `aria-hidden="true"` em si mesmo — o certo sempre que um nome escrito visível
  identifica o produto ao lado.
- **Defina `alt` quando a marca está sozinha**, como único conteúdo de um link
  para a home: `<kb-logo alt="kuba, início">`. Nomear o link também funciona;
  faça um ou outro, não os dois.
- A marca é um único path preenchido, então mantém as proporções em qualquer
  `--logo-size`; ela não precisa de uma variante pequena separada.

## Certo e errado

| Faça | Não faça |
|---|---|
| Envolver a marca num `<a>` quando ela deve levar para a home | Anexar um listener de clique — ela não tem semântica de foco nem de link |
| Deixar herdar `currentColor` em superfícies invertidas | Fixar uma cor que quebra quando a superfície muda |
| Redimensionar com `--logo-size` para o quadrado seguir quadrado | Definir `height` ou `width` direto e esticar a marca |
| Rotular o link que a envolve, ou esconder a marca de leitores de tela | Deixar um gráfico sem rótulo como único conteúdo de um link |
