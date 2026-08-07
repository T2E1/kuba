# Nomenclatura

Não usamos Atomic Design. Tentamos no começo, mas gastar energia classificando o
que era "átomo", "molécula" ou "organismo" não combinava com o que o kuba de
fato é: custom elements nativos, não uma árvore de composição. Mantivemos a
mentalidade e simplificamos, chegando a três camadas.

## Prefixo da tag

| Prefixo | Significado | Exemplos |
|---|---|---|
| `kb-` | Todo custom element do kuba, visual ou headless. | `<kb-button>`, `<kb-input>`, `<kb-dataset>`, `<kb-fetch>` |

Um prefixo único mantém o namespace previsível e faz qualquer elemento do kuba
ser reconhecível de relance no markup de outra pessoa. Se um elemento renderiza
algo ou não é dito pelo seu `types.d.ts` e pela existência de uma página em
[Componentes](/pt-br/components/) — não pela tag.

Elementos headless — `<kb-dataset>`, `<kb-filter>`, `<kb-find>`, `<kb-fetch>`,
`<kb-headers>`, `<kb-on>`, `<kb-redirect>` — guardam ou buscam dados e publicam
eventos no Echo, mas não renderizam nada.

## Design tokens

As variáveis semânticas de estilo, espelhadas entre design e código. Todo token
segue `--{grupo}-{escala}`: `--spacing-md`, `--color-primary-dark`.

**O nome nunca descreve *onde* o token é usado, apenas *o que* ele
representa.** É isso que permite reutilizá-lo em qualquer componente sem o nome
jamais se tornar enganoso — `--color-danger` continua correto colorindo um
botão, uma borda ou uma mensagem de validação.

## Elements

Os componentes indivisíveis — as menores partes de uma interface: um botão, um
input, um label. Cada um mapeia para um único diretório em `packages/`, com seu
`types.d.ts` e seu `style.js`, e é construído puramente de combinações de design
tokens. Nada de valores soltos.

## Blocks

Os componentes mais complexos, montados compondo vários Elements. Um `<kb-card>`
agrupando `<kb-text>`, `<kb-label>` e `<kb-button>` é um Block.

Tokens de espaçamento governam essas composições, para que o ritmo entre
Elements dentro de um Block seja previsível no produto inteiro.

## O quê + semântica + variante

A prática para nomear tanto design tokens quanto os atributos de um
`types.d.ts`: comece pelo **o quê** (o conceito), siga com a **semântica** (a
variação) e acrescente uma **variante** de intensidade quando necessário.

| | o quê | semântica | variante |
|---|---|---|---|
| Token | `color` | `primary` | `dark` |
| Token | `spacing_inset` | `md` | — |
| Propriedade | `--button-color` | `accent` | — |
| Atributo | `variant` | `outlined` | — |

Não é obrigatório — entra em cena quando há necessidade real de diferenciar.

## Antes de criar um Element novo

Você pode ter um `<kb-card>` e eventualmente precisar de um "card com imagem".
Verifique antes se isso não é simplesmente uma composição diferente do mesmo
`<kb-card>` — um Block, não um Element novo.

As perguntas, nesta ordem:

1. **É composição de Elements existentes?** Então é um Block. Escreva o markup,
   não um pacote novo.
2. **É o mesmo Element com aparência diferente?** Então é override de token ou
   um atributo `variant` — veja [Estilização](/pt-br/learn/styling).
3. **É genuinamente uma parte indivisível nova?** Só então merece um pacote, um
   `types.d.ts` e uma página aqui.

## Eventos

Eventos são nomeados no **passado** — relatam um fato, não pedem uma ação:
`clicked`, `changed`, `submitted`, `filtered`, `found`, `succeeded`, `failed`.

A regra importa mais do que parece. Um elemento que publica `save` está dizendo
a alguém o que fazer, o que significa que sabe quem está ouvindo. Um elemento
que publica `submitted` está declarando o que aconteceu, e não se importa com
quem reage — que é justamente por que elementos do kuba nunca importam uns aos
outros.
