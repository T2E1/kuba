# Footer

A barra de fechamento de uma página: uma faixa que preenche a largura que
recebe e fixa um grupo de conteúdo no início de uma linha centralizada
(`leading`) e outro no fim dela (`trailing`). É um landmark de nível de página,
não um contêiner genérico — sem atributos, sem eventos, e sem slot padrão, então
qualquer coisa não atribuída a `leading` ou `trailing` é descartada.

```html preview
<kb-footer>
  <kb-text slot="leading" size="xxxs">© 2026 Memoize</kb-text>
  <kb-text slot="trailing" size="xxxs">Política de Privacidade</kb-text>
</kb-footer>
```

## Uso

```html
<kb-footer>
  <kb-text slot="leading" size="xxxs">© 2026 Sua Empresa</kb-text>
  <kb-text slot="trailing" size="xxxs">Termos</kb-text>
</kb-footer>
```

## Quando usar

- **Fechando uma página** com o conteúdo legal ou secundário que pertence ao
  rodapé — linha de copyright, links de privacidade e termos, seletor de idioma.
- **Pareando com o `<kb-header>`** para que uma página abra e feche com a mesma
  coluna centralizada de 1024px e a mesma altura de barra de 72px.

## Quando não usar

- **A barra do topo da página** — use o `<kb-header>`, a mesma primitiva de
  linha centralizada, que dispõe suas regiões como linhas flex e é o landmark
  correspondente daquela ponta.
- **Um rodapé dentro de um card, diálogo ou seção.** Este renderiza um `<footer>`
  nativo e expõe um landmark `contentinfo`, que pertence à página — use um
  `<kb-stack>` para a linha de ações no fim de uma superfície contida.
- **Agrupar conteúdo arbitrário em duas colunas** — use `<kb-stack>` ou um
  `<kb-card direction="row">`. Este fixa a altura e a largura máxima.

## Composição

- **Pode conter**: qualquer coisa que carregue `slot="leading"` ou
  `slot="trailing"`. O elemento renderiza apenas esses dois slots nomeados e
  nenhum slot padrão, então filhos sem slot nunca aparecem. O conteúdo típico é
  `<kb-text>` para a linha de copyright e `<kb-button variant="link">` ou `<a>`
  para links secundários.
- **Pode ser filho de**: qualquer coisa. A barra preenche 100% da largura que
  recebe e só limita a linha interna, então ela se adapta a um contêiner mais
  estreito em vez de transbordar. Semanticamente, ela ainda pertence à raiz da
  página.

O wrapper de cada slot é um elemento simples e sem estilo — diferente do
`<kb-header>`, ele não dispõe os filhos como linha flex. Dois elementos
encaixados na mesma região fluem inline sem espaçamento, então envolva-os num
`<kb-stack direction="row">` quando precisar de espaço entre eles.

```html preview
<kb-footer>
  <kb-text slot="leading" size="xxxs">© 2026 Memoize</kb-text>
  <kb-stack slot="trailing" direction="row" spacing="nano">
    <kb-button variant="link">Privacidade</kb-button>
    <kb-button variant="link">Termos</kb-button>
  </kb-stack>
</kb-footer>
```

## Conteúdo

O `leading` tem conteúdo de fallback embutido — uma linha de copyright — que
aparece sempre que nada é encaixado nele.

```html preview
<kb-footer>
  <kb-text slot="trailing" size="xxxs">Só o trailing está preenchido</kb-text>
</kb-footer>
```

!> Trate o fallback como um placeholder, não como um padrão para publicar: ele
fixa um ano, um nome de empresa e um texto em português. Qualquer página real
deve encaixar a própria linha. O `trailing` não tem fallback e fica vazio até ser
preenchido.

Mantenha os dois lados curtos — a barra tem 72px fixos de altura e não cresce,
então conteúdo que quebra linha vai transbordar em vez de aumentá-la.

## Atributos

| Atributo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `alt` | `string` | `''` | Nome acessível do landmark, para páginas que carregam mais de um. |

Ele não dispara eventos; o resto da superfície é o par de slots nomeados.

## Estilo

| Custom property | Padrão | Controla |
|---|---|---|
| `--footer-size-height` | `72px` | Altura da barra, tanto no host quanto na linha centralizada interna. |
| `--footer-size-max-width` | `1024px` | Limite da linha de conteúdo centralizada; abaixo disso, a linha acompanha a largura da barra. |
| `--footer-space-inset` | `var(--spacing_inset-xs)` | Padding interno da linha centralizada. |

O `kb-footer` não pinta fundo próprio, então o fundo da página aparece através —
defina `background-color` diretamente quando a barra precisar se ler como uma
superfície separada:

```html preview
<div style="--footer-size-height: 96px;">
  <kb-footer style="background-color: var(--color-master-lighter)">
    <kb-text slot="leading" size="xxxs">Uma barra mais alta e tingida</kb-text>
    <kb-text slot="trailing" size="xxxs">Contato</kb-text>
  </kb-footer>
</div>
```

## Estados e acessibilidade

- `kb-footer` não tem atributo `hidden` nem custom states — remova o próprio
  elemento quando a barra não deve estar no layout.
- O host carrega o landmark `contentinfo`, publicado via `ElementInternals`. O
  wrapper do shadow é deliberadamente sem semântica: um `<footer>` ali também
  mapearia para `contentinfo`, deixando dois landmarks aninhados.
- Use um único `kb-footer` por página; um segundo divide esse landmark e torna o
  "pular para o rodapé da página" ambíguo.
- O elemento não adiciona gerenciamento de foco, então links e botões encaixados
  mantêm a ordem de foco nativa — mantenha-os na ordem de leitura que você quer,
  `leading` primeiro.

## Certo e errado

| Faça | Não faça |
|---|---|
| Encaixar sua própria linha de copyright no `leading` | Publicar o fallback embutido, que fixa um ano, um nome e um idioma |
| Manter um único `kb-footer`, na raiz da página | Reutilizá-lo como barra inferior de um card ou diálogo |
| Envolver múltiplos links num `<kb-stack direction="row">` | Encaixar vários elementos lado a lado esperando que a região os espace |
| Manter os dois lados em uma única linha curta | Encher a barra com conteúdo que quebra — a altura de 72px é fixa |
