# DESIGN — `kb-find`

**Pacote**: `src/data/find/`
**Tag**: `<kb-find>`
**Status**: documentação retroativa — a implementação precede este documento
**Data**: 2026-09-05
**Atualizado**: 2026-09-06 — `@debounce(100)` aplicado a `[dispatch]`; `find.test.js` adicionado

---

Este documento segue o framework LLD (5 passos) e descreve `kb-find` como ele existe hoje.
O pacote foi escrito antes de qualquer processo formal de design neste repositório e nunca
teve especificação própria. O objetivo é duplo: registrar a forma já implementada, sem
redesenhá-la, e apontar com evidência onde ela está descoberta ou incoerente com o gêmeo
estrutural direto, `kb-filter` (`src/data/filter/`) — que aqui não é "gêmeo" por analogia,
é cópia literal com três tokens trocados.

A partir desta versão vale a mesma regra dos outros: quando implementação e documento
divergirem, é a implementação que está errada. Mudança de comportamento passa primeiro por
uma revisão deste documento, depois pelo código.

## Visão Geral

`kb-find` é um **child declarativo headless de consulta**: um elemento que nunca renderiza,
existe só no markup, e cuja função é **ler a coleção do pai e publicar um resultado nele**.
Ao ter `value` escrito, ele espera o pai subir (`customElements.whenDefined`), roda
`parentElement.value.find(...)` procurando o primeiro registro cujo campo `key` seja
estritamente igual a `value`, e despacha `found` **no pai**, com o registro como `detail`
(`find.ts:35-42`). `[dispatch]` é decorado com `@debounce(100)` (`find.ts:34`), coalescendo
em uma única execução duas escritas de `value` feitas na mesma janela de 100ms — o mesmo
padrão de `kb-headers` (`headers.ts:45`) e de `kb-filter` (`filter.ts:35`).

Duas coisas o distinguem dos outros children declarativos do repositório:

1. **O gatilho não é a conexão, é a escrita de `value`.** `kb-on` e `kb-headers` fazem o
   wiring uma vez, em `@connected`. Aqui o disparo vem de `@around(dispatch)` no setter de
   `value` (`find.ts:26-30`), então cada nova atribuição refaz a busca. É o que torna o
   elemento útil como "detalhe dirigido por seleção", o caso de uso que a documentação
   descreve (`website/docs/components/find.mdx`, seção "Driving it from a selection").
2. **Ele lê o pai.** `kb-on` e `kb-headers` só escrevem no pai, via `Symbol.for`. `kb-find`
   acessa `this.parentElement.value` diretamente (`find.ts:36`) — sem Symbol, sem contrato
   nomeado, acoplado à propriedade pública `value` de quem quer que seja o pai.

O que ele **não** é: um elemento de dados. Não guarda coleção, não tem shadow root, não tem
papel ARIA, não é focável, não participa de `<form>`, não renderiza nada — `Headless` lhe
aplica `display: none` inline no `@connected` (`packages/mixin/headless/headless.ts:7-10`).
Também não é um filtro: devolve **um** registro (ou `undefined`), não um array — é a única
diferença de comportamento em relação a `kb-filter`.

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | O autor de markup que já tem uma coleção em memória num `<kb-dataset>` e precisa extrair dela um registro por igualdade de campo — tipicamente para alimentar uma view de detalhe |
| Somente leitura ou interativo | Declarativo, mas **reativo**: diferente de `kb-on`/`kb-headers`, reage a cada escrita de `value`, inclusive vinda de um arco `Echo` |
| Caso de uso mínimo (MVP) | Ler `key`/`value` do markup, buscar em `parentElement.value` e despachar `found` no pai |
| Participa de `<form>` | Não |
| Papel e nome acessível | Nenhum, e corretamente nenhum — ver seção 3 |
| Superfície de variação | `key` e `value`, mais o `on` herdado de `Echo`; nada mais |
| Sub-elemento interno | Nenhum. Sem `attachShadow`, sem template, sem estilo próprio (`find.ts` inteiro tem 45 linhas) |

**Requisitos funcionais**

1. Expõe `key` e `value` como propriedades string, sincronizadas a partir dos attributes
   homônimos via `@attributeChanged` (`find.ts:17`, `find.ts:26`).
2. Escrever `value` agenda a busca: `@around(dispatch)` chama `this[dispatch](value)` via
   `setImmediate`, depois que o setter original retorna
   (`packages/middleware/around.js:5-14`).
3. `[dispatch]` é decorado com `@debounce(100)` (`find.ts:34`): duas escritas de `value`
   dentro de 100ms coalescem numa única busca, em vez de despachar `found` duas vezes.
4. Antes de ler o pai, aguarda `customElements.whenDefined(this.parentElement?.localName)`
   — a busca depende do pai já expor a coleção (`find.ts:36`).
5. Compara com `===` o campo `key` de cada registro contra `value`, por desestruturação
   computada `({ [this.key]: value }) => value === this.value` (`find.ts:37-39`).
6. Despacha `found` **no pai**, `bubbles`/`cancelable`, com o registro em `detail`
   (`find.ts:40`, `packages/event/customEvent.js:3-8`).
7. Nunca renderiza: `Headless` aplica `display: none` inline ao conectar.
8. Não muta `this` além dos dois campos privados — o efeito observável é o evento no pai.

**Não-requisitos (YAGNI, rule 023)**

- Predicado além de igualdade estrita. A documentação declara isso explicitamente como
  limite do elemento (`website/docs/components/find.mdx`, "When not to use": *"The
  comparison is a strict `===`"*).
- Múltiplos resultados. É a razão de `kb-filter` existir separado.
- Re-executar quando a coleção do pai muda. A busca só roda na escrita de `value` — a
  documentação registra e orienta o contorno (`find.mdx`, seção "When it re-evaluates":
  *"re-assign `value` to force a new pass"*). Ver Edge case 7.
- Re-executar quando `key` muda. O setter de `key` (`find.ts:17-20`) **não** tem
  `@around(dispatch)`; só `value` tem. Diferente de `kb-filter`, onde os dois setters têm
  `@around(dispatch)` (`filter.ts:17-18`, `:27-28`) — assimetria entre os gêmeos, não
  registrada como decisão em nenhum dos dois lugares. Ver Edge case 8.
- Papel ARIA, `alt`, `Identity`. Um elemento que nunca chega à árvore de renderização não
  tem o que anunciar.
- Slot, `part`, custom property, token. Sem shadow root, não há superfície visual nenhuma —
  este pacote não tem, e não deve ter, revisão de `designer`.

---

## 2. Contrato Público

### Attributes / Properties

| Nome | Tipo | Default | Reflete | Especificação |
|---|---|---|---|---|
| `key` | `string` | `undefined` | não | Nome do campo do registro a comparar. Setter decorado com `@attributeChanged('key')`, grava em `#key` (`find.ts:10`, `find.ts:17-20`). **Sem gatilho de busca** |
| `value` | `string` | `undefined` | não | Valor comparado contra o campo `key` de cada registro. Setter decorado com `@attributeChanged('value')` **e** `@around(dispatch)` (`find.ts:26-30`) — escrever dispara a busca |
| `on` | `string` | — | não | Herdado de `Echo`. Arco `source/event:type/sink`, registrado como observed attribute pelo mixin (`packages/echo/echo.js:9`, `packages/echo/interfaces.js:8`). É por aqui que uma seleção alimenta `value` — `on="kb-card/clicked:setter/value"` (`find.mdx`, "Driving it from a selection") |

**Divergência com o padrão de getter do repositório, mantida por decisão.** `kb-on` e
`kb-headers` usam `??= ''` no getter, garantindo `''` antes de qualquer escrita. `kb-find`
não: `get key()` e `get value()` devolvem o campo cru (`find.ts:13-15`, `find.ts:22-24`),
ou seja `undefined` até a primeira atribuição. `kb-filter` tem exatamente o mesmo desvio
(`filter.ts:13-24`) — é um par, não um caso isolado. `types.d.ts` (corrigido em
2026-09-06) documenta `@default undefined` para os dois, em vez de mentir `string`.

**JSDoc corrigido (2026-09-06).** `types.d.ts:18`/`:22-25` diziam *"Reflects the `key`/`value`
attribute"*; agora dizem "Synced from" — `@attributeChanged` é one-way, do attribute para a
propriedade (`packages/directive/attributeChanged/execute.js:26-44`); escrever a propriedade
não escreve o attribute de volta. Idêntico em `src/data/filter/types.d.ts`.

`types.d.ts` agora expõe `on: KUBAFindOnAttribute | (string & {})`, refletindo a cadeia real
`Echo(Headless(HTMLElement))` (`find.ts:9`), no mesmo padrão de `KUBAHeadersOnAttribute`.

**Rule 037 (flag arguments)**: nenhum attribute booleano no contrato.

### Events

| Evento | Alvo | `detail` | Bubbles / Cancelable |
|---|---|---|---|
| `found` | **`parentElement`**, não `this` (`find.ts:40`) | O primeiro registro casado, ou `null` quando não há casamento — `CustomEvent` normaliza `detail: undefined` para `null` (`Array.prototype.find` devolve `undefined`) | Sim / sim (`packages/event/customEvent.js:3-8`) |

**A inversão do alvo é o ponto mais escorregadio do contrato** e a documentação a trata
como tal, com aviso próprio (`find.mdx`, "The parent inversion": *"An arc pointing at the
find element's own `name` never fires. This is the most likely reason a detail view stays
empty."*). Como o despacho é feito no pai e o pai é `Echo` (`<kb-dataset>` é
`Echo(Headless(HTMLElement))`, `dataset.ts:11`), é o **pai** que ecoa o evento no barramento
compartilhado (`packages/echo/echo.js:35-50`), e é o nome do pai que um arco deve nomear
como `source`.

### Slots e Parts

Nenhum dos dois, e nenhum shadow root. Conteúdo colocado entre as tags fica no light DOM de
um elemento com `display: none`, ou seja, invisível e inerte. A documentação declara
"**Can contain**: nothing" (`find.mdx`, "Composition").

### Symbols publicados

| Symbol | Forma | Alcance | Papel |
|---|---|---|---|
| `dispatch` | `Symbol('dispatch')` | Módulo | Chave do método assíncrono que faz a busca e despacha. Interno; nenhum outro pacote o toca (`interfaces.js:1`) |

**Nenhum `Symbol.for`, e é coerente.** `kb-on` e `kb-headers` precisam de registro global
porque invocam um método do pai que só o pai conhece (`connectArc`, `setHeader`).
`kb-find` não invoca contrato nenhum: lê a propriedade pública `value` e chama
`dispatchEvent`, ambos alcançáveis sem Symbol. Não há aresta de import entre `find` e
`dataset` — o DAG (rule 018) está preservado.

**O custo dessa escolha, registrado como fato e não como defeito:** o acoplamento existe
mesmo assim, só que não é nomeado. `find.ts:37` assume que `parentElement.value` é um array.
Um contrato explícito (`Symbol.for('records')`, por exemplo) tornaria a expectativa
verificável e o `?.` possível; hoje um pai sem `value` array produz `TypeError` (Edge case 4).
Não é recomendação de mudança — é o que este documento existe para deixar rastreável.

### Symbols consumidos

| Symbol | Origem | Uso |
|---|---|---|
| `hideable` | `packages/mixin/headless/interfaces.js` | Via `Headless`; não referenciado por nome em `find.ts` |
| `connectArc` / `disconnectArc` / `on` | `packages/echo/interfaces.js:4-8` | Via `Echo`; não referenciados por nome em `find.ts` |

---

## 3. Composição

**Cadeia**: `Echo(Headless(HTMLElement))` (`find.ts:9`)

| Mixin | Traz | Avaliação |
|---|---|---|
| `Headless` | Hook `@connected [hideable]()` que aplica `display: none` inline no host (`packages/mixin/headless/headless.ts:7-10`) | **Necessário e suficiente.** É a razão de ser da forma: o elemento existe no markup e não pode ocupar espaço nem aparecer |
| `Echo` | Attribute observado `on` + `[connectArc]`/`[disconnectArc]`, e o eco de `dispatchEvent` no barramento compartilhado (`packages/echo/echo.js:9-50`) | **Necessário — e aqui, ao contrário de `kb-headers`, com consumidor real** |

### Por que `Echo` fica, quando saiu de `kb-headers`

`Echo` foi removido de `kb-headers` (`src/data/headers/DESIGN.md`, seção 3) por duas
razões: o elemento nunca despachava evento, e o attribute `on` era inefetivo porque o
wiring rodava uma vez só, em `@connected`. **Nenhuma das duas se aplica a `kb-find`**, e
vale checar as duas metades de `Echo` separadamente:

- **Metade "receber arco" (`on`)**: usada, e é o caso de uso central. Como o gatilho da
  busca é o *setter* de `value` (`find.ts:26-27`) e não a conexão, um arco
  `on="kb-card/clicked:setter/value"` chegando depois da conexão **funciona** — escreve
  `value`, o `@around` agenda `dispatch`, o `@debounce(100)` coalesce se houver outra
  escrita próxima, e a busca roda. É exatamente o wiring que a documentação ensina
  (`find.mdx`, "Driving it from a selection"). Removê-lo seria remover o elemento útil.
- **Metade "ecoar `dispatchEvent`"**: **não usada por este elemento.** `find.ts:40` chama
  `this.parentElement.dispatchEvent(...)`, não `this.dispatchEvent(...)` — quem ecoa é o
  `Echo` do pai, não o deste. Herança parcialmente não usada, sim; mas não é herança
  recusada no sentido da rule 059, porque a metade usada é indivisível da não usada: `Echo`
  é um mixin só, e não há `EchoSink` separado no repositório. Extrair um seria abstração
  sem segundo consumidor (rule 064) — `kb-filter` e `kb-find` teriam o mesmo perfil, e são
  os dois únicos.

Conclusão: **cadeia correta como está**, e a assimetria com `kb-headers` é justificada pela
diferença de gatilho, não por inconsistência.

### `role`/`Identity`: ausência correta

Não implementar `get [role]()` nem entrar com `Identity` é a decisão certa, pelas mesmas
três razões que valem para `kb-on` e `kb-headers`: `display: none` tira o elemento da árvore
de acessibilidade, não há conteúdo para nomear, e é um child declarativo de configuração,
não de apresentação. `kb-find`, `kb-filter`, `kb-dataset`, `kb-fetch`, `kb-headers` e
`kb-on` usam todos `Headless` e nenhum usa `Identity` — a separação entre as duas famílias
de mixin é limpa no repositório inteiro.

### `attachInternals()`

Não existe no pacote. Sem papel e sem estado ARIA, não há o que anexar.

### Duplicação com `kb-filter` — medida, e ainda abaixo do limiar, mas não mais idêntica

`src/data/find/find.ts` e `src/data/filter/filter.ts` deixaram de ser byte a byte o mesmo
arquivo: além dos tokens de nome (tag, classe, verbo no comentário,
`Array.prototype.find`/`filter`, `found`/`filtered`), `kb-filter` decora **os dois** setters
(`key` e `value`) com `@around(dispatch)` (`filter.ts:18`, `:28`), enquanto `kb-find` decora
só `value` (`find.ts:27`) — ver Requisitos e Edge case 8. Os dois continuam com `@debounce(100)`
em `[dispatch]` (`find.ts:34`, `filter.ts:35`) e o mesmo `interfaces.js` de uma linha.

A rule 021 fala em lógica repetida em **mais de dois** lugares antes de exigir extração —
são exatamente dois. Extrair hoje um mixin `Query(HTMLElement)` parametrizado pelo método
de coleção e pelo nome do evento cairia em rule 064 (abstração sem problema concreto) e
provavelmente em rule 037 (o parâmetro que escolhe `find` vs `filter` é um flag disfarçado).
**Um terceiro elemento do mesmo formato** — um `<kb-sort>`, um `<kb-count>` — muda a conta e
deve reabrir esta decisão. Registrado aqui para que a reabertura tenha de onde partir.

---

## 4. Gestão de Estado

| Dado | Onde mora | Controlado? | Regra de sincronização |
|---|---|---|---|
| `key` | `#key` privado + attribute `key` | Controlado — DOM é a fonte da verdade | `@attributeChanged('key')` grava no campo via `context[property] = value` (`packages/directive/attributeChanged/execute.js:37-39`). Não reflete de volta. **Não redispara a busca** |
| `value` | `#value` privado + attribute `value` | Idem | Idem, **mais** `@around(dispatch)`: agenda `[dispatch]` via `setImmediate` a cada escrita (`packages/middleware/around.js:10`), coalescido por `@debounce(100)` (`find.ts:34`) |
| A coleção pesquisada | `#storage` do `<kb-dataset>`, exposta por `get value()` (`dataset.ts:24-26`, `storage.js:7-9`) | Não é deste elemento | Lida a cada `[dispatch]`, nunca cacheada. `Storage#values` devolve `[...this.#map.values()]`, ou seja, um array novo por leitura |
| O resultado | Nenhum lugar | — | Não é guardado. Vai só no `detail` do evento (`find.ts:40`) — não há propriedade `result` nem `found` no elemento |

**Estado derivado**: nenhum persistido. O resultado é efêmero por desenho: quem quiser
guardá-lo escuta `found` no pai.

**Estado compartilhado**: `kb-find` **lê** estado de outro elemento (`parentElement.value`)
mas não o muta — a leitura é de um array recém-construído por `Storage#values`
(`storage.js:8`), então nem o `Map` interno do pai fica exposto. Sem violação da rule 070.

**Ordem e assincronia.** O caminho completo de uma escrita de `value` é: setter grava `#value`
e retorna → `setImmediate` agenda a chamada de `[dispatch]` → `@debounce(100)` reagenda essa
chamada 100ms à frente (cancelando qualquer chamada pendente da mesma instância) → no disparo,
`await whenDefined` → leitura + despacho. São três pontos de deferimento antes do evento
chegar, um a mais do que a versão anterior deste documento registrava. Consequência prática:
**`found` nunca é síncrono em relação à atribuição** — nem mesmo um tick depois —, e um teste
que escreva `el.value = '2'` e assira logo em seguida falha. É provavelmente por isso que o
exemplo da documentação embrulha a escrita em `requestAnimationFrame` (`find.mdx`, bloco
`preview`).

Não há `internals.states`, não há `@repaint`/`@retouch`, não há template.

---

## 5. Edge Cases

| # | Caso | Comportamento atual |
|---|---|---|
| 1 | Pai ainda não upgradado quando `value` é escrito | Coberto por desenho: `await customElements.whenDefined(this.parentElement?.localName)` (`find.ts:36`) é a razão de `[dispatch]` ser `async`, e o único ponto do arquivo com comentário explicando o porquê (`find.ts:32-33`) |
| 2 | Nenhum registro casa | `Array.prototype.find` devolve `undefined`, e o evento `found` **é despachado mesmo assim**, com `detail: null` (`customEvent` normaliza `undefined` para `null`). A documentação declara isso ("one record, or undefined", `find.mdx`, "Usage") — vale ler "undefined" ali como "sem correspondência", já que o `detail` observável é `null`. Não há guarda, e não deve haver: "não achei" é informação que o consumidor quer |
| 3 | **Sem pai** (elemento conectado direto num shadow root, ou solto) | **Não guardado.** `this.parentElement?.localName` é `undefined`, `customElements.whenDefined(undefined)` rejeita, e a rejeição é *unhandled* — nem `around.js:11` nem `debounce.js:14-22` retornam o resultado da chamada agendada, então ninguém tem a promise para tratar. Divergência real com `kb-on`/`kb-headers`, que ambos têm `if (!parent) return this`; aceita no mesmo termo que `kb-headers` (`headers.ts:42-44`) |
| 4 | Pai que é elemento HTML comum (`<div>`), ou custom element sem `value` array | **Não guardado, e falha de dois modos.** `whenDefined('div')` rejeita com `SyntaxError` (`'div'` não é nome válido de custom element) — mesma rejeição não tratada do caso 3. Um custom element válido mas sem `value` array chega adiante e estoura `TypeError` em `find.ts:37`, porque não há `?.` ali. Nota: nos pacotes `on` e `headers` a guarda de custom element foi **removida a pedido do consumidor** (2026-08-27), que aceita a rejeição; aqui ela nunca existiu, então o estado atual está alinhado com aquela decisão por acidente, não por escolha |
| 5 | `key` aponta para campo inexistente nos registros | A desestruturação computada devolve `undefined` para todo registro; casa apenas se `this.value` também for `undefined` — o que acontece antes da primeira escrita de `value`, mas nesse caso a busca nem roda. Na prática: nenhum casamento, `found` com `detail: null` |
| 6 | Comparação de tipos | `===` estrito entre o campo do registro e `value` (`find.ts:38`). `value` vem do attribute, sempre string; um registro com `{ id: 1 }` numérico **nunca** casa com `value="1"`. O exemplo da documentação usa ids string (`{ id: '1' }`) — a armadilha existe e não está documentada |
| 7 | Registro empurrado ao pai **depois** da busca | Não redispara. A documentação declara o contorno: reescrever `value` (`find.mdx`, "When it re-evaluates"). Note que reescrever o *mesmo* valor funciona — o setter não compara antes de gravar, então `@around` agenda de qualquer jeito |
| 8 | `key` alterado depois da conexão | **Não redispara.** Só `value` tem `@around(dispatch)` (`find.ts:26-27`); `key` não (`find.ts:17`). Diferente de `kb-filter`, onde os dois setters disparam (`filter.ts:17-18`, `:27-28`) — assimetria entre os gêmeos que nenhum dos dois documentos registra como decisão explícita. `find.test.js` congela o comportamento atual (não redispara); mudá-lo é decisão do `architect` |
| 9 | Duas escritas de `value` dentro de 100ms | **Coalescem** numa única execução de `[dispatch]`, graças a `@debounce(100)` (`find.ts:34`) — resolve o que a versão anterior deste documento registrava como "duas execuções independentes". Fora da janela de 100ms, ainda são duas buscas separadas, sem garantia de ordem de chegada dos dois `found` |
| 10 | Elemento removido do DOM | Nada a desfazer: não há assinatura própria a cancelar. O `Echo` da cadeia limpa seus próprios arcos em `disconnectedCallback` (`packages/echo/echo.js:22-30`). Um `[dispatch]` já agendado ainda roda depois da remoção, e ainda despacha no que era o pai — `this.parentElement` já é `null` nesse ponto, então o caso 3 se aplica |
| 11 | Leitor de tela | Não anuncia nada, e é o correto: `display: none` mantém o elemento fora da árvore de acessibilidade e da árvore de renderização |

### Cobertura — `find.test.js` (2026-09-06)

`src/data/find/find.test.js` cobre:

1. Com um `<kb-dataset upsert="id">` contendo dois registros, escrever `value` num
   `<kb-find key="id">` filho despacha `found` **no dataset** com o registro casado.
2. O evento nunca é despachado no próprio `<kb-find>`.
3. Sem casamento, `found` é despachado com `detail: null` (achado 2, corrigido de
   "`undefined`" para o valor real observável).
4. Duas escritas de `value` dentro da janela de `@debounce(100)` coalescem numa única
   busca — prova direta do achado 9.
5. Alterar `key` sozinho **não** despacha `found` — congela o Edge case 8 como comportamento
   atual, sem decidir se deveria ser diferente.

**Fora da cobertura, deliberadamente**: os Edge cases 1, 3, 4 (pai ausente/inválido, unhandled
rejection), 6 (armadilha de tipo `===`) e 7 (registro empurrado depois da busca) não têm
teste — os três primeiros dependem de decisão do `architect` sobre guardas; o sexto é
achado de documentação (`writer`); o sétimo é comportamento já coberto por `filter.test.js`
no gêmeo, sem consumidor que o exija aqui ainda.

`headers.test.js` foi o precedente de forma para o setup (pai custom element, filho
declarativo, asserção sobre efeito no pai); `filter.test.js` é o precedente mais próximo,
por ser o mesmo desenho.

---

### Revisão de `designer`: não se aplica

Este pacote não tem token, custom property, cor, shadow root nem estado visual. A única
declaração de estilo é o `display: none` que `Headless` aplica. Não há revisão de `designer`
pendente, e não deve ser aberta uma.

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável | Status |
|---|---|---|
| Contrato público, cadeia de mixins, Symbols, forma do wiring pai/filho | `architect` | Concluído |
| Justificar `Echo` na cadeia, dado que saiu de `kb-headers` | `architect` | Concluído — **fica**: o attribute `on` tem consumidor real porque o gatilho é o setter, não `@connected` (seção 3) |
| Confirmação de que `Identity`/`role` não se aplica | `architect` | Concluído — ausência correta |
| Ausência de `Symbol.for` para ler `parentElement.value` | `architect` | Concluído — coerente hoje; o acoplamento não nomeado está registrado (seção 2) como fato conhecido, não como pendência |
| Duplicação integral com `kb-filter` | `architect` | Concluído — **não extrair agora** (dois consumidores, rule 021/064). Reabrir ao surgir um terceiro child de consulta |
| `@debounce(100)` sobre `[dispatch]` | `developer` | Concluído — mesmo padrão de `kb-headers` e `kb-filter` |
| Teste do pacote | `tester` | Concluído — `find.test.js`, cinco casos, seção 5 |
| `types.d.ts` diz "Reflects the attribute" onde a sincronização é one-way | `writer` | Concluído — corrigido em 2026-09-06, junto com `src/data/filter/types.d.ts` |
| `types.d.ts` declara `extends HTMLElement` sem `on` nem membros de `Echo` | `writer` | Concluído — corrigido em 2026-09-06 |
| Guarda de `parentElement` nulo, presente em `kb-on` e `kb-headers` e ausente aqui | `architect` + `developer` | **Pendente** — Edge case 3; o `if (!parent) return this` dos gêmeos não foi replicado |
| `parentElement.value` sem `?.` → `TypeError` sob pai sem coleção | `architect` + `developer` | **Pendente** — Edge case 4, segunda metade |
| `key` não redisparar a busca em `kb-find`, enquanto redispara em `kb-filter` | `architect` | **Em aberto** — Edge case 8; decidir se `kb-find` ganha o mesmo gatilho de `kb-filter`, ou se a assimetria fica documentada como desenho |
| Getters sem `??= ''`, contra o padrão de `kb-on`/`kb-headers` | `developer` | **Pendente de decisão** — compartilhado com `kb-filter`; `types.d.ts` já documenta o default real (`undefined`), então deixou de ser mentira de tipo, mas a divergência de contrato entre gêmeos da família continua |
| Armadilha de `===` entre attribute string e campo numérico (Edge case 6) | `writer` | **Pendente** — não documentada em `find.mdx` |
| `fetch` também sem teste | `tester` | **Pendente** — achado adjacente, fora do escopo de `kb-find` |

---

**Nota do `architect`**: o Edge case 8 (`key` não redispara em `kb-find`, mas redispara em
`kb-filter`) é a única coisa que resta sem classificação como decisão ou bug — não há
comentário no código nem menção na documentação de nenhum dos dois pacotes. `find.ts` e
`filter.ts` divergiram nesse ponto especificamente; qualquer decisão tomada aqui deve ser
aplicada aos dois na mesma passada, ou a divergência vira permanente por omissão.

---

**Criado em**: 2026-09-05
**Atualizado em**: 2026-09-06
**Versão**: 1.1
