# A estrutura da página de componente

## De onde ela vem

Comparando como Material Design 3, Carbon (IBM), Atlassian Design System e Shopify Polaris
documentam componentes, a mesma sequência se repete sob nomes diferentes: propósito,
demonstração, quando usar, quando **não** usar, hierarquia de variantes, cor como
semântica, composição, estados e acessibilidade, e pares do/don't lado a lado.

Nenhum desses sistemas gera essa prosa a partir de metadados. É escrita à mão, uma vez,
por quem entende o componente. `docs/components/button.md` é a implementação de referência
neste repositório; `progress.md` é a versão curta, para um componente mais simples.

## As seções, em ordem

### 1. Propósito

Um parágrafo. O que o componente faz **e onde ele para**. A fronteira é onde o leitor mais
erra, e dizê-la economiza uma escolha errada:

> A button triggers a synchronous action owned by the page it's on. It never changes the
> URL. If the outcome is a new location, wire `<kb-redirect>` to the button's `clicked`
> event instead of putting that logic in the button.

### 2. Demonstração

Um bloco ` ```html preview ` logo depois do propósito, antes de qualquer `##`. Mostra o
caso mais comum e as variantes principais lado a lado — o leitor vê antes de ler.

O docsify renderiza esses blocos contra o kuba carregado do CDN. Só use atributo que
existe na versão pinada.

### 3. `## Usage`

O caso mais comum em HTML, e o JavaScript de quem escuta o evento, quando há. Curto: o
detalhe vem depois.

### 4. `## When to use`

Cenários concretos, não categorias. "Submitting or resetting a `<form>`" serve; "when you
need user interaction" não.

### 5. `## When not to use`

A seção mais importante da página, e a que documentação gerada nunca tem. Diz qual é a
alternativa quando o componente **parece** servir e não é, com link e com o motivo:

> **Navigating to another route or URL.** Use a plain `<a>` for external navigation, or
> `<kb-redirect>` wired to a button's `clicked` event. `kb-button` has no concept of a
> destination.

Escreva-a com a mesma atenção que a anterior. Ela é o que impede o erro.

### 6. `## Composition`

Obrigatória sempre que o componente tem slot ou posição significativa na árvore.

- **Pode conter**: quais elementos fazem sentido como filho, e **por quê cada um**. Cite o
  mecanismo real — "`pointer-events: none` em `::slotted(*)` faz o conteúdo não
  interceptar o clique" —, não uma lista de tipos aceitos.
- Se filho livre não faz sentido, **diga isso**: "no meaningful children". Não omita.
- **Pode ser filho de**: restrição real de onde ele pode ser colocado, ou "anything"
  quando não há. Não deixe implícito.

### 7. Seções por eixo de escolha

Uma por atributo que carrega uma **regra**, não apenas uma **opção**. Nomeie pela pergunta
que a seção responde, não pelo atributo cru. Detalhe em `eixos-de-escolha.md`.

Atributo que é só forma, sem regra de uso, fica na tabela de atributos e não ganha seção.

### 8. `## States and accessibility`

- O que o elemento publica em `internals.states`, e o que cada estado significa.
- O papel e o nome acessível: o que ele expõe sozinho, e o que exige `alt`.
- Pré-condição não óbvia — `type="submit"` é no-op fora de um `<form>`.
- Contraste e o token que pode desaparecer sobre certas superfícies.
- O que **não** confiar só na cor para comunicar.

### 9. `## Do's and don'ts`

Tabela de duas colunas, **pareadas linha a linha**: a linha 1 de `Do` e a linha 1 de
`Don't` tratam do mesmo aspecto. De três a cinco pares cobre o que importa; listar toda
combinação inválida possível é especulação (rule 023).

## O que mudou desde o Storybook

Este repositório usou Storybook até a versão `0.1.0-alpha.30`. A estrutura acima **é** a
que estava nos arquivos `.mdx`; o que mudou foi o veículo:

| Antes | Agora |
|---|---|
| `<Canvas of={Stories.X} />` | ` ```html preview ` |
| `<Controls />` | Tabela de atributos em markdown |
| `play` em `.stories.js` | `<nome>.test.js`, Vitest em navegador real |
| `.mdx` ao lado do pacote | `docs/components/<nome>.md` |
| `argTypes` transcrevendo `types.d.ts` | A tabela de atributos transcrevendo o mesmo |

O princípio sobreviveu inteiro: **a demonstração transcreve o contrato, nunca o inventa.**

---

**Criado em**: 2026-08-10
**Atualizado em**: 2026-08-10
