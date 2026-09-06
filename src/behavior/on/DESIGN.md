# DESIGN — `kb-on`

**Pacote**: `src/behavior/on/`
**Tag**: `<kb-on>`
**Status**: documentação retroativa — a implementação precede este documento
**Data**: 2026-08-27
**Atualizado**: 2026-08-27 — guarda de custom element removida a pedido do consumidor; resta só a guarda de `parentElement` nulo (ver seção 5)

---

Este documento segue o framework LLD (5 passos) e descreve `kb-on` como ele existe hoje.
O pacote foi escrito antes de qualquer processo formal de design neste repositório e nunca
teve especificação própria. O objetivo é duplo: registrar a forma já implementada, sem
redesenhá-la, e apontar com evidência onde ela está descoberta ou incoerente com o gêmeo
estrutural direto, `kb-headers` (`src/data/headers/`, ver `src/data/headers/DESIGN.md`).

A partir desta versão vale a mesma regra dos outros: quando implementação e documento
divergirem, é a implementação que está errada. Mudança de comportamento passa primeiro por
uma revisão deste documento, depois pelo código.

## Visão Geral

`kb-on` é um **child declarativo headless**: um elemento que nunca renderiza, existe só no
markup, e cuja única função é **mutar o pai**. Ao conectar, ele espera o pai subir
(`customElements.whenDefined`) e chama `parentElement[connectArc](this.value)`, registrando
um arco de evento no host que o contém.

O que ele resolve: o attribute `on="..."` de um elemento `Echo` só cabe uma vez por host. Um
componente que precisa reagir a dois eventos diferentes — um `<kb-render>` que limpa em um
evento e renderiza em outro, por exemplo — não tem como escrever dois `on` no mesmo elemento.
`<kb-on>` é a saída: cada instância carrega um arco, e um host pode ter quantos filhos
`<kb-on>` precisar. `on.test.js` prova exatamente essa forma: dois `<kb-button>` disparando
`clicked`, um único `<kb-on value="*/clicked:method/render">` como filho do `<kb-render>`,
capturando ambos via o coringa `*`.

A escolha estruturante do pacote é que **a mutação mora no filho, não no pai** — igual a
`kb-headers`. O host `Echo` não varre seus filhos procurando arcos; cada filho se anuncia
chamando `[connectArc]`. Isso mantém o host fechado para modificação (rule 011) e mantém o
grafo de pacotes acíclico (rule 018): `src/behavior/on/` não importa `@echo`, e `@echo` não
importa `src/behavior/on/`; o encontro acontece pelo registro global de Symbols
(`Symbol.for('connectArc')`), declarado nos dois lados.

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | O autor de markup cujo host `Echo` já usa `on` para um arco e precisa de um segundo (ou mais), ou que prefere expressar o arco como elemento em vez de string de attribute |
| Somente leitura ou interativo | Nem um nem outro: é declarativo. Não tem interação própria, e sua leitura útil é feita pelo pai, não pelo consumidor |
| Caso de uso mínimo (MVP) | Ler `value` do markup e entregá-lo ao pai, uma vez, depois que o pai estiver definido |
| Participa de `<form>` | Não |
| Papel e nome acessível | Nenhum, e corretamente nenhum — ver seção 3 |
| Superfície de variação | `value`; nada mais |
| Sub-elemento interno | Nenhum. Sem `attachShadow`, sem template, sem estilo próprio |

**Requisitos funcionais**

1. Expõe `value` como propriedade string, sincronizada a partir do attribute homônimo via
   `@attributeChanged`, com default `''`.
2. Ao conectar, aguarda `customElements.whenDefined(parentElement.localName)` antes de
   qualquer wiring — no instante do `connectedCallback` o pai pode ainda não ter sido
   upgradado e não ter `connectArc`.
3. Chama `parentElement[connectArc]?.(this.value)` opcionalmente: um pai que não expõe o
   contrato (não é `Echo`) não causa erro.
4. Nunca renderiza: `Headless` aplica `display: none` inline no host, ao conectar.
5. Não muta `this` — o efeito inteiro do elemento é sobre o pai.

**Não-requisitos (YAGNI, rule 023)**

- Desconectar o arco ao desconectar. Não há `@disconnected`, embora `disconnectArc` exista
  no registro global (`packages/echo/interfaces.js:5`) e o próprio `Echo` o use
  internamente. Ver Edge case 6.
- Validar a forma da string `value` (`source/event:type/sink`) em runtime. A validação é só
  de tipo, via o template literal `KUBAOnValueAttribute` em `types.d.ts`, e só cobre string
  literal — uma variável cai em `string` sem checagem.
- Papel ARIA, `alt`, `Identity`. Um elemento que nunca chega à árvore de renderização não
  tem o que anunciar.
- Slot, `part`, custom property, token. Sem shadow root, não há superfície visual nenhuma —
  este pacote não tem, e não deve ter, revisão de `designer`.
- Aceitar mais de um arco por elemento. Um arco por `<kb-on>` é o desenho; múltiplos arcos
  se resolvem com múltiplos elementos, como `on.test.js` demonstra.

---

## 2. Contrato Público

### Attributes / Properties

| Nome | Tipo | Default | Reflete | Especificação |
|---|---|---|---|---|
| `value` | `string` | `''` | não | Arco no formato `source/event:type/sink` (opcionalmente com `\|filter=valor`), no formato que `Echo` também usa em seu attribute `on`. Setter decorado com `@attributeChanged('value')`; grava em `#value`. Getter usa `??= ''`, então ler antes de qualquer escrita devolve `''`, não `undefined` |

Não há `on`, `hidden`, `height`, `width`, `internals` nem `value` de formulário no sentido de
`ElementInternals` — `kb-on` não é `Echo`, então não tem `on` próprio (seria incoerente: um
elemento que *é* um arco não recebe outro arco). Não há `attachInternals()` no pacote: sem
papel e sem estado ARIA, não há o que anexar.

**Rule 037 (flag arguments)**: nenhum attribute booleano no contrato.

### Events

Nenhum. `kb-on` não despacha nada — está fora da cadeia `Echo`, então não há eco de
`dispatchEvent` a considerar (diferente de `kb-headers`, que tem `Echo` na cadeia sem usá-lo).

### Slots e Parts

Nenhum dos dois, e nenhum shadow root. Conteúdo colocado entre as tags fica no light DOM de
um elemento com `display: none`, ou seja, invisível e inerte.

### Symbols publicados

| Symbol | Forma | Alcance | Papel |
|---|---|---|---|
| `connectArc` | `Symbol.for('connectArc')` | Global (registro do processo) | Chave do método que o **pai** implementa (via `Echo`) e que este elemento **invoca**. Declarado aqui (`interfaces.js:6`) e em `packages/echo/interfaces.js:4`, cada um com o comentário justificando o registro global |
| `setter` | `Symbol('setter')` | Módulo | Chave do método decorado com `@connected` que faz o wiring. Interno; nenhum outro pacote o toca |

A forma confere com a taxonomia do repositório
(`.claude/skills/naming/references/taxonomia-symbol.md`): `Symbol.for` para o contrato
resolvido por outro pacote, `Symbol()` para o interno, e `connectArc` é citado nominalmente
como um dos sete casos legítimos de registro global, na categoria "Operação exportada —
`verbNoun`". `kb-headers` é o precedente estrutural direto — o mesmo par de Symbols, a mesma
redação de comentário, o mesmo `@connected async [setter]()`.

**Sobre a declaração ser duplicada em vez de importada.** `src/behavior/on/` não importa de
`@echo`, nem `@echo` de `src/behavior/on/` — cada um declara seu `Symbol.for('connectArc')`.
É deliberado: importar criaria uma aresta entre um pacote de comportamento e um pacote de
infraestrutura, e a direção dela seria arbitrária. O registro global permite o encontro sem
aresta, mantendo o DAG (rule 018) e cada pacote publicável sozinho (rule 015).

---

## 3. Composição

**Cadeia**: `Headless(HTMLElement)`

| Mixin | Traz | Avaliação |
|---|---|---|
| `Headless` | Hook `@connected [hideable]()` que aplica `display: none` inline no host | **Necessário e suficiente.** É a razão de ser do elemento: ele existe no markup e não pode ocupar espaço nem aparecer |

Esta é a cadeia mínima, e é a razão pela qual `kb-headers` é discutido em seu próprio
`DESIGN.md` como um desvio: `kb-on` é o gêmeo que **não** adiciona `Echo`, e por isso não
carrega a divergência de comportamento (`on` documentado mas sem efeito por causa do wiring
de disparo único) que aquele pacote tem. Aqui não há attribute `on` para prometer algo que o
disparo único não cumpre — o único attribute é `value`, consumido exatamente uma vez, no
`@connected`, e é exatamente isso que o elemento promete fazer.

### `role`/`Identity`: ausência correta

Não implementar `get [role]()` nem entrar com `Identity` é a decisão certa, pelas mesmas três
razões que valem para `kb-headers`: `display: none` tira o elemento da árvore de
acessibilidade, não há conteúdo para nomear, e é um child declarativo de configuração, não de
apresentação. `kb-on`, `kb-headers`, `kb-fetch`, `kb-dataset` e `kb-filter` usam todos
`Headless` e nenhum usa `Identity`.

---

## 4. Gestão de Estado

| Dado | Onde mora | Controlado? | Regra de sincronização |
|---|---|---|---|
| `value` | `#value` privado + attribute `value` | Controlado — DOM é a fonte da verdade | `@attributeChanged('value')` grava no campo. Não reflete de volta. Não reenvia ao pai |
| O arco entregue ao pai | Estado interno de `Echo`, no pai | — | Escrito uma única vez, no `@connected` deste elemento, depois que o pai sobe |

**Estado derivado**: nenhum. **Estado compartilhado**: `Echo` do pai acumula um arco por
`connectArc` recebido — de attribute `on` e de cada filho `<kb-on>` — sem coordenação entre
os filhos. Não é violação da rule 070 (o estado é privado do pai e alcançado só pelo contrato
`connectArc`), e múltiplos `<kb-on>` no mesmo host é o caso de uso pretendido, ao contrário de
`kb-headers`, onde duas instâncias com a mesma `key` colidem.

O elemento em si não tem estado observável além de `value`. Não há `internals.states`, não
há `@repaint`/`@retouch`, não há template.

---

## 5. Edge Cases

| # | Caso | Comportamento requerido |
|---|---|---|
| 1 | Pai ainda não upgradado no `connectedCallback` | Coberto por desenho: `await customElements.whenDefined(...)` existe exatamente para isso, e é a razão de `[setter]` ser `async` |
| 2 | `value` vazio | Sem guarda. `parent[connectArc]?.('')` é chamado; o comportamento resultante depende inteiramente de como `Echo.connectArc` trata uma string vazia — não investigado aqui, por estar fora deste pacote |
| 3 | Sem pai (elemento conectado direto num shadow root) | **Guardado.** `if (!parent) return this` (`on.ts`) retorna cedo antes do `await customElements.whenDefined(...)`. `types.d.ts` já dizia "has no effect", e a frase segue correta |
| 4 | Pai que é elemento HTML comum (`<div>`) | **Sem guarda, a pedido do consumidor (2026-08-27).** A verificação de nome de custom element foi removida por decisão explícita — `<kb-on>` sob um pai HTML comum volta a rejeitar (`customElements.whenDefined('div')` devolve promise rejeitada com `SyntaxError`, por `'div'` não ser nome válido de custom element). O consumidor aceita esse retorno; a guarda não deve ser reintroduzida por outro meio |
| 5 | Dois ou mais `<kb-on>` no mesmo host | Caso de uso pretendido e provado por teste (`on.test.js`): cada um chama `connectArc` uma vez, e `Echo` acumula os arcos |
| 6 | `<kb-on>` removido do DOM depois de conectado | O arco **permanece** ativo no pai. Não há `@disconnected` neste pacote que chame `disconnectArc`, embora o Symbol exista no registro global (`packages/echo/interfaces.js:5`) para uso interno de `Echo`. Omissão deliberada hoje; vira lacuna no dia em que um arco precisar ser condicional à presença do `<kb-on>` |
| 7 | `value` alterado após a conexão (por JS) | Não chega ao pai. `@connected` dispara uma vez só — mesma mecânica de `kb-headers`, mesma consequência |
| 8 | Reconectar o elemento (mover no DOM) | `@connected` roda de novo, então o arco é reenviado — único caminho pelo qual uma alteração tardia de `value` alcança o pai hoje |
| 9 | Leitor de tela | Não anuncia nada, e é o correto: `display: none` mantém o elemento fora da árvore de acessibilidade e da árvore de renderização |

### Paridade com `kb-headers`, o gêmeo estrutural

`src/behavior/on/on.ts` e `src/data/headers/headers.ts` são o mesmo desenho escrito duas
vezes, com a análise completa no `DESIGN.md` de `kb-headers` (seção "Paridade com `kb-on`").
As três divergências registradas ali continuam válidas vistas deste lado:

1. **`Echo`**: `kb-headers` tem, `kb-on` não — e é essa ausência que mantém `kb-on` livre da
   divergência entre `on` documentado e wiring de disparo único.
2. **Superfície**: `kb-on` expõe uma propriedade (`value`); `kb-headers` expõe duas.
3. **Teste**: `kb-on` tem `on.test.js`, prova o caso de múltiplos filhos no mesmo host;
   `kb-headers` não tem teste nenhum.

Não vale a pena extrair a duplicação para um mixin comum agora — mesmo raciocínio do
`DESIGN.md` de `kb-headers`: duas classes de ~30 linhas, dois consumidores, rule 021 fala em
mais de dois lugares antes de exigir extração.

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável | Status |
|---|---|---|
| Contrato público, cadeia de mixins, Symbols, forma do wiring pai/filho | `architect` | Concluído |
| Confirmação de `Symbol.for('connectArc')` contra a taxonomia e contra o precedente `kb-headers` | `architect` | Concluído — conforme |
| Confirmação de que `Identity`/`role` não se aplica | `architect` | Concluído — ausência correta |
| Teste do pacote — existe e prova o caso central (múltiplos arcos no mesmo host) | `tester` | Concluído — `on.test.js` |
| Rejeição não tratada de `whenDefined` quando o pai não é custom element (compartilhado com `kb-headers`) | consumidor | **Reaberto e não guardado (2026-08-27)** — o consumidor removeu a guarda `CUSTOM_ELEMENT_NAME` dos dois pacotes por decisão explícita; aceita a rejeição sob pai HTML comum. Só resta `if (!parent) return this` para `parentElement` nulo |
| Comportamento de `Echo.connectArc` recebendo `value` vazio | fora do escopo deste pacote | **Não investigado** — pertence ao `DESIGN.md` de `@echo`, se vier a existir |
| `types.d.ts` afirmar que uso standalone "has no effect" | `writer` | Concluído (2026-08-27) — confirmado correto, a guarda tornou a frase verdadeira |

---

**Criado em**: 2026-08-27
**Atualizado em**: 2026-08-27
**Versão**: 1.0
