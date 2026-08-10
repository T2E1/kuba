# Taxonomia dos contratos Symbol

Como **derivar** o nome de um Symbol em `interfaces.js`, não apenas reconhecê-lo.
Abra este arquivo ao criar um contrato novo ou ao revisar um existente.

O sufixo de um Symbol neste repositório não é decoração: ele **classifica o contrato**.
Pelo nome se sabe quem chama o método, quando, e o que ele faz — sem abrir a
implementação.

---

## As três perguntas de derivação

Responda nesta ordem. Cada resposta fixa uma parte do nome.

```
1. Quem invoca?          → decide a FORMA do nome
2. Sobre qual conceito?  → decide a RAIZ do nome
3. Atravessa pacote?     → decide Symbol() ou Symbol.for()
```

### Pergunta 1 — Quem invoca o método?

| Quem invoca | Forma | O contrato é |
|---|---|---|
| Um decorator, para publicar semântica na plataforma | `<raiz>able` | Uma **capacidade** do elemento |
| Um decorator, como passo mecânico do pipeline | verbo imperativo | Uma **transformação** |
| Um decorator de evento DOM (`@on.*`) | particípio do evento | Um **fato consumado** |
| O pipeline de renderização | `<momento>Callback` | Um **hook de ciclo de vida** |
| Outro pacote, cruzando fronteira | `verbNoun` | Uma **operação exportada** |
| Ninguém — é um valor guardado | substantivo | Um **recurso** |
| Uma verificação booleana | `is<Estado>` | Um **predicado** |

### Pergunta 2 — Qual é a raiz?

A raiz vem do **conceito que o contrato serve**, nunca do que o método faz por dentro.

| Conceito | Raiz | Nome |
|---|---|---|
| O atributo `variant` | `variant` | `variantable` |
| O valor exposto como faixa ARIA | `measure` | `measurable` |
| O atributo `hidden` | `hide` | `hideable` |
| O papel na árvore de acessibilidade | `identity` | `identifiable` |
| A validade do campo | `validate` | `validatable` |

Teste de leitura: `<raiz>able` tem de fazer sentido na frase **"este elemento é
___"** — *hideable*, *measurable*, *identifiable*. Se não faz, a forma está errada, e
provavelmente o contrato não é uma capacidade.

### Pergunta 3 — `Symbol()` ou `Symbol.for()`?

| Alcance | Escolha |
|---|---|
| Interno ao pacote | `Symbol()` |
| Precisa ser resolvido por outro pacote, ou por cópias duplicadas em bundles | `Symbol.for()` |

`Symbol.for()` usa o **registro global do processo**: qualquer código que conheça a
string alcança o contrato, o que anula o encapsulamento. Por isso é a exceção, e vem
sempre com um comentário dizendo por quê.

Os sete casos reais no repositório: `connectArc`, `disconnectArc`,
`echoConnectedCallback`, `echoDisconnectedCallback`, `isPainted`, `role`, `setHeader` —
todos contratos que cruzam fronteira de pacote.

---

## As seis categorias, com o inventário real

### 1. Capacidade — `<raiz>able`

O grupo dominante: 11 dos 30 contratos. O hook **publica a semântica do elemento na
plataforma** — `internals.states`, `internals.role`, ARIA, validade. Responde "o que
este elemento **é**?".

| Symbol | Publica |
|---|---|
| `hideable` | `internals.states` ← `hidden` |
| `variantable` | `internals.states` ← `variant` |
| `measurable` | Faixa de valor ARIA ← `value` |
| `identifiable` | `internals.role` |
| `validatable` | Estado de validade |
| `reportable` | Relato de validade |
| `disableable` | Estado desabilitado |
| `reflectable` | Reflexão de atributo |
| `slottable` | Semântica de slot |
| `resettable` | Capacidade de reset |
| `decorative` | Remoção da árvore de acessibilidade |

`decorative` é a exceção de forma: não existe `decorable` com o sentido certo, então usa
adjetivo simples. **Adjetivo continua sendo a família** — o que não vale é cair em
substantivo, que sinalizaria recurso.

### 2. Transformação — verbo imperativo

Passo mecânico do pipeline, sem semântica publicada. Responde "o que **fazer** agora?".

`cleanup`, `abort`, `dispatch`, `resize`, `change`

O contraste que define a fronteira está em `mixin/hidden/hidden.ts`, onde os dois
convivem na mesma classe:

- `[cleanup](value)` — remove o atributo quando o valor vira `false`. Mecânica, sem
  semântica. **Verbo.**
- `[hideable]()` — reflete o estado em `internals.states`, onde o CSS e a árvore de
  acessibilidade enxergam. Semântica. **`-able`.**

### 3. Fato consumado — particípio

Hook ligado a um evento DOM por `@on.*`. O nome espelha o evento, no particípio.

| Symbol | Decorator |
|---|---|
| `submitted` | `@on.submit` |
| `resetted` | `@on.reset` |
| `rendered` | `@connected` |

O particípio comunica que o método roda **depois** do fato, não para causá-lo.

### 4. Ciclo de vida — `<momento>Callback`

Pipeline de renderização do `@dom`. O sufixo distingue o hook do decorator e da função
de mesmo tema — sem ele, `paint` seria três coisas.

`willPaintCallback`, `didPaintCallback`, `htmlCallback`, `cssCallback`,
`echoConnectedCallback`, `echoDisconnectedCallback`

`will`/`did` marcam o momento em relação ao evento, na convenção de ciclo de vida.

### 5. Operação exportada — `verbNoun`

Cruza fronteira de pacote: o nome precisa se explicar longe de casa.

`connectArc`, `disconnectArc`, `setHeader`, `dispatchFormAction`

### 6. Recurso e predicado — substantivo e `isX`

| Symbol | Tipo |
|---|---|
| `controller` | Recurso — o `AbortController` guardado |
| `role` | Recurso — o papel declarado pelo elemento |
| `setter` | Recurso — a função de escrita |
| `isPainted` | Predicado — o elemento já pintou? |

---

## Regras que valem para todos

1. **A descrição é idêntica ao nome da constante.** `Symbol('hideable')`, nunca
   `Symbol('toggle visibility state')`. A descrição é o que aparece no stack trace, e o
   que torna o símbolo pesquisável pelo nome do import.
2. **Um Symbol, um contrato** (rule 013). Um hook que publica dois estados são dois
   contratos.
3. **Sem abreviação** (rule 006). O contrato é público dentro do pacote.
4. **JSDoc dizendo qual decorator o aciona.** O padrão do repositório:
   `/** Method key for the '@around' hook that reflects 'hidden' state onto 'internals.states' (see 'hidden.ts'). */`
   Quem lê o `interfaces.js` descobre o acionador sem abrir a implementação.
5. **Arquivo `interfaces.js`, no plural**, mesmo com um único Symbol.

---

## Fluxo ao criar um contrato

1. Escrever a frase: *"quando ___ acontece, o elemento precisa ___"*.
2. Pergunta 1 — quem invoca? Fixa a forma.
3. Pergunta 2 — qual conceito? Fixa a raiz. Testar em "este elemento é ___" se for
   capacidade.
4. Pergunta 3 — cruza pacote? Fixa `Symbol()` ou `Symbol.for()`, com comentário se for
   o segundo.
5. Escrever o JSDoc citando o decorator acionador e o arquivo de implementação.
6. Conferir: a descrição do Symbol é igual ao nome da constante?

### Exemplo trabalhado

> *"Quando o atributo `expanded` muda, o elemento precisa refletir o estado em
> `internals.states` para o CSS reagir."*

1. **Quem invoca?** Um decorator (`@around`), publicando semântica na plataforma →
   capacidade → forma `<raiz>able`.
2. **Qual conceito?** O atributo `expanded` → raiz `expand`. Teste: "este elemento é
   *expandable*" ✅.
3. **Cruza pacote?** Não, é interno ao componente → `Symbol()`.

```js
/** Method key for the `@around` hook that reflects `expanded` state onto `internals.states` (see `accordion.ts`). */
export const expandable = Symbol('expandable')
```

Contraexemplo, mesma situação com resposta diferente na pergunta 1:

> *"Antes de atribuir, normalizar a string removendo espaços."*

Passo mecânico, sem semântica publicada → **verbo imperativo**: `normalize`, não
`normalizable`.
