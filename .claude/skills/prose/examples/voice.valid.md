# ✅ O mesmo conteúdo, com alguém dentro

Incorreto em: `voice.invalid.md`

Este é o comentário real no topo de `vitest.config.js`, escrito por uma pessoa:

---

```js
// A real browser, not jsdom: these components depend on ElementInternals,
// custom states (:state()), adoptedStyleSheets, delegatesFocus and the
// requestAnimationFrame that @paint defers the first render to. A DOM
// emulation either lacks those or fakes them well enough to make a passing
// test prove nothing.
```

---

## O que ele faz que a versão sem voz não faz

**Assume um lado, na primeira linha.** "A real browser, not jsdom" — a alternativa é
nomeada e descartada de saída. A versão morta dizia "a DOM emulation does not implement
all of these features", que é a mesma informação sem a decisão.

**Termina com um julgamento afiado.** "fakes them well enough to make a passing test prove
nothing" — essa é a frase que faz alguém entender o custo. É opinião, é específica, e
resolve a discussão antes que ela comece.

**O verbo carrega desprezo.** *Fakes*, não *simulates*. A escolha da palavra diz o que o
autor acha sem precisar de um adjetivo.

**É concreto até o fim.** Não "algumas APIs modernas", mas `ElementInternals`,
`:state()`, `adoptedStyleSheets`, `delegatesFocus`, e o `requestAnimationFrame` específico
onde `@paint` adia o primeiro render. Quem lê consegue verificar cada item.

**O ritmo quebra.** Uma frase longa que enumera, depois uma frase que fecha com pancada.

---

## A regra que se extrai

Voz não é gíria nem exclamação. **É a frase em que alguém assume um risco** — dizer que uma
ferramenta popular faz o teste provar nada é uma posição, e alguém a assinou.

Um segundo exemplo, este de `docs/components/button.md`:

> `variant` expresses emphasis, not decoration — pick by how important the action is
> relative to its siblings, not by taste.

"not by taste" é o julgamento. Sem ele, a frase vira uma descrição de atributo que o
`types.d.ts` já dá. Com ele, a documentação economiza uma discussão de code review.

## O limite

Nenhum dos dois exemplos é informal. Não há piada, não há emoji, não há "olha só que
legal". O registro continua técnico e sóbrio — a voz está na **escolha do que vale dizer**
e na disposição de dizer que algo não presta.
