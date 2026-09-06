# DESIGN — `kb-headers`

**Pacote**: `src/data/headers/`
**Tag**: `<kb-headers>`
**Status**: documentação retroativa — a implementação precede este documento
**Data**: 2026-08-22
**Atualizado**: 2026-09-06 — `Echo` reintroduzido na cadeia; gatilho de escrita movido de
`@connected` (disparo único) para os setters de `key`/`value`; `@debounce(100)` em
`[publish]`, acionado por `@around(publish)` nos dois setters, coalescendo escritas
simultâneas numa única chamada ao pai — decisão explícita do consumidor, por eficiência,
não por correção (`@around` puro, sem coalescer, também seria correto — ver seção 3). Ver
histórico completo abaixo: esta versão passou por uma primeira tentativa com `@debounce`
sob medida, foi corrigida para `@around` puro, e depois voltou a `@debounce` por decisão
explícita — as três fases estão registradas porque cada uma ensina algo diferente.

---

Este documento segue o framework LLD (5 passos) e descreve `kb-headers` como ele existe
hoje. O pacote foi escrito antes de qualquer processo formal de design neste repositório.
Ele já teve várias decisões de arquitetura sucessivas sobre a mesma pergunta — "`Echo` fica
na cadeia, e com que gatilho?" — e a razão de cada uma está registrada abaixo, porque cada
reversão só faz sentido lendo por que a anterior existiu.

A partir desta versão vale a mesma regra dos outros: quando implementação e documento
divergirem, é a implementação que está errada. Mudança de comportamento passa primeiro por
uma revisão deste documento, depois pelo código.

## Visão Geral

`kb-headers` é um **child declarativo headless**: um elemento que nunca renderiza, existe só
no markup, e cuja única função é **mutar o pai**. Ele chama `parentElement[setHeader](key,
value)`, registrando um par nome/valor de header HTTP no `<kb-fetch>` que o contém.

O que ele **não** é: um elemento de dados. Não guarda coleção, não tem shadow root, não tem
papel ARIA, não é focável, não participa de `<form>`, não renderiza absolutamente nada —
`Headless` lhe aplica `display: none` no `@connected`. Não é tampouco um contêiner de vários
headers: o nome no plural descreve o *domínio* (headers HTTP), não a cardinalidade. **Um
`<kb-headers>` carrega exatamente um par**; uma requisição com três headers precisa de três
elementos irmãos.

A escolha estruturante do pacote é que **a mutação mora no filho, não no pai**. O
`<kb-fetch>` não varre seus filhos procurando headers; cada filho se anuncia. Isso mantém
`kb-fetch` fechado para modificação (rule 011) — um novo tipo de contribuição declarativa
não exige tocar em `fetch.ts` — e mantém o grafo de pacotes acíclico (rule 018), porque
nenhum dos dois importa o outro: o encontro acontece pelo registro global de Symbols.

**O que mudou nesta versão**: até 2026-09-05, o par `key`/`value` só era entregue ao pai
**uma vez**, no `@connected`. Agora ele é entregue **toda vez que `key` ou `value` mudam**
— inclusive depois da conexão, inclusive por um arco `Echo`. A mudança existe para que o
attribute `on` (herdado de `Echo`) tenha efeito real: antes, um arco escrevendo `value`
depois da conexão nunca chegava ao pai, porque o wiring já tinha rodado e não rodava de
novo. Ver seção 3 para a análise completa, incluindo a escolha entre `@around` e
`@debounce`.

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | O autor de markup que precisa de um header HTTP fixo — chave de API, `accept-language`, `Authorization` — em toda requisição de um `<kb-fetch>`, e agora também quem precisa que esse header **mude** depois da conexão (token renovado, seleção do usuário) sem recriar o elemento |
| Somente leitura ou interativo | Declarativo, e **reativo**: reage a cada escrita de `key`/`value`, por attribute, por JS ou por arco `Echo` |
| Caso de uso mínimo (MVP) | Ler `key`/`value` do markup e entregá-los ao pai a cada mudança, coalescendo escritas do mesmo turno síncrono |
| Participa de `<form>` | Não |
| Papel e nome acessível | Nenhum, e corretamente nenhum — ver seção 3 |
| Superfície de variação | `key`, `value` e o `on` herdado de `Echo`; nada mais |
| Sub-elemento interno | Nenhum. Sem `attachShadow`, sem template, sem estilo próprio |

**Requisitos funcionais**

1. Expõe `key` e `value` como propriedades string, sincronizadas a partir dos attributes
   homônimos via `@attributeChanged`, com default `''` (`??=` no getter).
2. Cada escrita de `key` ou `value` — por attribute, por JS, ou por arco `Echo` via
   `type=setter` — chama `[publish]` via `@around`, no mesmo instante da escrita.
3. `[publish]` é decorado com `@debounce(100)`: chamadas feitas dentro de uma janela de
   100ms da última são coalescidas numa única execução — o timer é reiniciado a cada nova
   chamada, e só a última realmente roda, 100ms depois de parar de receber escritas.
   `[publish]` não recebe argumentos: lê `this.key`/`this.value` no momento em que roda,
   sempre o estado mais recente.
4. `[publish]` não tem guarda de `isConnected`, `parentElement` nem `key` vazia — essa
   responsabilidade foi deixada para `[setHeader]`, do lado de `kb-fetch` (decisão do
   consumidor, 2026-09-06): "o `publish` não precisa ter guardas, o método `setHeader` em
   `fetch` que deve se preocupar com isso." `[setHeader]` ainda não implementa essa guarda
   — ver "Divisão de trabalho".
5. Aguarda `customElements.whenDefined(this.parentElement.localName)` antes de chamar
   `parentElement[setHeader]?.(key, value)`.
6. Nunca renderiza: `Headless` aplica `display: none` inline no host, ao conectar.

**Não-requisitos (YAGNI, rule 023)**

- Remover o header ao desconectar. Não há `@disconnected`, e `kb-fetch` não expõe contrato
  de remoção. Ver Edge case 6.
- Validar `key` como token HTTP válido. Não-requisito herdado da versão anterior — segue
  sem validação de formato, só de presença.
- Papel ARIA, `alt`, `Identity`. Um elemento que nunca chega à árvore de renderização não
  tem o que anunciar.
- Slot, `part`, custom property, token. Sem shadow root, não há superfície visual nenhuma —
  este pacote não tem, e não deve ter, revisão de `designer`.
- Aceitar múltiplos pares num só elemento (`<kb-headers headers="a:1;b:2">`). Um par por
  elemento é o desenho; parsear uma minilinguagem no attribute seria inventar sintaxe onde
  o HTML já tem repetição de elemento.
- Guardar contra `parentElement` nulo, elemento desconectado ou `key` vazia dentro de
  `[publish]`. Decisão do consumidor: essa responsabilidade é de quem constrói o `Headers`
  nativo (`[setHeader]`, em `kb-fetch`), não de cada filho declarativo que possa vir a
  existir.

---

## 2. Contrato Público

### Attributes / Properties

| Nome | Tipo | Default | Reflete | Especificação |
|---|---|---|---|---|
| `key` | `string` | `''` | não | Nome do header HTTP a definir no pai (ex.: `"Authorization"`). Setter decorado com `@attributeChanged('key')` **e** `@around(publish)` — escrever `key` chama `[publish]`, que por sua vez está decorado com `@debounce(100)`. Getter usa `??= ''` |
| `value` | `string` | `''` | não | Valor do header identificado por `key`. Mesma mecânica de `key` |
| `on` | arc string | `undefined` | não | **Reintroduzido em 2026-09-05.** Herdado de `Echo`. Arco no formato `source/event:type/sink`, tipado como `KUBAHeadersOnAttribute` (mesmo padrão de `src/component/button/types.d.ts`). Um arco `type=setter` escrevendo `key` ou `value` passa pelo mesmo setter decorado — o wiring é o mesmo caminho de uma escrita por JS |

Não há `hidden`, `height`, `width`, `internals` nem `value` de formulário. Não há
`attachInternals()` em lugar nenhum do pacote — sem papel e sem estado ARIA, não há o que
anexar.

**Rule 037 (flag arguments)**: nenhum attribute booleano no contrato.

### Events

Nenhum. `kb-headers` não despacha nada — `Echo` está na cadeia só pela metade "receber
arco" (`on`), não pela metade "ecoar `dispatchEvent`", que continua sem uso neste elemento.
Ver seção 3.

### Slots e Parts

Nenhum dos dois, e nenhum shadow root. Conteúdo colocado entre as tags fica no light DOM de
um elemento com `display: none`, ou seja, invisível e inerte.

### Symbols publicados

| Symbol | Forma | Alcance | Papel |
|---|---|---|---|
| `setHeader` | `Symbol.for('setHeader')` | Global (registro do processo) | Chave do método que o **pai** implementa e que este elemento **invoca**. Declarado nos dois lados (aqui e em `src/data/fetch/interfaces.js`), inalterado por esta versão |
| `publish` | `Symbol('publish')` | Módulo | Renomeado de `setter` em 2026-09-05. Chave do método que efetivamente escreve no pai. Renomeado porque o nome antigo colidia semanticamente com `type=setter` do arco `Echo` — o método não é mais "o setter", é o que publica o par no pai depois de qualquer escrita (rule 034: nome de método é verbo de intenção; rule 035: nome que contradiz o papel é desinformação) |

**Sobre `setHeader` ser `Symbol.for` — inalterado, já analisado.** A justificativa completa
(taxonomia, precedente `connectArc`, razão de a declaração ser duplicada em vez de
importada) permanece válida e não foi revisitada nesta mudança.

### Symbols consumidos

| Symbol | De onde | Papel |
|---|---|---|
| `hideable` | `packages/mixin/headless/interfaces.js`, via `Headless` | Hook `@connected` que aplica `display: none` |
| `connectArc` / `disconnectArc` | `packages/echo/interfaces.js`, via `Echo` | Implementados por `Echo`; resolvem o attribute `on` reintroduzido nesta versão |

---

## 3. Composição

**Cadeia**: `Echo(Headless(HTMLElement))` — **reintroduzido em 2026-09-05**, revertendo a
remoção de 2026-08-27.

| Mixin | Traz | Avaliação |
|---|---|---|
| `Headless` | Hook `@connected [hideable]()` que aplica `display: none` inline no host | **Necessário e suficiente** para o eixo visual — nunca esteve em questão |
| `Echo` | `on` em `observedAttributes`, `[connectArc]`/`[disconnectArc]`, eco de `dispatchEvent` no barramento | **Removido em 2026-08-27, reintroduzido em 2026-09-05** — ver histórico completo abaixo |

### Histórico da decisão sobre `Echo`: duas voltas, e por que a segunda supera a primeira

**2026-08-27 — removido.** O `architect` retirou `Echo` da cadeia por duas razões, ambas
reais na época:

1. **O eco de `dispatchEvent` era inútil.** `kb-headers` nunca despachou evento nenhum —
   isso continua verdadeiro hoje. Herança de comportamento não usado é herança recusada
   (rule 059), e essa metade de `Echo` segue sem uso.
2. **O attribute `on` era inefetivo.** O wiring (`[setter]`, à época) era `@connected` —
   disparava **uma única vez**, na conexão. Um arco escrevendo `value` depois da conexão
   nunca chegava ao pai, porque nada rodava de novo. Uma busca por uso real do attribute
   `on` em `kb-headers` (à época) não encontrou consumidor.

**2026-09-05 — reintroduzido.** A segunda razão da remoção deixou de valer: o gatilho não é
mais `@connected`, é os setters de `key`/`value`. Isso significa que um arco `type=setter`
escrevendo `value` a qualquer momento — não só na conexão — passa pelo mesmo setter que uma
escrita por JS, e `[publish]` roda de novo. O attribute `on` **tem efeito real agora**, o
que resolve exatamente o problema que motivou a remoção original.

A primeira razão (eco de `dispatchEvent` sem uso) continua verdadeira e continua sendo uma
metade não usada do mixin — mas não é mais o caso de herança **inteiramente** recusada: a
outra metade (`on`) tem consumidor real, o mesmo raciocínio que já vale para `kb-filter`,
`kb-find`, `kb-fetch` e `kb-dataset`, todos com `Echo` na cadeia e nenhum deles ecoando
evento próprio a partir deste elemento (`kb-filter`/`kb-find` despacham no *pai*, não em
`this`).

**Por que não foi só "desfazer a remoção"**: reverter sem mudar o gatilho reproduziria
exatamente o problema de 2026-08-27. A reintrodução só se justifica porque veio junto com a
mudança de gatilho — as duas decisões são uma só, não duas independentes.

### `@debounce` vs `@around` — as três fases desta decisão

Esta parte da história vale a pena registrar por completo, porque as três fases ensinam
coisas diferentes e nenhuma delas está "errada" isoladamente.

**Fase 1 (2026-09-05) — `@debounce` sob medida.** Trocar o gatilho de `@connected` para os
setters, sem mais nada, criaria uma regressão aparente: um `<kb-headers key="X" value="Y">`
estático dispararia **duas vezes** — uma por attribute. Foi escrito um decorator
`@debounce` inteiro (`packages/middleware/debounce.js`, coalescência por `WeakMap`/Symbol
por instância) só para isso.

**Fase 2 (2026-09-06, primeira correção) — `@around` puro.** Ficou claro que a coalescência
não era necessária para *corretude*: `src/data/filter/filter.ts` resolve o mesmo formato de
problema (dois setters que precisam notificar o pai) com `@around(dispatch)` puro, sem
nenhuma coalescência, e nunca teve esse "problema" — porque `[dispatch]`/`[publish]` não
recebem argumentos e leem `this.key`/`this.value` **no momento em que rodam**, que é sempre
depois que qualquer escrita síncrona concorrente já aconteceu. Duas chamadas agendadas por
duas escritas leem o mesmo estado final e produzem o mesmo efeito colateral — a segunda é
redundante, não incorreta. `@debounce` foi removido do repositório (código zombie, rule
056) e `headers.ts` passou a usar `@around(publish)`, igual a `filter.ts`.

**Fase 3 (2026-09-06, decisão final) — `@debounce` de volta, por eficiência.** O consumidor
decidiu explicitamente manter a coalescência: mesmo sendo chamadas idempotentes, reduzir o
número de chamadas a `[setHeader]` é um objetivo em si para este pacote — "preciso do
debounce sobre o publish em headers, pois evitará chamadas duplicadas quando key e value
forem alterados juntos." Essa é uma resposta que **não se infere do código nem da
correção** — as duas soluções (com e sem coalescência) já eram corretas; a diferença é uma
preferência de eficiência, registrada aqui como decisão, não como bug corrigido.

`packages/middleware/debounce.js` foi restaurado, com esta forma: `debounce(wait = 250)` é
um decorator de método/setter que guarda o `timeoutID` pendente **na própria instância**,
sob um `Symbol` privado ao módulo — não num closure de escopo de classe (que seria
compartilhado por todas as instâncias, já que decorators rodam uma vez, na definição da
classe) nem num `WeakMap` externo (que também funcionaria, mas é uma indireção a mais sem
necessidade quando dá para guardar o estado no próprio objeto que ele descreve). Cada
chamada cancela o timer anterior e agenda um novo; só a última, decorrida `wait`, de fato
roda `original.call(context, ...args)`.

`headers.ts` usa `@around(publish)` nos dois setters (agenda uma chamada a `[publish]` a
cada escrita, via `setImmediate` — fire-and-forget, sem transformar o valor do setter,
mesma forma de `filter.ts`) e `@debounce(100)` em `[publish]` (coalesce as chamadas
próximas). A composição funciona em duas camadas: `@around` decide **que** `[publish]`
deve ser chamado depois de cada escrita, sem se importar com quantas vezes; `@debounce`,
aplicado ao próprio `[publish]`, decide **quando** essas chamadas agendadas de fato
executam — juntando as que caem na mesma janela de 100ms numa só.

**A lição, registrada em `.claude/skills/setter/SKILL.md`** (seção Troubleshooting): a
pergunta que decide entre `around` puro e `debounce` não é "está correto sem coalescer?" —
os dois quase sempre estão. É "reduzir o número de chamadas é, em si, um requisito?". Essa
resposta pede decisão explícita; não se deriva olhando o código.

### `role`/`Identity`: ausência correta, inalterada

Não implementar `get [role]()` nem entrar com `Identity` continua sendo a decisão certa,
pelas mesmas três razões já registradas para `kb-on`: `display: none` tira o elemento da
árvore de acessibilidade, não há conteúdo para nomear, e é um child declarativo de
configuração, não de apresentação.

### Paridade com `kb-on`, quebrada por esta versão

`kb-on` e `kb-headers` eram "o mesmo desenho escrito duas vezes" até esta mudança — mesma
cadeia (`Headless` só), mesmo par de Symbols, mesmo `@connected async [setter]()` de disparo
único. Isso deixou de valer: `kb-headers` agora tem `Echo` e um gatilho reativo
(`@around` + `@debounce`); `kb-on` continua `Headless(HTMLElement)` com wiring de disparo
único.

Isso não foi decidido nesta tarefa — o escopo pedido foi só `kb-headers`. Fica registrado
como pendência: com um segundo child declarativo do mesmo formato reativo (`kb-headers`) ao
lado do formato de disparo único (`kb-on`), vale uma decisão própria sobre se `kb-on`
deveria seguir o mesmo caminho, ou se a diferença é justificada (um arco escrevendo o valor
de um único header via `setter` é um caso de uso mais concreto do que um arco reconectando
um evento arbitrário via `kb-on`).

---

## 4. Gestão de Estado

| Dado | Onde mora | Controlado? | Regra de sincronização |
|---|---|---|---|
| `key` | `#key` privado + attribute `key` | Controlado — DOM é a fonte da verdade | `@attributeChanged('key')` grava no campo; `@around(publish)` chama `[publish]`. Não reflete de volta |
| `value` | `#value` privado + attribute `value` | Idem | Idem |
| Timer de coalescência de `[publish]` | Propriedade da própria instância, sob `Symbol('timeoutID')` privado ao módulo `debounce.js` | — | Um timer por instância; cancelado e reagendado a cada chamada; limpo (implicitamente, via `setTimeout` já disparado) quando roda |
| O par entregue ao pai | `#headers` do `<kb-fetch>` | — | Escrito no máximo uma vez por janela de 100ms de escritas de `key`/`value` |

**Estado derivado**: nenhum. **Estado compartilhado**: o `#headers` do pai é escrito por N
filhos sem coordenação entre eles — inalterado por esta versão.

---

## 5. Edge Cases

| # | Caso | Comportamento atual |
|---|---|---|
| 1 | Markup estático (`key`+`value` no HTML inicial) | **Uma única escrita** ao pai — `@debounce(100)` coalesce as duas chamadas de `[publish]` (uma por attribute) numa só, 100ms depois da última. Provado em `headers.test.js` ("a static header writes to the parent exactly once") |
| 2 | `key` vazia | **Sem guarda em `[publish]`**, por decisão do consumidor (2026-09-06) — a guarda é responsabilidade de `[setHeader]`, do lado de `kb-fetch`, ainda não implementada lá. `[setHeader]` recebe `('', value)` hoje |
| 3 | Sem pai (elemento conectado direto num shadow root) | **Sem guarda em `[publish]`** — mesma decisão. `this.parentElement.localName` lança se `parentElement` for `null` |
| 4 | Pai que é elemento HTML comum (`<div>`) | Sem guarda — `customElements.whenDefined('div')` rejeita com `SyntaxError`, unhandled rejection aceita, mesmo padrão de `kb-on`/`kb-filter`/`kb-find` |
| 5 | Dois `<kb-headers>` com a mesma `key` | O último a publicar sobrescreve o anterior em `#headers`, silenciosamente. Sem guarda de runtime (rule 023/064) — uso incorreto, verificável por review |
| 6 | `<kb-headers>` removido do DOM | O header **permanece** no pai. Não há `@disconnected`, e `kb-fetch` não expõe contrato de remoção |
| 7 | `key`/`value` alterados após a conexão (por JS ou por arco `on`) | **Chegam ao pai.** É o comportamento que esta versão existe para habilitar. Provado em `headers.test.js` ("an Echo arc updates the header after connection") |
| 8 | Duas escritas síncronas no mesmo turno (`el.key = 'A'; el.value = 'B'`) | **Uma única publicação**, com o par final (`'A'`, `'B'`) — nunca um par intermediário, graças ao `@debounce`. Provado em `headers.test.js` ("two synchronous writes in the same turn collapse into one call") |
| 9 | Escrita antes da conexão | O timer de `@debounce` é agendado independente do estado de conexão; quando dispara (100ms depois), `[publish]` lê `this.parentElement`, que já estará preenchido se o elemento tiver sido conectado nesse intervalo — não é uma garantia formal, é uma janela de tempo generosa o bastante na prática. Provado em `headers.test.js` ("a write made before connection is not lost, nor sent early") |
| 10 | Reconectar o elemento (mover no DOM) | Nada dispara automaticamente na reconexão — não há hook de `@connected` neste pacote. Só uma nova escrita de `key`/`value` (ou um arco) republica |
| 11 | Leitor de tela | Não anuncia nada, e é o correto: `display: none` mantém o elemento fora da árvore de acessibilidade |
| 12 | Credencial real no markup | Continua fora do alcance deste elemento — o valor fica em texto puro no HTML servido |

### Cobertura

`headers.test.js` tem 8 testes, todos verdes: os 4 originais que já provavam a integração
real com `<kb-fetch>` (entrega do header numa requisição, combinação de múltiplos
`<kb-headers>` irmãos, defaults `''`, guarda de `key` vazia — essa última hoje prova o
comportamento de `[publish]` sem guarda própria, não uma guarda que já não existe) e 4 para
o gatilho reativo — markup estático produz uma escrita, arco `Echo` atualiza pós-conexão,
duas escritas síncronas colapsam em uma, escrita pré-conexão não se perde. O teste de "sem
unhandled rejection sob pai HTML comum" continua removido, não substituído — ver Edge case 4.

**Achado adjacente, ainda em aberto**: `src/data/fetch/` continua sem `fetch.test.js`
próprio.

---

### Revisão de `designer`: não se aplica

Este pacote não tem token, custom property, cor, shadow root nem estado visual. A única
declaração de estilo do elemento é o `display: none` que `Headless` aplica. Não há revisão
de `designer` pendente, e não deve ser aberta uma.

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável | Status |
|---|---|---|
| Decisão original de remover `Echo` (2026-08-27) | `architect` | Histórico — ver seção 3 |
| Decisão de reintroduzir `Echo` + trocar o gatilho para setters (2026-09-05) | `architect` | Concluído — `Echo` fica |
| Fase 1: `@debounce` sob medida (2026-09-05) | consumidor | Histórico — substituído na Fase 2 |
| Fase 2: correção para `@around` puro (2026-09-06) | consumidor + orquestrador | Histórico — substituído na Fase 3; a lição sobre quando `around` já basta ficou registrada em `.claude/skills/setter/SKILL.md` |
| Fase 3: `@debounce` restaurado por decisão explícita de eficiência (2026-09-06) | consumidor | Concluído — `headers.ts` usa `@around(publish)` + `@debounce(100)` em `[publish]`; `packages/middleware/debounce.js` recriado, guardando o timer na própria instância (`Symbol` privado) |
| Guarda de `parentElement`/`key` vazia — movida de `[publish]` para `[setHeader]` | `developer` | **Pendente** — decisão tomada, `fetch.ts` ainda não implementa a guarda |
| `types.d.ts` — reintrodução de `on`/`KUBAHeadersOnAttribute`, conferido contra `achatamento-mixins.md` e `button/types.d.ts` | `developer` | Concluído (2026-09-05), inalterado pelas fases seguintes |
| Testes do gatilho reativo (markup estático, arco pós-conexão, escritas síncronas, escrita pré-conexão) | consumidor + orquestrador | Concluído (2026-09-06) — 8 testes, suíte inteira verde (158/158) |
| `.claude/skills/setter/SKILL.md` — entrada de Troubleshooting sobre a escolha entre `around` puro e `debounce` | orquestrador | Concluído (2026-09-06), revisado depois da Fase 3 para não recomendar cegamente `around` |
| `fetch.test.js` — pacote pai continua sem teste próprio | `tester` | **Pendente** — fora do escopo desta mudança, achado adjacente |
| Reabrir a decisão de gatilho de `kb-on` à luz da paridade quebrada com `kb-headers` | `architect` | **Pendente** — fora do escopo desta tarefa, registrado na seção 3 |
| Página de documentação (`website/docs/components/`) | `writer` | **Não se aplica** — elemento headless, sem representação visual, pulado pelo fluxo `/craft` |

---

**Criado em**: 2026-08-22
**Atualizado em**: 2026-09-06
**Versão**: 2.2
