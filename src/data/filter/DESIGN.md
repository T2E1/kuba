# DESIGN — `kb-filter`

**Pacote**: `src/data/filter/`
**Tag**: `<kb-filter>`
**Status**: documentação retroativa — a implementação precede este documento
**Data**: 2026-09-05
**Atualizado**: 2026-09-06 — `@debounce(100)` aplicado a `[dispatch]`; `filter.test.js` adicionado

---

Este documento segue o framework LLD (5 passos) e descreve `kb-filter` como ele existe hoje. O pacote foi escrito antes de qualquer processo formal de design neste repositório e nunca teve especificação própria. Desde 2026-09-06 tem teste (`src/data/filter/filter.test.js`). O objetivo é duplo: registrar a forma já implementada, sem redesenhá-la, e apontar com evidência onde ela está descoberta ou incoerente com seu gêmeo estrutural direto, `kb-find` (`src/data/find/find.ts`).

A partir desta versão vale a mesma regra dos outros: quando implementação e documento divergirem, é a implementação que está errada. Mudança de comportamento passa primeiro por uma revisão deste documento, depois pelo código.

## Visão Geral

`kb-filter` é um **child declarativo headless** — mesma família de `kb-headers` e `kb-on` —, mas com uma diferença que muda a classificação: os outros dois **mutam o pai**; este **lê o pai e publica no pai**. Ao ter `key` ou `value` atribuídos, ele espera o pai subir (`customElements.whenDefined`, `filter.ts:37`), lê `parentElement.value` como coleção de registros, seleciona os que satisfazem `record[key] === value` (`filter.ts:38-40`) e despacha `filtered` **no pai**, com o array de resultados no `detail` (`filter.ts:41`). `[dispatch]` é decorado com `@debounce(100)` (`filter.ts:35`), coalescendo em uma única passada duas atribuições feitas dentro da mesma janela de 100ms — o mesmo padrão de `kb-headers` (`headers.ts:45`).

O que ele **não** é: um elemento de dados. Não guarda coleção — a coleção é do `<kb-dataset>`, que a expõe via `get value()` a partir de seu `Storage` (`src/data/dataset/dataset.ts:24-26`). Não tem shadow root, não tem papel ARIA, não é focável, não participa de `<form>`, não renderiza nada — `Headless` lhe aplica `display: none` inline no `@connected` (`packages/mixin/headless/headless.ts:7-10`).

Duas escolhas estruturam o pacote, e as duas são o oposto do desenho de `kb-headers`:

1. **A leitura mora no filho, e o anúncio também.** `<kb-dataset>` não sabe que existem filtros; não varre filhos e não expõe contrato de filtragem. O filho é que alcança `parentElement.value` diretamente — sem Symbol, sem contrato, por propriedade pública nomeada. Isso mantém `kb-dataset` fechado para modificação (rule 011) e o grafo acíclico (rule 018) — `filter.ts` não importa nada de `src/data/dataset/` —, mas o acoplamento é **estrutural e não declarado**: a única coisa que liga os dois é o nome `value` e a suposição de que ele é um array.

2. **O evento é despachado no pai, não em `this`.** É a inversão que a documentação chama de "the part that surprises everyone" (`website/docs/components/filter.mdx:4-6`) e sobre a qual abre um aviso dedicado (`filter.mdx:79-82`). Consequência direta e não óbvia: como o `dispatchEvent` roda no `<kb-dataset>`, quem ecoa o evento no barramento de `Echo` é o **`Echo` do pai** (`packages/echo/echo.js:35-50`), não o deste elemento. O `Echo` que `kb-filter` carrega na cadeia serve, na prática, para outra coisa — ver seção 3.

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | O autor de markup que precisa exibir um subconjunto de uma coleção — usuários ativos, itens disponíveis, uma categoria — por attribute em vez de por script (`filter.mdx:49-52`) |
| Somente leitura ou interativo | Nem um nem outro: é declarativo. Lê o pai, publica no pai; não tem interação própria |
| Caso de uso mínimo (MVP) | Comparar `record[key]` com `value` por igualdade estrita em toda a coleção do pai e publicar as correspondências |
| Participa de `<form>` | Não |
| Papel e nome acessível | Nenhum, e corretamente nenhum — ver seção 3 |
| Superfície de variação | `key`, `value` e o `on` que vem de `Echo`; nada mais |
| Sub-elemento interno | Nenhum. Sem `attachShadow`, sem template, sem estilo próprio |

**Requisitos funcionais**

1. Expõe `key` e `value` como propriedades string, sincronizadas a partir dos attributes homônimos via `@attributeChanged` (`filter.ts:17`, `filter.ts:27`).
2. Atribuir `key` **ou** `value` — por attribute, por JS ou por arco `Echo` — dispara uma passada de filtragem. O gatilho é o `@around(dispatch)`, presente nos dois setters (`filter.ts:18`, `filter.ts:28`) — diferente de `kb-find`, onde só `value` dispara (ver seção 3).
3. `[dispatch]` é decorado com `@debounce(100)` (`filter.ts:35`): duas atribuições de `key`/`value` feitas dentro de 100ms coalescem numa única passada, em vez de despachar `filtered` duas vezes.
4. A filtragem espera `customElements.whenDefined(this.parentElement?.localName)` antes de ler o pai (`filter.ts:37`) — no instante da atribuição o pai pode ainda não ter sido upgradado e `value` seria `undefined`.
5. O predicado é igualdade estrita de um campo só: `({ [this.key]: value }) => value === this.value` (`filter.ts:39`). Sem range, substring, case-insensitive ou lógica multi-campo — não-requisito explícito na documentação (`filter.mdx:56-59`).
6. Despacha `filtered` no **pai**, com o array de resultados (`filter.ts:41`). O evento é `bubbles: true, cancelable: true` por construção de `customEvent` (`packages/event/customEvent.js:3-8`).
7. Nunca renderiza: `Headless` aplica `display: none` inline no host, ao conectar.
8. Não muta `this` além dos dois campos privados, e não muta o pai — a coleção do `<kb-dataset>` sai intacta; o filtro produz um array novo.

**Não-requisitos (YAGNI, rule 023)**

- Re-filtrar quando a coleção do pai muda. O `<kb-dataset>` despacha `changed` em toda mutação (`src/data/dataset/dataset.ts:29`, `:35-38`, `:40`, `:46`), e `kb-filter` não escuta. Documentado como comportamento esperado (`filter.mdx:106-109`). Ver Edge case 6.
- Compor dois filtros num AND. Cada filtro publica seu próprio `filtered` no mesmo pai, independentemente (`filter.mdx:94-97`). Ver Edge case 5.
- Papel ARIA, `alt`, `Identity`. Um elemento que nunca chega à árvore de renderização não tem o que anunciar.
- Slot, `part`, custom property, token. Sem shadow root, não há superfície visual — este pacote não tem, e não deve ter, revisão de `designer`.
- Validar que `parentElement.value` é um array antes de chamar `.filter`. Ver Edge case 1 — é hoje a lacuna mais concreta do pacote.

---

## 2. Contrato Público

### Attributes / Properties

| Nome | Tipo | Default | Reflete | Especificação |
|---|---|---|---|---|
| `key` | `string` | `undefined` | não | Nome do campo do registro a comparar. Setter decorado com `@attributeChanged('key')` **e** `@around(dispatch)` (`filter.ts:17-21`). Atribuí-lo dispara filtragem (coalescida com `value` via `@debounce(100)` em `[dispatch]`) |
| `value` | `string` | `undefined` | não | Valor com que o campo `key` é comparado. Setter decorado com `@attributeChanged('value')` **e** `@around(dispatch)` (`filter.ts:27-31`); atribuí-lo também agenda uma passada de filtragem |
| `on` | arc string | — | — | Herdado de `Echo`: `observedAttributes` inclui `on`, e `attributeChangedCallback` conecta/desconecta o arco (`packages/echo/echo.js:9`, `:11-20`). Documentado em `filter.mdx:117` |

**`types.d.ts` corrigido (2026-09-06).** Três pontos, resolvidos:

1. "Reflects the `key`/`value` attribute" virou "Synced from the `key`/`value` attribute" — a sincronização é de mão única (attribute → propriedade); não há `reflect` em `filter.ts`.
2. O default documentado é `undefined` (`@default undefined`), não `''` — coerente com a ausência do `??= ''` que `kb-headers` usa. Continua sendo uma divergência real de contrato entre gêmeos da mesma família (`kb-headers` tem default `''`), mas agora o `types.d.ts` não mente sobre ela.
3. O tipo agora expõe `on: KUBAFilterOnAttribute | (string & {})`, refletindo a cadeia real `Echo(Headless(HTMLElement))` (`filter.ts:9`), no mesmo padrão de `KUBAHeadersOnAttribute`.

**Rule 037 (flag arguments)**: nenhum attribute booleano no contrato.

### Events

| Evento | Despachado em | `detail` | Bubbles / Cancelable |
|---|---|---|---|
| `filtered` | **`this.parentElement`** (`filter.ts:41`) | Array dos registros correspondentes — vazio se nenhum casa | Sim / sim (`packages/event/customEvent.js:3-8`) |

Um resultado vazio publica `[]`, não silêncio (`filter.mdx:125-126`): `Array.prototype.filter` sempre devolve array. O consumidor dispara e pode mostrar estado vazio.

Como o `dispatchEvent` roda no pai, é o `Echo` **do pai** que ecoa no barramento compartilhado, com a identidade do pai (`id`/`name`/`localName` do `<kb-dataset>`) no `detail` (`packages/echo/echo.js:35-50`). Daí a regra que a documentação destaca: o segmento `source` de um arco tem que apontar para o pai (`filter.mdx:79-82`).

### Slots e Parts

Nenhum dos dois, e nenhum shadow root. Conteúdo colocado entre as tags fica no light DOM de um elemento com `display: none` — invisível e inerte.

### Symbols publicados

| Symbol | Forma | Alcance | Papel |
|---|---|---|---|
| `dispatch` | `Symbol('dispatch')` (`interfaces.js:1`) | Módulo | Chave do método assíncrono que executa a filtragem e publica. Interno; nenhum outro pacote o toca |

**Nenhum `Symbol.for`, e está correto.** Não há contrato cross-package aqui: o encontro com o pai não é por Symbol, é por propriedade pública `value` e por `dispatchEvent`. Pela taxonomia do repositório (`.claude/skills/naming/references/taxonomia-symbol.md`), `Symbol()` local é a forma certa quando nada fora do módulo precisa resolver a chave — e a lista dos sete registros globais legítimos daquele documento não inclui `dispatch`.

O nome `dispatch` colide, por texto, com o `Symbol('dispatch')` de `src/data/find/interfaces.js:1` e com o de `src/data/dataset/interfaces.js`. Não é problema: sendo `Symbol()` e não `Symbol.for()`, cada módulo tem o seu, e a colisão é só de leitura humana.

**Ressalva de nomenclatura (rule 035).** O método `[dispatch]` faz três coisas — aguarda o upgrade, filtra e despacha — e o nome anuncia só a terceira. `[filter]`, ou a decomposição em duas etapas, descreveria melhor o que ali acontece. Registrado como achado, não como mudança pedida: `kb-find` e `kb-dataset` usam o mesmo nome para o mesmo papel, e renomear só neste pacote quebraria a simetria sem ganho.

---

## 3. Composição

**Cadeia**: `Echo(Headless(HTMLElement))` (`filter.ts:9`)

| Mixin | Traz | Avaliação |
|---|---|---|
| `Headless` | Hook `@connected [hideable]()` que aplica `display: none` inline no host (`packages/mixin/headless/headless.ts:7-10`) | **Necessário e suficiente** para o papel visual: o elemento existe no markup e não pode ocupar espaço nem aparecer |
| `Echo` | `observedAttributes` com `on`, `[connectArc]`/`[disconnectArc]` no `attributeChangedCallback`, teardown no `disconnectedCallback`, e override de `dispatchEvent` que ecoa no barramento (`packages/echo/echo.js:9-50`) | **Justificado — mas por metade do que traz.** Ver abaixo |

### `Echo`: usado para receber arco, não para ecoar

Esta é a divergência que separa `kb-filter` de `kb-headers`, e ela se resolve a favor do `Echo`:

- **A metade que não é usada**: o override de `dispatchEvent` (`packages/echo/echo.js:35-50`). `filter.ts` nunca chama `this.dispatchEvent` — chama `this.parentElement.dispatchEvent` (`filter.ts:39`). O eco acontece, mas pelo `Echo` do pai. Se `kb-filter` só tivesse essa metade, `Echo` seria herança recusada (rule 059), exatamente como foi em `kb-headers`.
- **A metade que é usada, e efetivamente**: o attribute `on`. Diferente de `kb-headers` — onde o arco chegava a um wiring `@connected` de disparo único e nunca surtia efeito —, aqui o alvo natural do arco é o setter de `key` ou de `value`, que **re-executa a filtragem a cada atribuição** graças ao `@around(dispatch)` presente nos dois. Um arco `outro/changed:setter/value` refiltra de verdade. A documentação registra esse caso como uso pretendido (`filter.mdx:51-52`).

Conclusão: `Echo` fica. Não é o caso de `kb-headers`. Vale a observação, porém, de que só uma das duas capacidades do mixin é exercida, e um leitor que assuma "tem `Echo`, logo despacha em si mesmo" erra — é justamente o erro que a documentação chama de "the single most likely reason a filter *does nothing*" (`filter.mdx:82`).

### `role`/`Identity`: ausência correta

Não implementar `get [role]()` nem entrar com `Identity` é a decisão certa, pelas mesmas três razões que valem para `kb-headers` e `kb-on`: `display: none` tira o elemento da árvore de acessibilidade; não há conteúdo para nomear; e é um child declarativo de configuração, não de apresentação. A busca por `[role]` em `src/data/` não retorna nenhuma ocorrência — os cinco elementos headless de dados (`kb-dataset`, `kb-fetch`, `kb-filter`, `kb-find`, `kb-headers`) usam `Headless` e nenhum usa `Identity`. A separação entre as duas famílias de mixin é limpa no repositório inteiro.

### `@around(dispatch)` + `@debounce(100)`: o gatilho, e o que ele custa

`around` (`packages/middleware/around.js:5-14`) não envolve a chamada sincronamente, apesar do nome — o comentário no próprio arquivo diz isso (`around.js:1-4`). Ele agenda `context[method](...args)` via `setImmediate` e **descarta o resultado**, devolvendo ao chamador o retorno do setter original. `debounce` (`packages/middleware/debounce.js:8-23`), aplicado diretamente a `[dispatch]` (`filter.ts:35`), soma uma segunda camada: coalesce, por instância, toda chamada feita dentro de `wait` ms da última numa única execução do método original — mesmo padrão de `kb-headers` (`headers.ts:45`). Consequências para este pacote:

1. **A filtragem é assíncrona por três razões acumuladas**: o `setImmediate` do `around`, o `setTimeout(100)` do `debounce`, e o `await customElements.whenDefined` dentro de `[dispatch]`. Quem atribui `key`/`value` não tem como aguardar o `filtered`; só resta escutar o evento no pai.
2. **A Promise de `[dispatch]` não é consumida por ninguém** (nem `around.js:11`, nem `debounce.js:14-22` retornam o resultado da chamada agendada). Qualquer rejeição vira unhandled rejection — é o mecanismo por trás dos Edge cases 1 a 3. A rule 028 admite exceção para padrões de event emitter, e é onde isto se encaixa, no mesmo termo aceito para `kb-headers` (`headers.ts:42-44`); a exceção cobre o desenho, não isenta de tratamento os casos que têm consumidor real — só que aqui nenhum tem.
3. **Duas atribuições de `key`/`value` dentro da mesma janela de 100ms coalescem numa única passada** — é a mudança que resolve o antigo Edge case 8 (duas passadas independentes via `setImmediate`, sem coalescência). Duas atribuições **fora** da janela ainda produzem duas passadas, sem garantia de ordem de chegada dos dois `filtered` no pai.

### Paridade com `kb-find`, o gêmeo estrutural — agora divergente por desenho

`src/data/filter/filter.ts` e `src/data/find/find.ts` continuam sendo o mesmo arquivo com a maioria dos tokens trocados, mas deixaram de ser idênticos em forma: `kb-filter` decora **os dois** setters (`key` e `value`) com `@around(dispatch)` (`filter.ts:18`, `:28`), enquanto `kb-find` decora só `value` (`find.ts:27`) — mudar `key` em `kb-find` não redispara a busca. As diferenças reais hoje:

1. `@define('kb-filter')` vs `@define('kb-find')` (`:8`).
2. `filter.ts:18` tem `@around(dispatch)` no setter de `key`; `find.ts:17` não tem.
3. `.filter(...)` vs `.find(...)` (`:38` / `:37`).
4. `customEvent('filtered', …)` vs `customEvent('found', …)` (`:41` / `:39`).
5. Ambos têm `@debounce(100)` em `[dispatch]`/`[publish]`-equivalente (`filter.ts:35`, `find.ts:34`) — isso permanece simétrico.

A assimetria de `key` não está registrada em nenhum dos dois documentos como decisão explícita — fica aqui como fato observado, não como recomendação de mudança: alinhar os dois de novo (fazendo `key` disparar em `kb-find` também, ou deixar de disparar em `kb-filter`) é decisão do `architect`.

`kb-find` também não tem teste próprio até este momento — ver achado adjacente na seção 5 de `src/data/find/DESIGN.md`.

---

## 4. Gestão de Estado

| Dado | Onde mora | Controlado? | Regra de sincronização |
|---|---|---|---|
| `key` | `#key` privado + attribute `key` | Controlado — DOM é a fonte da verdade | `@attributeChanged('key')` grava no campo; `@around(dispatch)` agenda a passada (`filter.ts:17-18`). Não reflete de volta |
| `value` | `#value` privado + attribute `value` | Idem | `@attributeChanged('value')` grava no campo; `@around(dispatch)` agenda a passada (`filter.ts:27-28`) |
| A coleção filtrada | Em lugar nenhum | — | Não é armazenada. É calculada em `filter.ts:38-40`, colocada no `detail` do evento e esquecida. O elemento não tem `#records`, `#result` nem cache |
| A coleção de origem | `#storage` do `<kb-dataset>` | — | Lida por `parentElement.value` (`filter.ts:38`), que devolve `this.#storage.values` (`dataset.ts:24-26`). Somente leitura por este elemento |

**Estado derivado**: nenhum persistido — o resultado é derivado e efêmero, o que é o desenho correto para este papel e a razão de não haver invalidação de cache a manter.

**Estado compartilhado**: `kb-filter` **lê** estado que pertence ao pai, sem ser dono dele e sem contrato que formalize a leitura. Não é violação da rule 070 — o elemento não muta nada do pai, e `Storage#values` entrega a coleção pela propriedade pública —, mas é o acoplamento estrutural apontado na Visão Geral: a única coisa que garante o funcionamento é o pai chamar de `value` uma propriedade que seja um array de objetos.

O elemento em si não tem estado observável além dos dois campos. Não há `internals.states`, não há `attachInternals()`, não há `@repaint`/`@retouch`, não há template.

---

## 5. Edge Cases

| # | Caso | Comportamento requerido |
|---|---|---|
| 1 | Pai sem `value`, ou com `value` que não é array (`<div>`, `<kb-fetch>`) | **Sem guarda — lança.** `filter.ts:38` faz `this.parentElement.value.filter(...)` sem checar nada: `TypeError` se `value` for `undefined`, ou se não for array. Como a Promise de `[dispatch]` não é propagada nem por `around` nem por `debounce`, vira unhandled rejection silenciosa. `filter.mdx:60-61` diz "with no such parent it does nothing" — **a documentação está errada aqui**; não faz nada de útil, mas lança. É a lacuna mais concreta do pacote, aceita no mesmo termo que `kb-headers` (`headers.ts:42-44`) |
| 2 | Sem pai (elemento na raiz de um shadow root ou solto) | **Sem guarda.** `filter.ts:37` protege a leitura do `localName` com `?.`, mas `customElements.whenDefined(undefined)` rejeita com `SyntaxError`, e a linha 38 nunca é alcançada. Diferente de `kb-headers`/`kb-on`, que têm `if (!parent) return this`. A rejeição é não tratada, pelo mesmo motivo do caso 1 |
| 3 | Pai que é elemento HTML comum (`<div>`) | **Sem guarda**, e coerente com a decisão do consumidor de 2026-08-27 em `kb-headers`/`kb-on`: `customElements.whenDefined('div')` rejeita com `SyntaxError` por `'div'` não ser nome válido de custom element. A guarda `CUSTOM_ELEMENT_NAME` não deve ser reintroduzida por outro meio |
| 4 | `key` ou `value` ausentes no markup | Ambos `undefined` (não `''` — ver seção 2). Se só `value` for atribuído, o predicado compara `record[undefined]`, que é `undefined`, com `value` — resultado sempre vazio, sem erro |
| 5 | Dois `<kb-filter>` sob o mesmo pai | Cada um publica seu próprio `filtered` no mesmo pai, independentemente — não compõem AND. No consumidor, o último a chegar vence (`filter.mdx:94-97`). Não é erro detectável em runtime, e não deve haver guarda (rules 023/064): é uso incorreto, verificável por review |
| 6 | `push`/`delete`/`reset` no `<kb-dataset>` depois da filtragem | O resultado publicado fica **obsoleto**. O dataset despacha `changed`, não `filtered` (`dataset.ts:35-38`); `kb-filter` não escuta. Reatribuir `value`, ou escutar `changed` no pai, são as saídas documentadas (`filter.mdx:106-109`). Omissão deliberada hoje; vira lacuna no dia em que um filtro precisar seguir uma coleção viva |
| 7 | `key` alterado após a conexão | **Refiltra.** Diferente do que a versão anterior deste documento registrava: o setter de `key` **tem** `@around(dispatch)` (`filter.ts:17-18`), então mudar `key` sozinho já dispara uma nova passada, coalescida com `value` pela mesma janela de `@debounce(100)`. Ver a nota de paridade na seção 3 — `kb-find` não tem o equivalente |
| 8 | Duas atribuições de `key`/`value` dentro de 100ms | **Coalescem** numa única passada, graças a `@debounce(100)` em `[dispatch]` (`filter.ts:35`). Fora da janela de 100ms, ainda são duas passadas independentes, sem garantia de ordem de chegada dos dois `filtered` no pai |
| 9 | Coleção sem nenhum registro correspondente | Publica `[]` — o consumidor dispara e pode mostrar estado vazio (`filter.mdx:125-126`). Comportamento correto, e o único dos edge cases já documentado para o consumidor final |
| 10 | Reatribuir o mesmo `value` (`el.value = el.value`) | Refiltra. Não há comparação de igualdade no setter (`filter.ts:29-31`), então a passada roda de novo — é o mecanismo oficial de "force a new pass" (`filter.mdx:107-108`), efeito colateral promovido a recurso |
| 11 | Leitor de tela | Não anuncia nada, e é o correto: `display: none` mantém o elemento fora da árvore de acessibilidade e da árvore de renderização. A mudança de conteúdo provocada pela filtragem não move foco nem anuncia — cabe ao consumidor dar `aria-live` à região de resultados (`filter.mdx:130-133`) |

### Cobertura — `filter.test.js` (2026-09-06)

`src/data/filter/filter.test.js` cobre:

1. `kb-filter` popula `kb-dataset` e atribuir `value` faz o **pai** despachar `filtered` cujo `detail` contém exatamente os registros cujo campo `key` é igual a `value`.
2. O evento nunca é despachado no próprio `<kb-filter>`.
3. Um `value` sem correspondência publica `filtered` com array vazio.
4. Duas atribuições de `value` dentro da janela de `@debounce(100)` coalescem numa única passada — prova direta do achado 8.
5. Mudar `key` sozinho também dispara uma passada (rule 072: comportamento real confirmado por teste, não assumido) — prova do achado 7 e da assimetria com `kb-find` registrada na seção 3.

**Fora da cobertura, deliberadamente**: os Edge cases 1–3 (pai ausente/inválido, unhandled rejection) não têm teste — escrevê-los depende primeiro da decisão do `architect` sobre se e como guardar essas rejeições (ver "Divisão de trabalho" abaixo).

**Achado adjacente**: `src/data/find/` tem `find.test.js` equivalente desde a mesma data (ver `src/data/find/DESIGN.md`, seção 5).

### Revisão de `designer`: não se aplica

Como `kb-headers` e `kb-on`, este pacote não tem token, custom property, cor, shadow root nem estado visual. A única declaração de estilo é o `display: none` que `Headless` aplica. Não há revisão de `designer` pendente, e não deve ser aberta uma.

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável | Status |
|---|---|---|
| Contrato público, cadeia de mixins, Symbols, forma da leitura pai→filho e do despacho filho→pai | `architect` | Concluído |
| Confirmação de que `dispatch` deve ser `Symbol()` local e não `Symbol.for` | `architect` | Concluído — conforme à taxonomia |
| Confirmação de que `Identity`/`role` não se aplica | `architect` | Concluído — ausência correta |
| Confirmação de que `Echo` fica na cadeia (ao contrário de `kb-headers`) | `architect` | Concluído — o attribute `on` é efetivo aqui, porque o gatilho é o setter de `value`, não um `@connected` |
| Guarda para pai sem `value` / sem pai / pai não-custom-element (Edge cases 1–3) | `architect` + consumidor | **Pendente de decisão** — `kb-headers`/`kb-on` têm `if (!parent) return this`; `kb-filter` não tem nada, e `filter.mdx:60-61` promete "does nothing" onde o código lança |
| `@debounce(100)` sobre `[dispatch]`, coalescendo `key`/`value` | `developer` | Concluído — mesmo padrão de `kb-headers` (`headers.ts:45`) |
| `types.d.ts`: "Reflects" onde é sincronização de mão única; ausência do default; `extends HTMLElement` sem o achatamento de `Echo`/`on` | `developer` | Concluído — corrigido em 2026-09-06, seção 2 |
| Defaults `''` em `key`/`value`, para paridade com `kb-headers`/`kb-on` | `architect` + `developer` | **Pendente de decisão** — divergência real de contrato entre elementos da mesma família; `types.d.ts` já não mente sobre ela |
| `key` disparando filtragem via `@around(dispatch)`, diferente de `kb-find` | `architect` | **Em aberto** — comportamento real, confirmado por teste; falta decidir se `kb-find` deve ganhar o mesmo gatilho ou se `kb-filter` deve perdê-lo |
| Teste do pacote | `tester` | Concluído — `filter.test.js`, cinco casos, seção 5 |
| `find.test.js` — gêmeo na mesma situação | `tester` | Concluído — ver `src/data/find/DESIGN.md` |
| Correção de `filter.mdx:60-61` ("with no such parent it does nothing") | `writer` | **Pendente** — depende primeiro da decisão sobre as guardas |
| Extração da duplicação `kb-filter`/`kb-find` para forma comum | `architect` | **Adiado deliberadamente** — dois consumidores, rule 021 exige mais de dois; reabrir ao surgir um terceiro elemento da família |

---

**Criado em**: 2026-09-05
**Atualizado em**: 2026-09-06
**Versão**: 1.1
