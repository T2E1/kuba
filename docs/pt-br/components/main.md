# Main

O corpo de uma página: uma coluna centralizada, limitada a uma largura legível,
com padding, com um espaçamento consistente entre os filhos, e alta o bastante
para empurrar o rodapé para o fim de páginas curtas. A terceira peça da moldura
da página — `<kb-header>` em cima, `kb-main` no meio, `<kb-footer>` embaixo.

```html preview
<kb-main>
  <kb-text size="lg" weight="bold">Título da página</kb-text>
  <kb-text size="xs">Filhos diretos empilham na vertical com o espaçamento embutido.</kb-text>
  <kb-card>
    <kb-text size="xxs">Nenhum wrapper extra é necessário.</kb-text>
  </kb-card>
</kb-main>
```

## Uso

```html
<kb-main role="main">
  <h1>Título da página</h1>
  <p>Conteúdo da página.</p>
</kb-main>
```

## Quando usar

- **A região de conteúdo de uma página**, uma vez por página, entre o cabeçalho
  e o rodapé.
- **Qualquer tela que deva continuar legível num monitor largo** — o limite de
  largura mantém o comprimento da linha na faixa certa sem um wrapper seu.
- **Páginas cujo conteúdo é curto** — a altura mínima mantém o rodapé no fim da
  viewport em vez de flutuar no meio da tela.

## Quando não usar

- **Uma seção dentro da página.** Esta é a região `main` da página e só existe
  uma por página. Agrupe uma seção com `<kb-stack>` ou `<kb-card>`.
- **Um layout de sangria total.** A coluna é limitada e centralizada por
  decisão de projeto. Conteúdo que precise atravessar a viewport fica fora dela,
  ou escapa do padding com `<kb-inset>`.
- **Um layout de duas colunas.** Esta é uma única coluna flex; aninhe um
  `<kb-stack direction="row">` dentro dela para regiões lado a lado.

## Composição

- **Pode conter**: qualquer coisa — o shadow root é um único `<slot>` sem nome.
  Os filhos empilham na vertical com o espaçamento entre eles, então a maioria
  das páginas não precisa de wrapper extra: seções, cards e títulos podem ser
  filhos diretos.
- **Pode ser filho de**: a raiz da página, tipicamente o `<body>`. Ele se
  centraliza sozinho e ocupa 100% da largura disponível até o seu limite.

## A moldura da página

A altura mínima padrão é `calc(100svh - 144px)`, onde 144px são os 72px do
`<kb-header>` mais os 72px do `<kb-footer>`. É isso que faz uma página quase
vazia ainda preencher a viewport, com o rodapé descansando no fim em vez de
subir para o meio.

Mude qualquer uma das três alturas e elas precisam mudar juntas — um cabeçalho
mais alto com o deslocamento padrão deixa a página rolando exatamente pela
diferença:

```css
:root {
  --header-size-height: 96px;
  --footer-size-height: 96px;
}

kb-main {
  --main-size-offset: 192px; /* 96 + 96 */
}
```

Páginas sem cabeçalho ou rodapé devem reduzir o deslocamento para `0px`, não
manter o padrão.

## Atributos

Este elemento não tem atributos e não dispara eventos.

## Estilo

| Custom property | Padrão | Controla |
|---|---|---|
| `--main-size-max-width` | `480px` | Limite da coluna de conteúdo. |
| `--main-space-inset` | `var(--spacing_inset-xs)` | Padding em volta da coluna. |
| `--main-space-gap` | `var(--spacing_inset-md)` | Espaçamento vertical entre filhos diretos. |
| `--main-size-offset` | `144px` | Altura subtraída da viewport para a altura mínima — o cabeçalho mais o rodapé. |

O padrão de 480px é uma medida de coluna única, mobile-first. Uma aplicação
densa de desktop combinando `kb-main` com `<kb-header>` normalmente quer que a
coluna acompanhe a própria faixa de 1024px do cabeçalho:

```html preview
<div style="--main-size-max-width: 720px; --main-space-gap: 16px; --main-size-offset: 0px;">
  <kb-main>
    <kb-text size="xs">Uma coluna mais larga, com espaçamento mais justo.</kb-text>
    <kb-text size="xs">Deslocamento zerado, já que não há cabeçalho nem rodapé aqui.</kb-text>
  </kb-main>
</div>
```

## Estados e acessibilidade

- `kb-main` não tem atributo `hidden` nem custom states.
- **O elemento não renderiza um `<main>` nativo** — o shadow root dele é só um
  slot, então ele não expõe um landmark `main` por conta própria. Adicione o
  papel no host (`<kb-main role="main">`) ou envolva o conteúdo da página num
  `<main>` de verdade, para que o "pular para o conteúdo" funcione.
- Mantenha um por página. Duas regiões de conteúdo tornam o landmark ambíguo, do
  mesmo jeito que dois `<kb-header>` tornariam.
- O limite de largura é o que mantém o comprimento da linha legível;
  sobrescrevê-lo muito além de ~75 caracteres de texto troca legibilidade por
  densidade.

## Certo e errado

| Faça | Não faça |
|---|---|
| Usar exatamente um `kb-main` por página | Aninhar um dentro do outro, ou reutilizá-lo por seção |
| Manter o `--main-size-offset` em sincronia com as alturas das barras | Mudar as barras e deixar o deslocamento em 144px |
| Deixar os filhos diretos herdarem o espaçamento embutido | Adicionar margens nos filhos para recriar o espaçamento que a coluna já dá |
| Adicionar `role="main"` (ou envolver num `<main>`) para o landmark | Supor que o nome do elemento sozinho comunica o landmark |
