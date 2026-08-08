# Text

O elemento tipográfico de uso geral: tamanho, peso, cor, família, entrelinha e
alinhamento são todos atributos mapeados para design tokens. Ele não carrega
semântica de documento — não é um título, um parágrafo nem uma lista, mesmo
quando estilizado como um.

```html preview
<kb-stack direction="column" spacing="nano" align="start">
  <kb-text size="lg" weight="bold">Resumo mensal</kb-text>
  <kb-text size="xs">Tudo que aconteceu na sua conta neste mês.</kb-text>
  <kb-text size="xxxs" color="master">Atualizado há 2 minutos</kb-text>
</kb-stack>
```

## Uso

```html
<kb-text size="xs" color="master-dark" weight="regular">Olá mundo</kb-text>
```

## Quando usar

- **Texto corrido e texto inline** em qualquer lugar, quando ele deve seguir a
  escala tipográfica em vez dos padrões do navegador.
- **Um título visual dentro de um componente** — um título de card, um título de
  seção — onde tamanho e peso importam e o outline do documento não.
- **Texto que muda por token** — uma legenda apagada, um total em negrito — sem
  escrever CSS por instância.

## Quando não usar

- **Um título de documento.** A navegação por títulos de um leitor de tela
  precisa de um `<h1>`–`<h6>` de verdade. Use um e estilize, ou aninhe um
  `kb-text` dentro dele.
- **Um rótulo ou dica de campo** — `<kb-label>` e `<kb-helper>` existem para que
  o vocabulário de formulário continue uniforme e se auto-encaixe.
- **Prosa longa com múltiplos parágrafos** — isto renderiza uma caixa inline sem
  espaçamento entre parágrafos; use elementos `<p>` de verdade dentro de um
  `<kb-stack>`.

## Composição

- **Pode conter**: texto e markup inline — o shadow root é um único `<slot>` sem
  nome. `<a>`, `<strong>` ou um `<kb-icon>` aninhados herdam a cor e o tamanho
  definidos aqui.
- **Pode ser filho de**: qualquer coisa. O host não tem `display` próprio, então
  se comporta como conteúdo inline e participa de qualquer contexto flex ou grid
  ao redor.

```html preview
<kb-text size="xs">
  Leia o <a href="#/pt-br/learn/quick-start">início rápido</a> para ver funcionando.
</kb-text>
```

## Tamanho

`size` percorre os degraus da escala tipográfica compartilhada. Escolha pelo
papel, não por quão grande parece em um layout.

```html preview
<kb-stack direction="column" spacing="quarck" align="start">
  <kb-text size="xxxs">xxxs — legendas, metadados</kb-text>
  <kb-text size="xxs">xxs — o padrão</kb-text>
  <kb-text size="xs">xs — texto corrido</kb-text>
  <kb-text size="md">md — títulos de componente</kb-text>
  <kb-text size="xl">xl — títulos de página</kb-text>
</kb-stack>
```

| `size` | Renderiza em | Use para |
|---|---|---|
| `xxxs` / `xxs` | 12 / 14px | Legendas, metadados, células densas. `xxs` é o padrão. |
| `xs` / `sm` | 16 / 20px | Texto corrido e parágrafos de abertura. |
| `md` / `lg` | 24 / 32px | Títulos de componente e de seção. |
| `xl`–`xxxl` | 40–64px | Títulos de página. |
| `display` / `giant` | 80 / 96px | Apenas chamadas de marketing — esses quebram telas pequenas. |

`weight` tem três degraus (`regular`, `medium`, `bold`) e `line-height` vai de
`default` (100%) até `xxl` (200%). Entrelinhas mais justas combinam com
tipografia grande de display; texto corrido pede `lg` ou `xl`.

## Cor

`color` aceita qualquer sufixo de `--color-*`. Use as famílias semânticas para
significado, e a rampa neutra `master-*` para hierarquia.

```html preview
<kb-stack direction="column" spacing="quarck" align="start">
  <kb-text color="master-dark">master-dark — texto corrido</kb-text>
  <kb-text color="master">master — secundário</kb-text>
  <kb-text color="primary">primary — ênfase da marca</kb-text>
  <kb-text color="success">success — desfecho positivo</kb-text>
  <kb-text color="danger">danger — erro ou destrutivo</kb-text>
</kb-stack>
```

Uma palavra-chave desconhecida resolve para uma custom property indefinida e o
texto cai para a cor herdada em vez de falhar de forma visível — confira o nome
do token se uma cor "não aplica".

## Atributos

| Atributo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `size` | degrau de token | `xxs` | Tamanho da tipografia, resolvido contra `--font-size-{valor}`. |
| `weight` | `regular` \| `medium` \| `bold` | `regular` | Resolvido contra `--font-weight-{valor}`. |
| `color` | sufixo de token | `master-dark` | Resolvido contra `--color-{valor}`. |
| `family` | `base` \| `highlight` | `base` | Resolvido contra `--font-family-{valor}`. |
| `line-height` | degrau de token | `lg` | Resolvido contra `--line-height-{valor}`. |
| `align` | `left` \| `center` \| `right` \| `justify` | `left` | Alinhamento do texto. |

Este elemento não dispara eventos.

## Estilo

Os atributos cobrem os casos por instância. As propriedades `--text-*` existem
para a sobrescrita no nível da superfície — um painel inteiro deslocando a
tipografia — e para valores que a escala não expressa, como o espaçamento entre
letras.

| Custom property | Padrão | Controla |
|---|---|---|
| `--text-color` | `var(--color-{color})` | Cor, sobrescrevendo o atributo. |
| `--text-font-family` | `var(--font-family-{family})` | Família tipográfica. |
| `--text-font-size` | `var(--font-size-{size})` | Tamanho da tipografia. |
| `--text-font-weight` | `var(--font-weight-{weight})` | Peso da tipografia. |
| `--text-line-height` | `var(--line-height-{lineHeight})` | Entrelinha. |
| `--text-letter-spacing` | `0.38px` | Espaçamento entre letras — o único valor sem atributo. |

Prefira o atributo para um elemento; recorra à propriedade quando uma regra deve
valer para muitos:

```css
.panel-dark kb-text {
  --text-color: var(--color-pure-white);
}
```

## Estados e acessibilidade

- O elemento não expõe papel. Estilizá-lo no tamanho `display` não o torna um
  título — pareie com um elemento de heading de verdade, ou com `role="heading"`
  mais `aria-level`, quando ele introduz uma seção.
- Fique de olho no contraste ao descer a rampa `master-*`: `master-light` sobre
  branco é de grau decorativo, não de texto corrido.
- Não deixe a cor ser a única portadora de significado — um total colorido com
  `danger` precisa de palavras que digam o que está errado.
- `align="justify"` produz espaçamento irregular entre palavras em colunas
  estreitas; guarde para medidas largas.

## Certo e errado

| Faça | Não faça |
|---|---|
| Escolher o `size` pelo papel do texto | Escolher pelo tamanho que ele aparenta em um layout |
| Envolver ou aninhar um elemento de heading de verdade para estrutura | Usar `size="xxxl"` e chamar de título |
| Usar `<kb-label>` / `<kb-helper>` dentro de campos de formulário | Recriá-los com `kb-text` e atributos por instância |
| Definir `--text-*` num ancestral para deslocar uma superfície inteira | Repetir a mesma sobrescrita de atributo em cada elemento |
