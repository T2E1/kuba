# DESIGN — `kb-fetch`

**Pacote**: `src/data/fetch/`
**Tag**: `<kb-fetch>`
**Status**: documentação retroativa — a implementação precede este documento
**Data**: 2026-09-05

---

Este documento segue o framework LLD (5 passos) e descreve `kb-fetch` como ele existe hoje.
O pacote foi escrito antes de qualquer processo formal de design neste repositório, nunca
teve especificação própria e — como `src/data/headers/DESIGN.md:273` já registrava como
achado adjacente — **nunca teve teste**. O objetivo é duplo: registrar a forma já
implementada, sem redesenhá-la, e apontar com evidência onde o código diverge do que
`types.d.ts` e `website/docs/components/fetch.mdx` prometem.

A partir desta versão vale a mesma regra dos outros: quando implementação e documento
divergirem, é a implementação que está errada. Mudança de comportamento passa primeiro por
uma revisão deste documento, depois pelo código.

## Visão Geral

`kb-fetch` é o **elemento de dados headless** do repositório: não renderiza nada
(`Headless`, `fetch.ts:14`), guarda um template de URL e um objeto de headers, e expõe
quatro verbos HTTP — `delete`, `get`, `post`, `put` (`fetch.ts:56`, `:66`, `:76`, `:87`) —
que interpolam a URL com o payload, disparam a requisição pelo pacote `@http` e publicam o
desfecho como evento `succeeded` ou `failed` (`fetch.ts:48-49`).

Três decisões estruturam o pacote, e todas são visíveis em uma tela de código:

1. **Ele é o pai de dois filhos declarativos.** É o único implementador de
   `[setHeader]` no repositório (`fetch.ts:31`; a busca por `setHeader` em `src/` e
   `packages/` só retorna este arquivo, `src/data/fetch/interfaces.js:9`,
   `src/data/headers/headers.ts:45` e `src/data/headers/interfaces.js:6`), o contrato que
   `<kb-headers>` invoca no pai. E, por estar na cadeia `Echo` (`fetch.ts:14`), implementa
   também `[connectArc]` (`packages/echo/echo.js:61`), o contrato que `<kb-on>` invoca no
   pai (`src/behavior/on/on.ts:32`). Os dois filhos se anunciam; `fetch.ts` nunca varre
   `children`. É o que mantém este pacote fechado para modificação (rule 011) e o grafo
   acíclico (rule 018) — `fetch` não importa `headers`, `headers` não importa `fetch`.
2. **A ortogonalidade `@before`/`@after`.** Abortar a requisição anterior e publicar o
   resultado não estão no corpo dos verbos: são dois decorators aplicados aos quatro
   (`fetch.ts:54-55`, `:64-65`, `:74-75`, `:85-86`), com a lógica isolada em dois métodos
   com chave de Symbol (`fetch.ts:38`, `:44`).
3. **Nada rejeita.** `http.json()` converte falha de rede e resposta não-2xx em
   `{ data, error }` (`packages/http/http.js:24-33`), então o elemento nunca precisa de
   `try/catch` e o consumidor nunca precisa de `.catch()`.

O que ele **não** é: um cliente HTTP geral. Todo verbo termina em `.json()`
(`fetch.ts:61`, `:71`, `:82`, `:93`) — texto, blob e streaming estão fora por desenho, e a
documentação já diz isso (`website/docs/components/fetch.mdx`, seção "When not to use").

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | O autor de markup que precisa de uma requisição JSON cujo resultado alimenta a página, e o autor de JS que prefere chamar `fetcher.get(payload)` a montar `fetch` + parse + catch |
| Somente leitura ou interativo | Nem um nem outro: é infraestrutura declarativa. Não tem interação própria; é acionado por arco (`<kb-on>`, attribute `on`) ou por chamada de método |
| Caso de uso mínimo (MVP) | Ler `url`, interpolar o payload, requisitar, publicar `succeeded`/`failed` |
| Participa de `<form>` | Não. Não há `attachInternals()`, `formAssociated` nem `value` de formulário em nenhum arquivo do pacote |
| Papel e nome acessível | Nenhum, e corretamente nenhum — ver seção 3 |
| Superfície de variação | `url` (`fetch.ts:19-26`), `on` (herdado de `Echo`), e o conjunto de headers acumulado pelos filhos `<kb-headers>` |
| Sub-elemento interno | Nenhum. Sem `attachShadow`, sem template, sem estilo próprio. Há uma classe auxiliar de módulo, `Controller` (`controller.js:1`), que não é elemento |

**Requisitos funcionais**

1. Expõe `url` como propriedade string, sincronizada a partir do attribute homônimo via
   `@attributeChanged('url')` (`fetch.ts:23`), com default `''` pelo `??=` do getter
   (`fetch.ts:20`).
2. Interpola `url` com o payload a cada chamada de verbo (`fetch.ts:58`, `:68`, `:78`,
   `:89`), usando `@interpolate`: `{path.to.value}` resolve por dot-path, segmento ausente
   vira string vazia, e `{}` vazio é o payload inteiro (`packages/interpolate/interpolate.js:12-15`).
3. Aceita headers de filhos `<kb-headers>` via `[setHeader](key, value)`, acumulando em um
   objeto simples (`fetch.ts:31-34`) repassado ao construtor nativo `Headers`
   (`packages/http/http.js:18`).
4. Aborta a requisição em voo antes de iniciar a próxima, em todos os quatro verbos
   (`fetch.ts:38-41`, aplicado por `@before(abort)`).
5. Publica o desfecho como `succeeded` ou `failed`, com o `data` do resultado como
   `detail`, adiado por `requestIdleCallback` (`fetch.ts:44-52`).
6. Nunca renderiza: `Headless` aplica `display: none` inline no host, ao conectar
   (`packages/mixin/headless/headless.ts:7-10`).

**Não-requisitos (YAGNI, rule 023)**

- Verbos além dos quatro. `@http` é um Proxy que aceita qualquer nome de método
  (`packages/http/http.js:4-10`), mas o elemento fixa quatro — `PATCH`, `HEAD` e
  `OPTIONS` não estão no contrato e não devem entrar sem consumidor.
- Retry, progresso, streaming, cancelamento manual pelo consumidor. `abort` é privado do
  pacote (`interfaces.js:1`, `Symbol()` de módulo) e só é acionado pelo próprio ciclo.
- Fila ou concorrência. Um elemento serve uma requisição por vez, por desenho: a segunda
  chamada cancela a primeira. Duas requisições concorrentes exigem dois elementos.
- Papel ARIA, `alt`, `Identity`. Um elemento com `display: none` não chega à árvore de
  acessibilidade.
- Slot, `part`, custom property, token. Sem shadow root, não há superfície visual —
  este pacote não tem, e não deve ter, revisão de `designer`.
- Remoção de header. Não há contrato inverso de `[setHeader]`; ver Edge case 8.

---

## 2. Contrato Público

### Attributes / Properties

| Nome | Tipo | Default | Reflete | Especificação |
|---|---|---|---|---|
| `url` | `string` | `''` | não | Template de URL, com placeholders `{path}` opcionais. Setter decorado com `@attributeChanged('url')` (`fetch.ts:23`), grava em `#url` (`fetch.ts:25`). Getter usa `??= ''` (`fetch.ts:20`), então ler antes de qualquer escrita devolve `''`, não `undefined` |
| `on` | arc string | — | não | Herdado de `Echo`, que o adiciona a `observedAttributes` (`packages/echo/echo.js:9`) e reage à mudança reconectando o arco (`packages/echo/echo.js:14-17`). **Não declarado em `types.d.ts`** — ver divergências abaixo |
| `name` | `string` | — | — | Não é implementado pelo pacote: é o attribute HTML global lido por `Echo` no eco (`packages/echo/echo.js:43`) para casar com o segmento `source` de um arco. Documentado em `website/docs/components/fetch.mdx` como se fosse do elemento |

**Rule 037 (flag arguments)**: nenhum attribute booleano no contrato, e nenhum parâmetro
booleano nos métodos públicos.

**Métodos públicos** (rule 010 — o limite é 7; há 4 verbos + o par getter/setter de `url`,
folgado):

| Método | Envia | Corpo | Retorno real |
|---|---|---|---|
| `delete(payload)` | DELETE (`fetch.ts:58`) | — | ver divergência 1 abaixo |
| `get(payload)` | GET (`fetch.ts:68`) | — | idem |
| `post(payload)` | POST (`fetch.ts:78`) | o payload (`fetch.ts:79`) | idem |
| `put(payload)` | PUT (`fetch.ts:89`) | o payload (`fetch.ts:90`) | idem |

Em `post` e `put` o payload é usado **duas vezes**: interpolado na URL e enviado como
corpo (`fetch.ts:78-79`, `:89-90`). É conveniente quando o id vive nos dois lugares, e
surpreendente quando não — a documentação já registra isso.

### Events

| Evento | Dispara quando | `detail` |
|---|---|---|
| `succeeded` | o resultado veio sem `error` (`fetch.ts:49`) | o `data` parseado |
| `failed` | o resultado veio com `error` (`fetch.ts:48`) | **`data`, que é `null` sempre que `error` existe** (`packages/http/http.js:30`, `:32`) |

Os dois são construídos por `customEvent` (`fetch.ts:48-49`), portanto `bubbles: true` e
`cancelable: true` (`packages/event/customEvent.js:3-8`). Por estar em `Echo`, todo
`dispatchEvent` é ecoado também no barramento compartilhado, embrulhado com `id`, `name` e
tag do host (`packages/echo/echo.js:35-50`) — é isso que permite `<kb-fetch name="dogs">`
ser o `source` de um arco de outro elemento.

**`failed` não carrega o erro.** Os dois ramos despacham `data` (`fetch.ts:48-49`), e
`data` é `null` no caminho de falha. A razão da falha nunca chega ao ouvinte.
`website/docs/components/fetch.mdx` já o descreve como "This looks like a bug rather than
a design decision" — este documento concorda, e registra como Edge case 2.

### Slots e Parts

Nenhum dos dois, e nenhum shadow root. O light DOM existe e é significativo, mas não como
conteúdo: é onde moram os filhos declarativos `<kb-headers>` e `<kb-on>`, ambos também
`display: none`.

### Symbols publicados

| Symbol | Forma | Alcance | Papel |
|---|---|---|---|
| `setHeader` | `Symbol.for('setHeader')` (`interfaces.js:9`) | Global (registro do processo) | Chave do método que **este elemento implementa** (`fetch.ts:31`) e que o filho `<kb-headers>` **invoca** (`src/data/headers/headers.ts:45`). Declarado nos dois lados, cada um com o comentário justificando o registro global (`interfaces.js:4-8`; `src/data/headers/interfaces.js:1-5`) |
| `abort` | `Symbol('abort')` (`interfaces.js:1`) | Módulo | Chave do método de cancelamento, referenciada só por `@before(abort)` dentro de `fetch.ts` |
| `dispatch` | `Symbol('dispatch')` (`interfaces.js:2`) | Módulo | Chave do método de publicação, referenciada só por `@after(dispatch)` dentro de `fetch.ts` |

### Symbols consumidos

| Symbol | De onde | Papel |
|---|---|---|
| `connectArc` / `disconnectArc` | `packages/echo/interfaces.js:4-5`, via a cadeia `Echo` | Implementados por `Echo` no próprio host (`packages/echo/echo.js:61`, `:103`). É por isso que `<kb-on>` como filho de `<kb-fetch>` funciona: `src/behavior/on/on.ts:32` chama `parentElement[connectArc]` e encontra a implementação herdada |
| `hideable` | `packages/mixin/headless/interfaces.js:2`, via `Headless` | Hook `@connected` que aplica `display: none` |

**Sobre `setHeader` ser `Symbol.for` — está correto, e a análise completa já foi feita.**
`src/data/headers/DESIGN.md:124-150` percorre a taxonomia
(`.claude/skills/naming/references/taxonomia-symbol.md`), o precedente `connectArc` e a
razão de a declaração ser duplicada em vez de importada. Vista deste lado, a conclusão é a
mesma e o ganho é literalmente visível: `fetch.ts` não importa nada de `src/data/headers/`
e mesmo assim é chamado por ele. Sem o registro global, um dos dois pacotes deixaria de
ser publicável sozinho (rule 015) e apareceria uma aresta arbitrária entre dois pacotes de
`src/data/` (rule 018).

**`abort` e `dispatch` como `Symbol()` local também está correto**: nenhum outro pacote os
toca, e `@before`/`@after` os resolvem por `context[method]` dentro da mesma instância
(`packages/middleware/before.js:39`, `packages/middleware/after.js:9`). Torná-los globais
não compraria nada e exporia dois pontos internos do ciclo de requisição.

### Divergências entre contrato declarado e implementação

São três, todas verificadas nesta execução, e todas do tipo que um `fetch.test.js` teria
pego:

1. **O retorno dos verbos não é a `Promise<FetchResult>`.** `types.d.ts:38`, `:46`, `:55`,
   `:64` declaram `Promise<FetchResult<T>>`, e `website/docs/components/fetch.mdx` ensina
   `const { data, error } = await fetcher.get({ id: 1 })`. Mas `@after` substitui o retorno
   do método pelo retorno do interceptador — `return context[method](original.apply(...))`
   (`packages/middleware/after.js:9`) — e `[dispatch]` retorna `this`, não a promise
   (`fetch.ts:51`). Então `fetcher.get(...)` devolve o **elemento**. `await` sobre um
   elemento não lança: resolve para o próprio elemento, e o destructuring devolve dois
   `undefined`. O caminho por evento funciona; o caminho por `await` documentado, não.
   Esta é a divergência mais grave do pacote.
2. **`controller` não existe como membro público.** `types.d.ts:27` declara
   `readonly controller: AbortController`. `fetch.ts:15` tem `#controller`, privado, e o
   valor é uma instância de `Controller` (`controller.js:1`), não de `AbortController`.
   Nenhum getter `controller` existe em `fetch.ts`.
3. **`url` não reflete.** `types.d.ts:30` diz "Reflects the `url` attribute".
   `@attributeChanged` só sincroniza attribute → propriedade
   (`packages/directive/attributeChanged/execute.js:108-126`); não há
   `setAttribute` de volta em `fetch.ts`. A direção propriedade → attribute não existe.

Some-se a omissão de `on` e do contrato `[setHeader]` em `types.d.ts` — a superfície
declarada é menor que a real em dois pontos e maior em um. É exatamente o achatamento de
mixin que a skill `types` cobra: quem lê `types.d.ts:25` vê `extends HTMLElement`, sem
sinal de que `Echo` está na cadeia.

---

## 3. Composição

**Cadeia**: `Echo(Headless(HTMLElement))` (`fetch.ts:14`)

| Mixin | Traz | Avaliação |
|---|---|---|
| `Headless` | Hook `@connected [hideable]()` que aplica `display: none` inline no host (`packages/mixin/headless/headless.ts:7-10`) | **Necessário e suficiente para o eixo visual.** O elemento existe no markup e não pode ocupar espaço |
| `Echo` | `on` em `observedAttributes` (`packages/echo/echo.js:9`), `[connectArc]`/`[disconnectArc]` (`:61`, `:103`), teardown dos arcos no `disconnectedCallback` (`:22-30`), e eco de todo `dispatchEvent` no barramento (`:35-50`) | **Necessário, e usado nos dois sentidos** — ver abaixo |

### `Echo` é justificado aqui, e não era em `kb-headers`

A comparação importa porque o `architect` removeu `Echo` de `kb-headers` em 2026-08-27 por
herança recusada (`src/data/headers/DESIGN.md:172-179`). Aqui a conta dá o contrário, e
por dois motivos independentes, cada um sozinho suficiente:

- **Sentido de saída (eco de `dispatchEvent`)**: `fetch.ts:48-49` despacha de fato, duas
  vezes. Sem `Echo`, os eventos ficariam restritos à árvore DOM e nenhum outro elemento da
  página poderia se ligar a eles por arco. O exemplo canônico da documentação depende
  disso: `<kb-on value="dogs/succeeded:method/render">` dentro de um `<kb-render>` casa com
  o `name="dogs"` deste elemento pelo barramento (`packages/echo/echo.js:41-47`, `:82`).
- **Sentido de entrada (`[connectArc]`)**: é o que torna `<kb-fetch>` acionável
  declarativamente. `<kb-on value="breed/changed:method/get">` como filho chama
  `parentElement[connectArc]` (`src/behavior/on/on.ts:32`) e o arco resolve para
  `this['get'](payload)` (`packages/echo/echo.js:88`). Sem `Echo`, o elemento só teria a
  via JS.

Ou seja: `kb-fetch` é o **host**, e `kb-headers`/`kb-on` são os dois filhos declarativos
que o mutam. A relação é a mesma nos dois casos — o filho se anuncia, o pai nunca varre
`children` — mas por Symbols diferentes: `setHeader`, implementado aqui à mão
(`fetch.ts:31`), e `connectArc`, herdado de `Echo`.

### `@before`/`@after` em vez de corpo inline — decisão correta, com uma ressalva

Os quatro verbos carregam o mesmo par de decorators (`fetch.ts:54-55` e repetições). O
ganho é real: o corpo de cada verbo é só a construção da requisição, e a política de
cancelamento e de publicação está declarada uma vez cada, em `fetch.ts:38` e `:44`.
Acrescentar um quinto verbo custa duas linhas de decorator, não a repetição do ciclo.

A ressalva é semântica. `@before` foi desenhado para **transformar argumentos** — o
comentário do pacote é explícito: "it transforms the arguments, it does not just observe
them" (`packages/middleware/before.js:31-33`). `[abort]` recebe `payload` e devolve
`payload` intacto (`fetch.ts:38-41`); a transformação é a identidade, e o que interessa é
o efeito colateral. É uso fora da intenção declarada do decorator, funciona, e é o
mecanismo certo à falta de um `@around` síncrono (`packages/middleware/around.js:15-18`
agenda por `setImmediate` e descarta o retorno, portanto não serve). Fica registrado como
escolha consciente, não como acidente. O mesmo desvio, em `@after`, é o que produz a
divergência 1 da seção 2 — ali com consequência real.

### Duplicação entre os quatro verbos

`delete`, `get`, `post` e `put` são quatro corpos quase idênticos (`fetch.ts:56-94`),
diferindo pelo nome do verbo e pela presença de `.body(payload)`. É repetição de mais de
duas ocorrências, o que a rule 021 normalmente pede para extrair. **Não deve ser
extraída**: `@http` é um Proxy que aceita qualquer nome de método
(`packages/http/http.js:7-10`), então a fatoração natural seria um método genérico
`request(verb, payload)` — e verbo como parâmetro é exatamente o argumento de despacho que
a rule 037 e o OCP desaconselham, além de destruir a superfície tipada de quatro métodos
nomeados. A repetição de cinco linhas de builder é o preço de uma API pública legível, e é
o preço certo.

### `role`/`Identity`: ausência correta

Não implementar `get [role]()` nem entrar com `Identity` é a decisão certa, pelas mesmas
três razões que valem para `kb-on` e `kb-headers`: `display: none` mantém o elemento fora
da árvore de acessibilidade, não há conteúdo para nomear, e é um elemento de configuração
e transporte, não de apresentação. `kb-fetch` é inclusive citado nominalmente nos dois
documentos vizinhos como parte da família `Headless`-sem-`Identity`
(`src/data/headers/DESIGN.md:192-194`; `src/behavior/on/DESIGN.md:152-154`).

A consequência de acessibilidade não é neutra, e não é do elemento resolver: **nada anuncia
carregamento nem falha**. A documentação já orienta a ligar `succeeded`/`failed` a algo
visível (`website/docs/components/fetch.mdx`, "States and accessibility"). Registrado aqui
para que a ausência seja lida como fronteira de responsabilidade, não como esquecimento.

---

## 4. Gestão de Estado

| Dado | Onde mora | Controlado? | Regra de sincronização |
|---|---|---|---|
| `url` | `#url` privado + attribute `url` (`fetch.ts:17`, `:23-26`) | Controlado — DOM é a fonte da verdade | `@attributeChanged('url')` grava no campo. Não reflete de volta. Lido a cada chamada de verbo, nunca cacheado |
| `#headers` | Objeto simples privado (`fetch.ts:16`) | Escrito de fora, pelo contrato `[setHeader]` | Um filho `<kb-headers>` grava uma chave, uma vez, no `@connected` dele. Convertido em `Headers` nativo a cada requisição (`packages/http/http.js:18`) |
| `#controller` | Instância de `Controller` (`fetch.ts:15`, `controller.js:1`) | Interno, nunca exposto | Abortado no `@before` de cada verbo; renovado preguiçosamente, ver abaixo |
| Arcos | `#controllers` privado, dentro de `Echo` (`packages/echo/echo.js:7`) | Escrito pelo attribute `on` e por cada filho `<kb-on>` | Um `AbortController` por arco; todos abortados no `disconnectedCallback` (`packages/echo/echo.js:22-30`) |

**Estado derivado**: nenhum. **Estado observável**: nenhum — não há `internals.states`, não
há `@repaint`/`@retouch`, não há template.

### O ciclo do `Controller` — e um comentário desatualizado

`Controller` (`controller.js`) existe para uma razão só: um `AbortController` abortado é
inutilizável para sempre. O `abort()` do wrapper marca o alvo (`controller.js:9-11`), e a
**renovação acontece no getter `signal`**, que troca o alvo por um novo quando o atual já
está abortado (`controller.js:5`).

O comentário em `fetch.ts:36-37` diz "then replaces the controller so the aborted signal
isn't reused for the next request", como se `[abort]` fizesse a substituição. Não faz —
`[abort]` só chama `this.#controller.abort()` (`fetch.ts:39`). A substituição é preguiçosa
e mora no getter. O efeito final é o mesmo, mas o comentário aponta para o lugar errado, e
a rule 026 cobra que o comentário explique o porquê **verdadeiro**.

O getter `signal` é uma consulta que muta (`controller.js:5`), o que a rule 038 (CQS)
proíbe. Cai na exceção documentada da própria regra — "métodos de leitura que têm o efeito
colateral de atualizar um cache interno" — e a alternativa, um `renew()` explícito chamado
por `[abort]`, moveria a responsabilidade para o chamador e criaria o risco de esquecê-la.
Registrado como desvio consciente, não como achado a corrigir.

### Estado compartilhado

`#headers` é escrito por N filhos sem coordenação: a última escrita de uma mesma `key`
vence, na ordem de conexão. Não é violação da rule 070 — o objeto é privado e alcançado só
pelo contrato `[setHeader]` — mas é o motivo de dois `<kb-headers>` com a mesma `key` não
serem um erro detectável (`src/data/headers/DESIGN.md:240`, Edge case 5 de lá).

---

## 5. Edge Cases

| # | Caso | Comportamento requerido |
|---|---|---|
| 1 | Duas chamadas concorrentes no mesmo elemento | A segunda cancela a primeira (`fetch.ts:38-41`). É o desenho, e é o que torna busca-enquanto-digita correta: só a consulta mais nova pode resolver. O reverso — dois consumidores compartilhando um `<kb-fetch>` — é uso incorreto; a documentação orienta um elemento por requisição concorrente |
| 2 | Requisição falha | `failed` é despachado com `detail: null` (`fetch.ts:48`, `packages/http/http.js:30`/`:32`). O ouvinte nunca sabe o porquê. Comportamento atual documentado; parece defeito, não decisão — candidato a correção, com o `tester` provando o antes e o depois |
| 3 | `await fetcher.get(...)` | **Não devolve `{ data, error }`** — devolve o elemento, por `@after` substituir o retorno (`packages/middleware/after.js:9`, `fetch.ts:51`). Contradiz `types.d.ts:46` e a documentação. Ver divergência 1 da seção 2 |
| 4 | `url` vazia | Sem guarda. `interpolate('', payload)` devolve `''` (`packages/interpolate/interpolate.js:12-15`) e `fetch('')` requisita a própria página. Não há validação em `fetch.ts` |
| 5 | Placeholder sem correspondente no payload | Vira string vazia, nunca a literal `"undefined"` (`packages/interpolate/interpolate.js:14`). Deliberado e documentado no pacote `@interpolate` |
| 6 | Resposta não-JSON | O `response.json()` lança, o `.catch()` de `@http` captura, e o resultado vira `{ data: null, error }` (`packages/http/http.js:26`, `:32`) — indistinguível de falha de rede pelo evento, já que ambos despacham `null` |
| 7 | `requestIdleCallback` indisponível | **Sem guarda e sem polyfill.** `fetch.ts:45` chama a API diretamente; `packages/polyfill/` contém só `pushStateEvent.js` e `setImmediate.js`. Em ambiente sem `requestIdleCallback` — Safari anterior a 16.4, e boa parte dos runners de teste headless — a chamada lança e **nenhum evento é despachado**. É provavelmente a razão pela qual escrever `fetch.test.js` exige decidir isso antes |
| 8 | `<kb-headers>` removido do DOM | O header permanece em `#headers`. Não há contrato inverso de `[setHeader]` em `interfaces.js`, e nenhum `@disconnected` no filho (`src/data/headers/DESIGN.md:241`). Omissão deliberada hoje |
| 9 | `<kb-fetch>` removido do DOM com requisição em voo | A requisição **não** é abortada. `Echo.disconnectedCallback` desfaz os arcos (`packages/echo/echo.js:22-30`), mas nada chama `[abort]`; não há `@disconnected` em `fetch.ts`. A resposta chega, `[dispatch]` roda e despacha em um elemento desconectado — sem ouvintes de DOM, mas o eco no barramento ainda acontece (`packages/echo/echo.js:38`) |
| 10 | `[setHeader]` chamado por um filho que não é `<kb-headers>` | Aceito sem verificação (`fetch.ts:31-34`). O contrato é aberto por desenho: qualquer elemento que resolva `Symbol.for('setHeader')` pode contribuir. É o preço, já registrado, do registro global |
| 11 | Credencial real em `<kb-headers value="...">` | Fica em texto puro no HTML servido. Fora do alcance deste elemento; a documentação orienta contra, e a rule 071 impede que qualquer exemplo do repositório use chave de consumidor real |
| 12 | Leitor de tela | Não anuncia nada, e é o correto. O risco real é a falha silenciosa — ver seção 3, `role`/`Identity` |

### Cobertura — a lacuna estrutural do pacote

**Confirmado nesta execução**: `find . -name "fetch.test.js"` não retorna nada. O pacote
`src/data/fetch/` não tem teste próprio, e é o achado adjacente que
`src/data/headers/DESIGN.md:273-277` deixou em aberto.

O que existe hoje é indireto: `src/data/headers/headers.test.js` exercita `<kb-fetch>` só
na superfície necessária para provar o filho — entrega de header e `get()` com
`globalThis.fetch` mockado. Não cobre `delete`/`post`/`put`, o ciclo de `abort`, a
interpolação de URL, o par `succeeded`/`failed`, nem o adiamento por
`requestIdleCallback`.

Não é acaso que as três divergências da seção 2 tenham sobrevivido: **cada uma delas cai
no primeiro teste que alguém escrever**. Um `await fetcher.get(...)` num teste falha na
primeira asserção sobre `data`; um teste que leia `fetcher.controller` recebe `undefined`.
A ordem sugerida ao `tester` é essa — provar o contrato documentado primeiro, e deixar as
falhas resultantes definirem o escopo do `developer`.

---

### Revisão de `designer`: não se aplica

Como `kb-on` e `kb-headers`, este pacote não tem token, custom property, cor, shadow root
nem estado visual. A única declaração de estilo é o `display: none` que `Headless` aplica
(`packages/mixin/headless/headless.ts:9`). Não há revisão de `designer` pendente, e não
deve ser aberta uma.

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável | Status |
|---|---|---|
| Contrato público, cadeia de mixins, Symbols, forma do wiring pai/filho | `architect` | Concluído |
| Confirmação de que `Echo` é justificado aqui (ao contrário de `kb-headers`) | `architect` | Concluído — usado nos dois sentidos, entrada e saída |
| Confirmação de que `Identity`/`role` não se aplica | `architect` | Concluído — ausência correta |
| Decisão de não extrair os quatro verbos para um método genérico | `architect` | Concluído — a repetição é o preço da superfície tipada; extrair criaria argumento de despacho |
| `fetch.test.js` — o pacote não tem teste próprio | `tester` | **Pendente** — lacuna estrutural mais antiga do pacote; começar pelo contrato de `types.d.ts` |
| Retorno dos verbos ser `this` em vez da promise (`fetch.ts:51` + `packages/middleware/after.js:9`) | `tester` → `developer` | **Aberto** — divergência mais grave; provar com teste antes de mexer |
| `types.d.ts` declara `controller` inexistente e "Reflects" incorreto; omite `on` e `[setHeader]` | `developer` | **Aberto** — três correções de tipo, nenhuma de runtime |
| `detail` de `failed` ser `null` em vez do erro | `architect` → `developer` | **Aberto** — decidir se é correção de defeito ou mudança de contrato antes de tocar no código |
| Ausência de guarda/polyfill para `requestIdleCallback` (`fetch.ts:45`) | `architect` → `builder` | **Aberto** — decidir entre polyfill em `packages/polyfill/` e fallback inline; bloqueia o teste do caminho de evento |
| Comentário de `[abort]` descrever substituição que acontece em `controller.js:5` | `developer` | **Aberto** — trivial, cabe na Regra do Escoteiro do próximo toque em `fetch.ts` |
| Requisição em voo não abortada ao desconectar (Edge case 9) | `architect` | **Não decidido** — hoje é omissão; vira lacuna quando um consumidor remover o elemento durante uma busca |

---

**Nota adicional do `architect`**: `src/behavior/on/on.ts:31` não tem a guarda
`if (!parent) return this` que `src/behavior/on/DESIGN.md:182` afirma existir — ele acessa
`this.parentElement.localName` direto; `src/data/headers/headers.ts:43` tem a guarda. O
arquivo `on.ts` está modificado no working tree; vale conferir antes de confiar naquele
Edge case daquele documento.

---

**Criado em**: 2026-09-05
**Atualizado em**: 2026-09-05
**Versão**: 1.0
