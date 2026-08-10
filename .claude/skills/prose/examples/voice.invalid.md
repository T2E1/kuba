# ❌ Texto correto e sem voz

Correto em: `voice.valid.md`

Este exemplo é diferente dos outros dois. O texto abaixo **passa em todos os 24 padrões**
do catálogo — nenhum *testament*, nenhuma tríade, nenhum travessão sobrando, nenhum
adjetivo promocional. E ainda assim se reconhece como gerado.

---

```markdown
## Why the tests run in a real browser

The test suite uses Vitest with a Chromium instance. The components depend on
ElementInternals, custom states, adoptedStyleSheets and delegatesFocus. A DOM
emulation does not implement all of these features. Tests that run in an
emulated DOM may pass without verifying the intended behavior. The suite
therefore runs in a real browser. This adds time to the test run. The tradeoff
is considered acceptable for this project.
```

---

## O que falta

Nada a apontar como errado. O problema é o que não está lá:

| Sintoma | Onde |
|---|---|
| **Ritmo uniforme** | Sete frases, todas entre 8 e 14 palavras, todas sujeito-verbo-objeto |
| **Nenhuma opinião** | "is considered acceptable" — considerado por quem? A construção passiva esconde que alguém decidiu |
| **Nenhuma dúvida** | O trade-off é apresentado como resolvido, sem custo admitido |
| **Nenhuma consequência concreta** | "may pass without verifying" — o leitor não vê o problema acontecer |
| **Nenhuma primeira pessoa** | Ninguém tomou a decisão; ela simplesmente é |

## Por que isso é difícil de detectar

Os 24 padrões são detectáveis por busca — dá para procurar *testament*, contar travessões,
achar Title Case. **Ausência de voz não tem palavra-sinal.** O único teste é ler e perguntar:
*havia uma pessoa aqui?*

Neste caso, não. O texto poderia ter sido escrito sobre qualquer projeto que use Vitest, o
que é precisamente o defeito de origem: o resultado mais provável para o maior número de
casos.

Compare com o comentário que está de fato no `vitest.config.js` deste repositório — ele diz
a mesma coisa e tem alguém dentro.
