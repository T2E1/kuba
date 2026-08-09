# Inset

Cancela o padding de um ancestral nos lados que você nomear, usando margem
negativa, para que o conteúdo dele sangre até as bordas desse ancestral — a
imagem de largura total no topo de um card com padding. É a válvula de escape
para um filho, não um layout para muitos: ele flexiona o conteúdo, corta o
excesso, e arredonda os cantos que ficam para dentro.

```html preview
<kb-card>
  <kb-inset side="top">
    <kb-cover
      src="https://picsum.photos/id/1084/640/360"
      alt="Um cachorro correndo na praia"
    ></kb-cover>
  </kb-inset>
  <kb-text size="xs" weight="bold">De ponta a ponta</kb-text>
  <kb-text size="xxxs" color="master">A imagem toca as bordas do card; este texto não.</kb-text>
</kb-card>
```

## Uso

```html
<kb-inset side="top">
  <img src="/banner.png" alt="" />
</kb-inset>
```

## Quando usar

- **Uma faixa de mídia dentro de uma superfície com padding** — uma imagem de
  capa ou mapa que deve tocar as bordas do card enquanto o texto ao redor
  continua recuado.
- **Um divisor ou faixa tingida que atravessa toda a superfície** — uma quebra
  de seção dentro de um `<kb-card>` que de outra forma pararia antes das duas
  bordas.
- **Uma barra de ações no rodapé de um contêiner com padding** — `side="bottom"`
  mantém os cantos de cima retos contra o conteúdo acima e arredonda os dois que
  encontram a borda do contêiner.

## Quando não usar

- **Espaçar irmãos** — isso é o `<kb-stack>`. Um inset remove espaço; ele não
  distribui espaço.
- **Centralizar o conteúdo da página** — o `<kb-main>` já limita a largura e
  centraliza a coluna.
- **Quando o pai não tem padding.** A margem negativa então puxa o conteúdo para
  *fora* do pai em vez de até a borda dele. A distância da sangria é fixa, não
  medida a partir do pai.
- **Arredondar uma imagem sozinha** — um `border-radius` na imagem é mais
  simples. Recorra a isto apenas quando a sangria é o ponto.

## Composição

- **Pode conter**: qualquer coisa — o shadow root é um único `<slot>` sem nome.
  Mídia é o caso comum, e o `overflow: hidden` significa que uma imagem maior
  que a caixa é cortada pelos cantos arredondados em vez de escapar deles.
- **Pode ser filho de**: um contêiner com padding cujo padding combine com a
  sangria. O `<kb-card>` é o pai pretendido; a sangria padrão (16px) é
  exatamente o inset do próprio card, e é por isso que os dois se alinham sem
  configuração.

O host é ele mesmo um contêiner flex, então `direction` organiza vários filhos
do jeito que o `<kb-stack>` faria — mas mantenha apenas o que pertence à
sangria.

## Qual lado

`side` escolhe quais bordas sangram. O valor também guia o arredondamento dos
cantos, para que os cantos que encontram a borda do pai continuem redondos e os
que encontram o conteúdo fiquem retos.

```html preview
<kb-card>
  <kb-inset side="bottom">
    <kb-cover
      src="https://picsum.photos/id/1069/640/360"
      alt="Sangrando até a borda inferior"
    ></kb-cover>
  </kb-inset>
</kb-card>
```

| `side` | Sangra | Arredonda |
|---|---|---|
| `all` (padrão) | todas as bordas | os quatro cantos |
| `top` | topo, esquerda, direita | os dois cantos de cima |
| `bottom` | base, esquerda, direita | os dois cantos de baixo |
| `left` / `right` | aquela borda mais topo e base | os dois cantos daquela borda |
| `x` | esquerda e direita apenas | nada — a faixa fica aberta dos dois lados |
| `y` | topo e base apenas | nada |

Um valor não reconhecido cai para `all`, então um erro de digitação sangra em
todos os lados em vez de falhar de forma visível.

## Atributos

| Atributo | Tipo | Padrão | Descrição |
|---|---|---|---|
| `side` | `all` \| `top` \| `bottom` \| `left` \| `right` \| `x` \| `y` | `all` | Quais bordas recebem a margem negativa, e quais cantos continuam arredondados. |
| `direction` | `row` \| `column` | `column` | Direção flex do conteúdo encaixado. |
| `width` | `auto` \| `fill` \| comprimento | `auto` | Largura do host. |
| `height` | `auto` \| comprimento | `auto` | Altura do host. |
| `hidden` | `boolean` | `false` | Remove o elemento e seu conteúdo do layout e da árvore de acessibilidade. |

Este elemento não dispara eventos.

## Estilo

| Custom property | Padrão | Controla |
|---|---|---|
| `--inset-space-bleed` | `var(--spacing_inset-xs)` (16px) | Quanto o conteúdo é puxado para fora em cada lado nomeado. Aplicado como margem negativa. |
| `--inset-border-radius` | `var(--border-radius-sm)` (8px) | Arredondamento dos cantos que ficam na borda do pai. |

Case a sangria com o padding do pai — esse é todo o contrato. Um contêiner com
padding de `--spacing_inset-md` precisa do mesmo valor aqui, ou o conteúdo para
antes da borda ou passa dela:

```html preview
<div style="--card-space-inset: 32px;">
  <kb-card>
    <kb-inset side="top" style="--inset-space-bleed: 32px; --inset-border-radius: 16px;">
      <kb-cover
        src="https://picsum.photos/id/1025/640/360"
        alt="Sangria casada com um card mais folgado"
      ></kb-cover>
    </kb-inset>
    <kb-text size="xxs">Sangria e padding os dois em 32px.</kb-text>
  </kb-card>
</div>
```

!> A margem é declarada com `!important` para sobreviver a um pai que define
margens nos filhos. Você não consegue sobrescrever a sangria com uma `margin`
comum de fora — mude a custom property no lugar.

## Estados e acessibilidade

- `hidden` adiciona o custom state `hidden` e `display: none`, removendo o
  elemento e seu conteúdo do layout e da árvore de acessibilidade.
- **O host é declarado presentacional** — é um contêiner visual. O conteúdo
  dentro mantém a própria semântica, e a margem negativa não muda a ordem de
  leitura nem a de foco.
- `overflow: hidden` corta, não rola. Conteúdo mais alto que uma `height` fixa é
  cortado em silêncio, então deixe a altura automática a menos que você queira o
  corte.

## Certo e errado

| Faça | Não faça |
|---|---|
| Casar `--inset-space-bleed` com o padding do pai | Deixar a sangria padrão dentro de um contêiner com padding diferente |
| Usar `side` para sangrar só as bordas que tocam o pai | Usar `all` e depois brigar com o arredondamento nas bordas internas |
| Colocar um bloco de mídia ou uma faixa dentro dele | Tratá-lo como contêiner de layout geral — isso é o `<kb-stack>` |
| Deixar a altura acompanhar o conteúdo | Definir altura fixa e contar com o `overflow: hidden` para cortar em silêncio |
