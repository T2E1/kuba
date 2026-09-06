# DESIGN — `kb-dataset`

**Pacote**: `src/data/dataset/`
**Tag**: `<kb-dataset>`
**Status**: documentação retroativa — a implementação precede este documento
**Data**: 2026-09-05
**Atualizado**: 2026-09-06 — `types.d.ts` ganhou `on` (`Echo` na cadeia); `storage.js` parou
de mutar o registro armazenado no `push` (congela o objeto novo) e normalizou a chave
interna do `Map` para string (sem alterar o dado devolvido); `dataset.mdx` corrigido sobre
o comportamento de `upsert` ausente; 5 testes novos (`push(undefined)`, `delete` cross-tipo
nos dois sentidos, congelamento, uuid por registro). `uuid.js` permanece intocado por
decisão do consumidor.

---

Este documento segue o framework LLD (5 passos) e descreve `kb-dataset` como ele existe
hoje. O pacote foi escrito antes de qualquer processo formal de design neste repositório e
nunca teve especificação própria, embora — diferente de `kb-headers` na época — já tenha
teste (`dataset.test.js`, 3 testes) e um screenshot de referência
(`__screenshots__/dataset.test.js/drives-a-full-add-and-delete-screen-through-arcs-alone-1.png`).
O objetivo é duplo: registrar a forma já implementada, sem redesenhá-la, e apontar com
evidência onde ela está descoberta, ou onde a documentação publicada
(`website/docs/components/dataset.mdx`) afirma algo que o código não faz.

A partir desta versão vale a mesma regra dos outros: quando implementação e documento
divergirem, é a implementação que está errada. Mudança de comportamento passa primeiro por
uma revisão deste documento, depois pelo código.

## Visão Geral

`kb-dataset` é o **elemento de estado headless** do repositório: uma coleção de registros
em memória que não renderiza nada e cuja função inteira é **guardar e publicar**. Cada
mutação (`push`, `delete`, `reset`) altera a coleção de forma síncrona e, num tick
seguinte, despacha `changed` com a coleção **inteira** no `detail` (`dataset.ts:29-50`).

Ele é o oposto estrutural de `kb-headers` e `kb-on`, os dois outros headless já
documentados: aqueles são *children* declarativos que mutam o pai e não têm estado próprio;
`kb-dataset` é *host*, tem estado próprio, e é o pai que outros leem. É também o único
pacote de `src/data/` com um colaborador de domínio interno — `Storage` (`storage.js:3`) —
em vez de guardar o dado direto em campo privado do elemento.

A escolha estruturante é que **a coleção é um objeto, não um array no elemento**. `Dataset`
não tem `#records = []`; tem `#storage = Storage.from(this)` (`dataset.ts:13`), e toda
regra de merge, chaveamento e limpeza mora em `Storage`. Isso é a rule 004 (coleções de
primeira classe) aplicada com rigor: o elemento fica com 5 membros públicos
(`upsert`, `value`, `delete`, `push`, `reset`), bem abaixo do teto de 7 da rule 010, e
`storage.js` inteiro cabe em 43 linhas.

A segunda escolha estruturante é que **nada importa `kb-dataset` para consumi-lo**. Quem
reage à coleção o faz por arco de `Echo` (`crud-users/changed:method/render` em
`dataset.test.js:52`), e quem a estreita — `<kb-filter>`, `<kb-find>` — o faz lendo
`this.parentElement.value` do lado de fora (`src/data/filter/filter.ts:33`). O grafo de
pacotes fica acíclico (rule 018) sem que `dataset` conheça um só consumidor.

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | O autor de markup que precisa de uma lista viva na página — resultados de busca, carrinho, tabela — da qual vários elementos derivam sua renderização |
| Somente leitura ou interativo | Nem um nem outro no sentido de UI: é estado. A escrita é por método (`push`/`delete`/`reset`) ou por arco; a leitura é por `value` e pelo evento `changed` |
| Caso de uso mínimo (MVP) | Acumular registros chaveados por um campo, mesclando os repetidos, e avisar quem escuta a cada mutação |
| Participa de `<form>` | Não. Nenhum `formAssociated`, nenhum `attachInternals()` em qualquer arquivo do pacote |
| Papel e nome acessível | Nenhum, e corretamente nenhum — ver seção 3 |
| Superfície de variação | `upsert` (nome do campo-chave); nada mais |
| Sub-elemento interno | Nenhum. Sem `attachShadow`, sem template, sem estilo próprio. Filhos (`<kb-on>`, `<kb-filter>`) ficam no light DOM de um host com `display: none` |

**Requisitos funcionais**

1. Expõe `upsert` como propriedade string sincronizada do attribute homônimo via
   `@attributeChanged('upsert')` (`dataset.ts:19-22`). **Não tem default** — ver Edge case 1.
2. Expõe `value` como getter somente-leitura devolvendo os registros em ordem de inserção
   (`dataset.ts:24-26` → `storage.js:7-9`, `[...this.#map.values()]`).
3. `push(data)` aceita um registro ou um array (`storage.js:24`, `[].concat(payload)`) e,
   para cada um: resolve a chave como `data[upsert] ?? uuid()`, mescla sobre o registro
   já armazenado com essa chave, e **grava a chave de volta no registro**
   (`storage.js:25-30`).
4. `delete(key)` remove o registro cuja chave é `key` (`dataset.ts:30` → `storage.js:16`).
5. `reset()` limpa a coleção inteira (`dataset.ts:48` → `storage.js:36`).
6. Os três são decorados com `@around(dispatch)` (`dataset.ts:29,40,46`), que agenda
   `[dispatch]()` via `setImmediate` (`packages/middleware/around.js:10`); `[dispatch]`
   despacha `changed` com `this.value` (`dataset.ts:35-38`).
7. Os três retornam `this`, permitindo encadeamento (`dataset.ts:32,43,49`).
8. Nunca renderiza: `Headless` aplica `display: none` inline no host ao conectar
   (`packages/mixin/headless/headless.ts:7-11`).

**Não-requisitos (YAGNI, rule 023)**

- Persistência. `Storage` é um `Map` em memória (`storage.js:4`); um reload esvazia. A
  documentação já diz isso explicitamente (`website/docs/components/dataset.mdx:52-53`).
- Delta de mudança no evento. O `detail` é sempre a coleção inteira
  (`dataset.ts:36`) — é o que permite `<kb-render>` não precisar de diffing.
- Ordenação, paginação, índice secundário. Uma chave, ordem de inserção, e nada mais.
- Validação de schema dos registros. `push` aceita qualquer coisa indexável;
  `types.d.ts:42` tipa o parâmetro como `unknown`.
- Papel ARIA, `alt`, `Identity`. Um elemento que nunca chega à árvore de renderização não
  tem o que anunciar.
- Slot, `part`, custom property, token. Sem shadow root, não há superfície visual — este
  pacote não tem, e não deve ter, revisão de `designer`.
- ~~Congelar os registros devolvidos por `value`.~~ **Resolvido em 2026-09-06** — ver seção 4.

---

## 2. Contrato Público

### Attributes / Properties

| Nome | Tipo | Default | Reflete | Especificação |
|---|---|---|---|---|
| `upsert` | `string` | **`undefined`** | não | Nome do campo que identifica um registro. Setter decorado com `@attributeChanged('upsert')`, grava em `#upsert` (`dataset.ts:19-22`). O getter (`dataset.ts:15-17`) **não** usa `??= ''`, ao contrário de `kb-on` e `kb-headers` — ler antes de qualquer escrita devolve `undefined` |
| `value` | `unknown[]` | `[]` | não | Somente leitura (`dataset.ts:24-26`). Devolve um **array novo** a cada chamada, com as **mesmas referências** de registro (`storage.js:8`) |
| `on` | arc string | — | não | Vem de `Echo`, não deste pacote: `static observedAttributes = [..., on]` (`packages/echo/echo.js:9`), com `on = 'on'` (`packages/echo/interfaces.js:8`) |
| `name` | `string` | — | — | **Não é propriedade do elemento.** `Echo` lê `this.getAttribute('name')` no momento do dispatch (`packages/echo/echo.js:43`) para identificar este host como `source` de um arco. Existe só como attribute, nunca como campo |

**Rule 037 (flag arguments)**: nenhum attribute booleano no contrato.

**`types.d.ts` corrigido em 2026-09-06**: agora declara `on: KUBADatasetOnAttribute | (string
& {})`, seguindo o padrão de `src/data/headers/types.d.ts:13-16,57` (que segue
`src/component/button/types.d.ts:28-43,118`). `name` continua **fora** do contrato,
deliberadamente — é attribute HTML global lido por `Echo` via `getAttribute('name')`
(`packages/echo/echo.js:43`), sem accessor próprio no elemento; nenhum `types.d.ts` do
repositório o declara, e essa ausência é convenção correta, não lacuna (confirmado pelo
`architect`, 2026-09-06).

**Achado adjacente, ainda em aberto**: `Echo` não define `get on()`/`set on()` — ele só
observa o attribute (`packages/echo/echo.js:9,14-17`; `grep "get on\|set on"` no arquivo não
retorna nada). Isso significa que `element.on = '...'` cria um campo JS inerte em **todo**
elemento que segue esse padrão de `types.d.ts` (`kb-headers`, `kb-fetch`, `kb-filter`,
`kb-find`, `kb-button`, e agora `kb-dataset`) — a própria skill `types`
(`.claude/skills/types/references/achatamento-mixins.md`) se contradiz entre a linha que
manda declarar `on` como propriedade (linha ~21) e a seção que classifica "membro que
nenhum getter respalda" como defeito (linha ~102). Fora do escopo deste pacote; é questão
de `curator`, atravessa todo elemento com `Echo` na cadeia.

### Events

| Evento | Quando | `detail` | Bubbles / Cancelable |
|---|---|---|---|
| `changed` | Depois de `push`, `delete` ou `reset`, **num tick posterior** | A coleção inteira, array (`dataset.ts:36`) | Sim para os dois — `customEvent` os define por default (`packages/event/customEvent.js:4-8`) |

Todo `dispatchEvent` deste elemento é, além do disparo local, ecoado no barramento
compartilhado de `Echo` (`packages/echo/echo.js:33-50`), embrulhado com `id`, `name` e
`localName` para que arcos de outros hosts casem contra o segmento `source`. É por isso que
`<kb-render><kb-on value="crud-users/changed:method/render">` funciona sem uma linha de JS
na página (`dataset.test.js:51-56`).

**A assincronia é contrato, não detalhe.** `@around` não envolve a chamada: ele agenda
`context[method](...args)` em `setImmediate` e devolve o retorno original intacto
(`packages/middleware/around.js:1-12`, com o comentário admitindo que o nome engana). Logo,
`dataset.push(x)` retorna antes de `changed` existir — e o teste precisa de `vi.waitFor`
para observá-lo (`dataset.test.js:25,29,34`). A documentação registra isso corretamente
(`website/docs/components/dataset.mdx:103-104`).

### Slots e Parts

Nenhum dos dois, e nenhum shadow root. Filhos declarados no markup (`<kb-on>`,
`<kb-filter>`, `<kb-find>`) ficam no light DOM de um host com `display: none` — inertes
visualmente, ativos como wiring.

### Symbols publicados

| Symbol | Forma | Alcance | Papel |
|---|---|---|---|
| `dispatch` | `Symbol('dispatch')` | Módulo | Chave do método que despacha `changed` (`interfaces.js:1`, usado em `dataset.ts:29,35,40,46`). Interno; nenhum outro pacote o toca |

**Nenhum `Symbol.for` neste pacote** — e está correto. `kb-headers` e `kb-on` precisam de
registro global porque invocam um método de um pai construído em outro pacote;
`kb-dataset` não invoca ninguém, apenas despacha. O encontro com consumidores acontece pelo
barramento de `Echo`, que já resolve a identidade por string de attribute, não por Symbol.

`src/data/filter/filter.ts:6` declara um `dispatch` homônimo em seu próprio
`interfaces.js`. São dois `Symbol()` distintos, propositalmente sem relação — mesma
nomenclatura para o mesmo papel local, sem contrato compartilhado.

### Symbols e contratos consumidos

| Contrato | De onde | Como chega |
|---|---|---|
| `hideable` | `packages/mixin/headless/interfaces.js` | Via `Headless` na cadeia; hook `@connected` que aplica `display: none` (`headless.ts:7-11`) |
| `connectArc` / `disconnectArc` | `Symbol.for`, `packages/echo/interfaces.js:4-5` | Via `Echo` na cadeia. É o contrato que os filhos `<kb-on>` invocam neste elemento (`dataset.test.js:59-60`) |

**Contrato implícito não modelado (achado de arquitetura).** `<kb-filter>` lê
`this.parentElement.value` e chama `this.parentElement.dispatchEvent(...)` diretamente
(`src/data/filter/filter.ts:33-36`). Ou seja, `kb-dataset` participa de um contrato
pai/filho — "o pai expõe `value: array` e é despachável" — que, ao contrário de
`setHeader` e `connectArc`, **não tem Symbol nenhum**: é um nome de propriedade comum,
acoplado por convenção. Não é violação de rule alguma (não há ciclo, não há import), mas é
a única fronteira pai/filho do repositório sem contrato explícito, e vale registrar como
decisão consciente antes que alguém a "conserte" em direção oposta.

---

## 3. Composição

**Cadeia**: `Echo(Headless(HTMLElement))` (`dataset.ts:11`)

| Mixin | Traz | Avaliação |
|---|---|---|
| `Headless` | Hook `@connected [hideable]()` que aplica `display: none` inline no host (`packages/mixin/headless/headless.ts:7-11`) | **Necessário.** O elemento é estado puro; não pode ocupar espaço |
| `Echo` | (a) eco de todo `dispatchEvent` no barramento compartilhado (`echo.js:33-50`); (b) attribute `on` observado (`echo.js:9,14-17`); (c) `[connectArc]`/`[disconnectArc]` para filhos `<kb-on>` (`echo.js:61-108`); (d) teardown de todos os arcos no `disconnectedCallback` (`echo.js:22-31`) | **Necessário, e aqui todos os quatro são usados.** É a diferença decisiva em relação a `kb-headers`, de onde `Echo` foi removido em 2026-08-27 por herança recusada (rule 059) |

### `Echo` é justificado aqui — e o contraste com `kb-headers` é o argumento

Em `kb-headers`, `Echo` foi removido porque o elemento nunca despachava evento e o
attribute `on` era inefetivo sob wiring de disparo único (`src/data/headers/DESIGN.md`,
seção 3). Nenhuma das duas condições vale para `kb-dataset`:

- Ele **despacha** — `dispatchEvent(customEvent('changed', this.value))` (`dataset.ts:36`)
  — e o eco no barramento é exatamente o que faz `changed` alcançar outros hosts.
- Ele **recebe arcos com efeito real**: os sinks são métodos (`push`, `delete`) que podem
  ser chamados a qualquer momento, não wiring de conexão única. O terceiro teste prova o
  ciclo fechado: `crud-form/submitted:method/push` e `crud-delete/clicked:method/delete`
  como filhos `<kb-on>` do dataset (`dataset.test.js:58-61`), com a asserção final em
  `dataset.test.js:83`.

Herança usada em todas as suas partes; rule 059 satisfeita.

### `Storage` — colaborador, não mixin

`Storage` (`storage.js:3-43`) é uma coleção de primeira classe (rule 004): encapsula o
`Map` (`storage.js:4`), expõe comportamento (`push`, `delete`, `clear`, `values`) e nunca
entrega o `Map` para fora. Instanciado por factory estática, `Storage.from(this)`
(`storage.js:40-42`, chamado em `dataset.ts:13`).

Ele guarda uma referência ao elemento dono (`#dataset`, `storage.js:5,11-13`) e lê
`this.#dataset.upsert` no momento de cada `push` (`storage.js:25,29`). É leitura de dado de
outro objeto — na fronteira do que a rule 057 chama de feature envy — mas é a decisão certa
e deve ficar: a alternativa seria copiar `upsert` no construtor, congelando um valor que o
attribute pode mudar depois, ou passá-lo em cada chamada, inflando a assinatura. Ler tardio
mantém uma única fonte de verdade para `upsert` (o DOM) e mantém `push(data)` com um
parâmetro só (rule 033).

**Custo aceito**: `Storage` não é testável isoladamente sem um objeto com `upsert` —
`dataset.test.js` só o exercita pelo elemento, nunca direto. Para uma classe de 43 linhas
com três métodos, é troca razoável.

### `role`/`Identity`: ausência correta

Não implementar `get [role]()` nem entrar com `Identity` é a decisão certa, pelas mesmas
três razões registradas em `src/data/headers/DESIGN.md` e `src/behavior/on/DESIGN.md`:
`display: none` tira o elemento da árvore de acessibilidade, não há conteúdo para nomear, e
é um elemento de dados, não de apresentação. `kb-dataset`, `kb-filter`, `kb-find`,
`kb-fetch`, `kb-headers` e `kb-on` usam todos `Headless` e nenhum usa `Identity` — a
separação entre as duas famílias de mixin segue limpa.

A consequência de acessibilidade real não é do elemento, é de quem renderiza a coleção: uma
lista que muda sozinha precisa de `aria-live` na região que a exibe, e a documentação já
orienta assim (`website/docs/components/dataset.mdx:139-142`).

---

## 4. Gestão de Estado

| Dado | Onde mora | Controlado? | Regra de sincronização |
|---|---|---|---|
| `upsert` | `#upsert` privado + attribute `upsert` | Controlado — DOM é a fonte da verdade | `@attributeChanged('upsert')` grava no campo (`dataset.ts:19-22`). Não reflete de volta. Mudança **não** rechaveia o que já está armazenado |
| Registros | `#map` dentro de `Storage` (`storage.js:4`) | Não controlado — é o estado próprio do elemento, sem espelho no DOM | Mutado só por `push`/`delete`/`clear`; nunca lido de attribute |
| Arcos | `#controllers` de `Echo` (`packages/echo/echo.js:7`) | — | Um `AbortController` por arco; todos abortados no `disconnectedCallback` (`echo.js:22-31`) |

**Estado derivado**: nenhum calculado e guardado. `value` é derivado *na leitura*
(`storage.js:8`), sem cache — cada acesso copia o array. Para as coleções pequenas que a
documentação recomenda (`dataset.mdx:56-57`) isso é irrelevante; para milhares de linhas o
custo é O(n) por leitura e por evento, e a documentação já desaconselha o uso nessa escala.

**Estado compartilhado (rule 070) — resolvido em 2026-09-06.** `push` (`storage.js:23-33`)
não muta mais o registro armazenado: o objeto novo é montado por spread puro (`{ ...stored,
...data, [upsert]: key }`) e congelado (`Object.freeze`) antes de entrar no `Map`. `value`
continua devolvendo array novo a cada leitura (`storage.js:8`), com as mesmas referências —
mas agora essas referências são imutáveis. Consequência: `event.detail` de um `changed`
anterior é um snapshot estável (não muda sob os pés do consumidor), e
`dataset.value[0].name = 'x'` lança `TypeError` em vez de mutar silenciosamente — provado em
`dataset.test.js` ("freezes stored records so direct mutation throws and leaves them
intact"). A chave interna do `Map` também passou a ser normalizada para string
(`String(key)`), sem alterar o valor gravado no registro — resolve o Edge case 6.

Não há `internals.states`, não há `@repaint`/`@retouch`, não há template.

---

## 5. Edge Cases

| # | Caso | Comportamento requerido |
|---|---|---|
| 1 | `upsert` não definido | `this.upsert` é `undefined` (`dataset.ts:15-17`, sem `??=`). Em `push`, `data[undefined] ?? uuid()` resolve para um uuid novo a cada registro — cada um entra como novo, nenhum merge acontece. **Documentação corrigida em 2026-09-06** (`dataset.mdx:91-92,160` e traduções pt-br/es): não afirma mais colisão num único registro; descreve corretamente "cada push adiciona um duplicado, nunca atualiza". Provado por `dataset.test.js` ("gives each pushed record its own uuid when upsert is unset") |
| 2 | `push` de registro sem valor para a chave | Recebe uuid gerado, entra como novo, e a chave é **escrita de volta** no registro (`storage.js:25-30`). Não é detalhe: é o que faz o teste de CRUD funcionar — o formulário só envia `name`, o registro ganha `id: <uuid>`, e o `<kb-button value="{id}">` renderizado devolve exatamente essa string ao `delete` (`dataset.test.js:54,60,83`) |
| 3 | `push` de registro com chave já existente | Mescla, não substitui: campos ausentes no novo registro sobrevivem (`storage.js:26-30`). Provado em `dataset.test.js:9-12` — `name: 'Ada'` sobrevive a um push que só traz `role` |
| 4 | `uuid()` colidir | `Math.random().toString(36).slice(2)` (`uuid.js:1`) não é UUID de verdade: ~10 caracteres base-36, sem garantia de unicidade e sem `crypto.randomUUID`. Aceitável para coleções de página; o nome do arquivo promete mais do que entrega. Não corrigir sem motivo medido (rule 069), mas registrar |
| 5 | Consumidor muta um registro devolvido por `value` | **Resolvido em 2026-09-06.** `Object.freeze` no `push` (`storage.js:30`) faz a tentativa de mutação lançar `TypeError` (módulo ES é sempre strict), em vez de mutar silenciosamente. Provado em `dataset.test.js` |
| 6 | `delete` com chave de tipo diferente | **Resolvido em 2026-09-06.** A chave é normalizada para `String(...)` antes de qualquer operação no `Map` interno (`storage.js:16,26-27`) — `delete('1')` agora remove um registro guardado sob a chave numérica `1`, e vice-versa. O valor gravado no registro (campo `[upsert]`) continua sendo o original, não convertido. Provado nos dois sentidos em `dataset.test.js` |
| 7 | `delete` de chave inexistente | `Map.delete` é no-op (`storage.js:16`), mas `changed` **é despachado assim mesmo** (`dataset.ts:29`), com a coleção inalterada. Idem `reset()` numa coleção já vazia. Ruído, não erro |
| 8 | `push([])` | `[].concat([])` é vazio, nenhum registro entra, e `changed` é despachado com a coleção inalterada. Mesmo caso do #7 |
| 9 | `push(undefined)` / `push(null)` | `[].concat(undefined)` produz `[undefined]`, e `data[this.#dataset.upsert]` lança `TypeError` (`storage.js:25`). **Sem guarda, por decisão deliberada** (`architect`, 2026-09-06): uma guarda transformaria um arco mal escrito num sucesso silencioso — `push` retornaria `this`, `changed` seria despachado com a coleção inalterada, e o autor do markup veria o arco "funcionando" sem nunca gravar nada. Rule 027 (não engolir erro) e rules 023/064 (sem guarda de runtime para uso incorreto verificável em review). Provado em `dataset.test.js` ("push(undefined) throws, and dispatches changed with the unchanged collection anyway" — confirma que `@around` ainda despacha `changed`, já que o agendamento independe do sucesso da chamada original) |
| 10 | Duas mutações síncronas seguidas | Dois `setImmediate` são agendados (`around.js:10`), e cada `[dispatch]` lê `this.value` **na hora de disparar** (`dataset.ts:36`). Logo, `push(x); reset()` emite dois eventos, ambos com a coleção **vazia**. O último evento é sempre verdadeiro; os intermediários podem já estar defasados. É o preço do `@around`, e o motivo de todo teste usar `vi.waitFor` |
| 11 | `upsert` alterado depois de haver registros | Os registros já guardados mantêm suas chaves antigas no `Map`; os próximos são chaveados pelo campo novo. A coleção passa a ter dois regimes de chave e nenhuma rechaveagem acontece. Uso incorreto, verificável por review — não deve virar guarda de runtime (rule 064) |
| 12 | Elemento removido do DOM | Os registros **permanecem** em `#storage` (não há `@disconnected` neste pacote), mas os arcos são **derrubados**: `Echo.disconnectedCallback` aborta todos os controllers (`packages/echo/echo.js:22-31`). Assimetria a conhecer: mover o elemento no DOM preserva o dado; para os arcos, os filhos `<kb-on>` os reconectam ao reconectar, mas o arco vindo do attribute `on` **não** volta — `attributeChangedCallback` não redispara numa remoção/reinserção |
| 13 | Coleção grande | Cada leitura de `value` copia o array inteiro (`storage.js:8`) e cada mutação despacha a coleção completa (`dataset.ts:36`). Custo O(n) por evento, por desenho. Documentado como limite de uso (`dataset.mdx:56-57`), não como bug |
| 14 | Leitor de tela | Não anuncia nada, e é o correto: `display: none` mantém o elemento fora da árvore de acessibilidade. A responsabilidade de anunciar a mudança é de quem renderiza a coleção |

### O que os testes provam hoje

`dataset.test.js` tem oito testes. Os três originais:

1. **Merge por chave** (`dataset.test.js:5-13`) — cobre Edge case 3 e o requisito funcional 3.
2. **`changed` com a coleção inteira após cada mutação** (`dataset.test.js:15-37`) — cobre
   os três métodos, a assincronia (via `vi.waitFor`) e o formato do `detail`.
3. **Tela completa de CRUD por arcos** (`dataset.test.js:39-84`) — é o teste mais valioso
   do pacote e o único com screenshot: prova o ciclo `kb-form → kb-dataset → kb-render →
   kb-dataset` sem uma linha de listener escrita pela página, e prova indiretamente a
   escrita da chave de volta no registro (Edge case 2).

Mais cinco, adicionados em 2026-09-06, fechando exatamente as três lacunas que este
documento apontava como prioritárias, mais o congelamento e a normalização de chave:

4. `push(undefined) throws, and dispatches changed with the unchanged collection anyway` —
   Edge case 9.
5. `deletes a record pushed with a numeric key using a string key` — Edge case 6.
6. `deletes a record pushed with a string key using a numeric key` — Edge case 6, sentido
   inverso.
7. `freezes stored records so direct mutation throws and leaves them intact` — Edge case 5.
8. `gives each pushed record its own uuid when upsert is unset` — Edge case 1.

**Restante em aberto, sem teste**: Edge cases 4 (`uuid()` fraco, intocado por decisão),
7/8 (no-op com `changed` ruidoso, comportamento aceito), 10 (ordem de eventos sob mutações
síncronas seguidas), 11 (`upsert` alterado com registros já presentes), 12 (assimetria de
arco na reconexão) e 13 (custo O(n) em coleção grande) — nenhum decidido como bug a corrigir.

### Revisão de `designer`: não se aplica

Como `kb-headers` e `kb-on`, este pacote não tem token, custom property, cor, shadow root
nem estado visual. A única declaração de estilo é o `display: none` que `Headless` aplica.
O screenshot em `__screenshots__/` é da *tela composta* que o teste monta — `kb-form`,
`kb-button`, `kb-card` — não deste elemento, que não tem pixel algum. Não há revisão de
`designer` pendente, e não deve ser aberta uma.

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável | Status |
|---|---|---|
| Contrato público, cadeia de mixins, papel de `Storage`, forma do dispatch | `architect` | Concluído |
| Confirmação de que `Echo` é justificado aqui (ao contrário de `kb-headers`) | `architect` | Concluído — os quatro recursos do mixin são usados |
| Confirmação de que `Identity`/`role` não se aplica | `architect` | Concluído — ausência correta |
| Confirmação de que nenhum `Symbol.for` é necessário | `architect` | Concluído — `dispatch` é corretamente local |
| Teste do pacote — merge, evento, ciclo CRUD completo | `tester` | Concluído — `dataset.test.js`, 3 testes originais |
| Congelar o registro no `push` em vez de mutar o armazenado (Edge case 5) | `architect` + `developer` | Concluído (2026-09-06) — `Object.freeze` em `storage.js:30`, sem mudar `get values()` |
| Normalizar a chave interna do `Map` para string, sem alterar o dado devolvido (Edge case 6) | `architect` + `developer` | Concluído (2026-09-06) — `storage.js:16,26-27` |
| `push(undefined)` — decisão de manter o `TypeError` sem guarda | `architect` | Concluído (2026-09-06) — decisão deliberada, não omissão; ver Edge case 9 |
| `types.d.ts` ganha `on` (`Echo` na cadeia); `name` confirmado como ausência correta | `architect` + `developer` | Concluído (2026-09-06) |
| Teste de `push(undefined)` / payload vazio (Edge case 9) | `tester` | Concluído (2026-09-06) |
| Teste de `delete` com chave de tipo divergente, nos dois sentidos (Edge case 6) | `tester` | Concluído (2026-09-06) |
| Teste de `upsert` ausente (Edge case 1) | `tester` | Concluído (2026-09-06) |
| Teste de congelamento — mutação direta lança (Edge case 5) | `tester` | Concluído (2026-09-06) |
| `dataset.mdx:91-92,160` afirmava colisão num único registro quando `upsert` está ausente | `writer` | Concluído (2026-09-06) — corrigido em EN, pt-br e es |
| Achado adjacente: `Echo` não tem `get on()`/`set on()` real — `element.on = '...'` é campo inerte em todo elemento que segue o padrão de `types.d.ts` (`headers`, `fetch`, `filter`, `find`, `button`, `dataset`) | `curator` | **Pendente** — contradição interna na skill `types` entre a linha que manda declarar `on` e a que classifica "membro sem getter" como defeito; atravessa múltiplos pacotes, fora do escopo de `kb-dataset` sozinho |
| Contrato pai/filho `parentElement.value` usado por `kb-filter`/`kb-find` sem Symbol | `architect` | **Registrado, não alterado** — única fronteira pai/filho do repositório por nome comum em vez de `Symbol.for` |
| `uuid.js` prometer mais do que entrega (`Math.random`, sem `crypto.randomUUID`) | `architect` | **Registrado, não alterado por decisão do consumidor** — fora de escopo desta rodada |

---

**Criado em**: 2026-09-05
**Atualizado em**: 2026-09-06
**Versão**: 1.1
