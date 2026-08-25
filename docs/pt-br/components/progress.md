# Progress

Mostra o quanto uma tarefa avançou, como uma fração preenchida de uma trilha
horizontal. É determinado apenas: `value` é uma porcentagem que você define,
então a barra não consegue expressar "trabalhando, duração desconhecida" — ela
simplesmente ficaria parada no número que recebeu.

```html preview
<div style="width: 100%">
  <kb-progress value="60"></kb-progress>
</div>
```

## Uso

```html
<kb-progress value="60" alt="Enviando"></kb-progress>
```

## Quando usar

- **Uma tarefa com fração concluída conhecida** — um upload, um formulário de
  várias etapas, um job em lote reportando itens processados.
- **Uma quantidade contra um teto** — armazenamento usado, cota consumida, força
  da senha — onde a barra se lê como um medidor, e não como um cronômetro.

## Quando não usar

- **Trabalho de duração desconhecida.** Um spinner ou skeleton é o sinal
  honesto; uma barra congelada num valor se lê como travada.
- **Um valor que a pessoa pode mudar.** Isto é saída, não entrada — uma barra
  que a pessoa arrasta é um slider (`<input type="range">`).
- **Um contador de etapas que as pessoas navegam.** Um stepper rotulado comunica
  "etapa 2 de 5" melhor, e continua operável.

## Composição

- **Pode conter**: nenhum filho relevante. O shadow root renderiza um único
  `<div>` indicador e não declara slot. Um rótulo pertence ao lado da barra, não
  dentro dela. A única exceção é um ou mais `<kb-on>` como filhos, para arcos
  extras além do atributo único `on` — eles se ligam diretamente à barra, sem
  serem encaixados em slot nem renderizados.
- **Pode ser filho de**: qualquer coisa. O host é `display: block` com 100% de
  largura, então ele assume a largura do contêiner.

```html preview
<kb-stack direction="column" spacing="quarck" align="stretch" style="width: 100%">
  <kb-stack direction="row" justify="space-between">
    <kb-text size="xxxs">Enviando</kb-text>
    <kb-text size="xxxs" color="master">45%</kb-text>
  </kb-stack>
  <kb-progress value="45"></kb-progress>
</kb-stack>
```

## A escala do valor

`value` é um número puro interpolado direto numa largura CSS em `%` — sem
limitação, sem `min`/`max`. Três consequências que vale conhecer:

- **Passe `0`–`100`.** Acima de `100` o indicador fica simplesmente mais largo
  que a trilha; o `overflow: hidden` impede que ele pinte para fora, então um
  excesso fica idêntico a `100` e esconde o bug.
- **Um valor negativo** produz uma largura inválida e o indicador some por
  completo — a mesma imagem de `0`. **Um valor não numérico é rejeitado**:
  `value` mantém seu último ajuste válido em vez de assumir a string crua.
  Um valor com prefixo numérico seguido de outro texto (`"50; } :host
  {…"`) mantém só o número interpretado — nunca o texto final, o que é o
  que mantém este atributo seguro contra injeção.
- **Calcule a porcentagem antes de definir**: `value="${(feito / total) *
  100}"`. O elemento não faz aritmética nenhuma por conta própria.

Não há transição na largura, então cada atualização pinta imediatamente — uma
barra guiada por atualizações frequentes anima como uma série de degraus. Isso é
deliberado: o indicador vive no shadow DOM sem `::part()` exposto, então uma
curva de easing não pode ser anexada de fora. Atualize numa cadência que se leia
bem, e não a cada byte.

## Atributos

| Atributo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `value` | `string` | `'0'` | Porcentagem de preenchimento, `0`–`100`. Aplicada diretamente como largura CSS em `%`. |
| `alt` | `string` | `''` | Nome acessível dizendo o que está progredindo. |
| `on` | string de arco | — | Ligação do Echo, `origem/evento:tipo/destino`. |

Este elemento não dispara eventos.

## Estilo

Não existe `::part()` neste elemento, então estas propriedades são toda a
superfície de extensão.

| Custom property | Padrão | Controla |
|---|---|---|
| `--progress-color-track` | `var(--color-pure-white)` | Fundo da parte não preenchida. |
| `--progress-color-indicator` | `var(--color-primary)` | Cor de preenchimento da parte concluída. |
| `--progress-size-height` | `6px` | Espessura da barra. |
| `--progress-border-radius` | `var(--border-radius-pill)` | Arredondamento dos cantos, trilha e indicador juntos. |

Use a cor do indicador de forma semântica, não decorativa — `success` para um
job concluído, `warning` para uma cota perto do limite, `danger` para uma que
passou.

```html preview
<div
  style="width: 100%; --progress-color-indicator: var(--color-warning); --progress-color-track: var(--color-master-lighter); --progress-size-height: 12px; --progress-border-radius: 8px;"
>
  <kb-progress value="88"></kb-progress>
</div>
```

## Estados e acessibilidade

- `kb-progress` não tem atributo `hidden` nem custom states — remova o elemento
  quando não houver nada a reportar.
- **O host carrega `role="progressbar"`**, publicado via `ElementInternals`,
  com `value` espelhado em `aria-valuenow` a cada mudança. A escala é fixa em
  `aria-valuemin="0"` / `aria-valuemax="100"`, porque `value` é aplicado direto
  no CSS como `%`.
- **Dê um `alt` a ele.** O papel e o número são anunciados, mas nada diz *o quê*
  está progredindo — `<kb-progress value="40" alt="Envio">` diz.
- A trilha usa `--color-pure-white` por padrão, que desaparece numa superfície
  branca. Numa página clara, defina `--progress-color-track` como um neutro para
  que a parte não preenchida continue visível.
- Nunca dependa só do preenchimento para comunicar uma mudança de estado —
  acompanhe uma barra `danger` ou `warning` com texto, já que a cor é a única
  diferença.

## Certo e errado

| Faça | Não faça |
|---|---|
| Limitar a porcentagem antes de definir o `value` | Passar uma razão crua (`0.6`) ou uma contagem sem limite |
| Dar um `alt` dizendo o que está progredindo | Publicar o elemento pelado supondo que o preenchimento é anunciado |
| Dar à trilha uma cor visível em superfícies claras | Deixar o padrão branco numa página branca |
| Usar um spinner para trabalho de duração desconhecida | Estacionar a barra num valor arbitrário para sinalizar "carregando" |
