# Header

A barra de abertura de uma página: uma faixa que fixa um grupo de conteúdo no
início de uma linha centralizada (`leading`) e outro no fim dela (`trailing`),
dispondo cada região como uma linha flex com espaçamento entre os filhos. É um
landmark de nível de página, não uma barra de ferramentas genérica — sem
atributos, sem eventos, e sem slot padrão, então qualquer coisa não atribuída a
`leading` ou `trailing` é descartada.

```html preview
<kb-header>
  <kb-logo slot="leading"></kb-logo>
  <nav slot="trailing">
    <kb-button variant="link">Docs</kb-button>
    <kb-button variant="link">Guias</kb-button>
  </nav>
</kb-header>
```

## Uso

```html
<kb-header>
  <kb-logo slot="leading"></kb-logo>
  <nav slot="trailing">…</nav>
</kb-header>
```

## Quando usar

- **Abrindo uma página** com a identidade e a navegação que pertencem ao topo —
  marca, navegação principal, menu de conta, um ponto de entrada de busca.
- **Pareando com o `<kb-footer>`** para que uma página abra e feche com a mesma
  coluna centralizada de 1024px e a mesma altura de barra de 72px.

## Quando não usar

- **A barra inferior da página** — use o `<kb-footer>`, o landmark
  correspondente daquela ponta. Ele compartilha a geometria de linha
  centralizada, mas deixa as regiões de slot sem estilo em vez de dispô-las como
  linhas flex.
- **Um cabeçalho dentro de um card, diálogo ou seção.** Este renderiza um
  `<header>` nativo em nível de página; uma linha de título dentro de uma
  superfície contida é um
  `<kb-stack direction="row" justify="space-between">`.
- **Uma barra de ações.** As duas regiões ancoram conteúdo em pontas opostas de
  uma barra de altura fixa. Uma linha densa de botões que deveria quebrar ou
  rolar quer um `<kb-stack>`, que cresce com o conteúdo.

## Composição

- **Pode conter**: qualquer coisa que carregue `slot="leading"` ou
  `slot="trailing"`. O elemento renderiza apenas esses dois slots nomeados e
  nenhum slot padrão, então filhos sem slot nunca aparecem. O `leading`
  tipicamente carrega um `<kb-logo>`, opcionalmente seguido do nome do produto;
  o `trailing` carrega um `<nav>`, um `<kb-stack direction="row">` de botões de
  link, ou um avatar.
- **Pode ser filho de**: qualquer coisa, semanticamente a raiz da página.

Diferente do `<kb-footer>`, cada região é ela mesma uma linha flex com
espaçamento, então vários elementos encaixados no mesmo lado ficam espaçados e
centralizados na vertical sem nenhum wrapper extra.

```html preview
<kb-header>
  <kb-stack slot="leading" direction="row" align="center" spacing="nano">
    <kb-logo></kb-logo>
    <kb-text size="xxs" weight="bold">kuba</kb-text>
  </kb-stack>
  <kb-button slot="trailing" variant="icon" alt="Conta">
    <kb-icon use="account_circle"></kb-icon>
  </kb-button>
</kb-header>
```

!> **O wrapper do shadow tem `100svw` de largura** — ele atravessa a viewport
em vez do contêiner. Aninhar um dentro de um elemento mais estreito faz com que
ele transborde esse elemento. O `<kb-footer>` tinha o mesmo comportamento e foi
mudado para preencher o contêiner; este não foi.

## Conteúdo

As duas regiões ficam vazias até serem preenchidas — não há conteúdo de fallback
em nenhum dos slots. Mantenha cada lado em uma linha: a barra tem 72px fixos de
altura e não cresce, então conteúdo que quebra linha transborda em vez de
aumentá-la.

## Atributos

| Atributo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `alt` | `string` | `''` | Nome acessível do landmark, para páginas que carregam mais de um. |

Ele não dispara eventos; o resto da superfície é o par de slots nomeados.

## Estilo

| Custom property | Padrão | Controla |
|---|---|---|
| `--header-size-height` | `72px` | Altura da barra, tanto no host quanto na linha centralizada interna. |
| `--header-size-max-width` | `1024px` | Limite da linha de conteúdo centralizada. |
| `--header-space-inset` | `var(--spacing_inset-xs)` | Padding interno da linha centralizada. |
| `--header-space-gap` | `var(--spacing_inset-xs)` | Espaçamento entre elementos encaixados na mesma região. |

O `kb-header` não pinta fundo próprio, então o fundo da página aparece através —
defina `background-color` diretamente quando a barra precisar se ler como uma
superfície separada:

```html preview
<div style="--header-size-height: 96px; --header-space-gap: 24px;">
  <kb-header style="background-color: var(--color-master-lightest)">
    <kb-logo slot="leading"></kb-logo>
    <kb-text slot="trailing" size="xxs">Uma barra mais alta e tingida</kb-text>
  </kb-header>
</div>
```

## Estados e acessibilidade

- `kb-header` não tem atributo `hidden` nem custom states — remova o próprio
  elemento quando a barra não deve estar no layout.
- O host carrega o landmark `banner`, publicado via `ElementInternals`. O
  wrapper do shadow é deliberadamente sem semântica: um `<header>` ali também
  mapearia para `banner`, deixando dois landmarks aninhados.
- Use um único `kb-header` por página; um segundo divide esse landmark e torna o
  "pular para o cabeçalho da página" ambíguo. Quando a página realmente precisar
  de dois, dê um `alt` a cada um para que sejam distinguíveis.
- Envolva a navegação principal num `<nav>` dentro do slot `trailing` para que
  ela ganhe o próprio landmark `navigation` — o landmark do cabeçalho não
  descreve os links que ele contém.
- O elemento não adiciona gerenciamento de foco, então links e botões encaixados
  mantêm a ordem de foco nativa: `leading` primeiro, acompanhando a ordem de
  leitura.

## Certo e errado

| Faça | Não faça |
|---|---|
| Encaixar a marca no `leading` e a navegação no `trailing` | Deixar filhos sem slot — sem `slot=`, eles nunca renderizam |
| Manter um único `kb-header`, na raiz da página | Reutilizá-lo como barra de título de um card ou diálogo |
| Encaixar vários elementos numa região e deixar o espaçamento embutido separá-los | Adicionar um wrapper para recriar o espaçamento que a região já dá |
| Manter cada lado em uma única linha curta | Encher a barra com conteúdo que quebra — a altura de 72px é fixa |
