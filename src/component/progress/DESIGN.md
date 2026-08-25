# DESIGN — `kb-progress`

**Pacote**: `src/component/progress/`
**Tag**: `<kb-progress>`
**Status**: especificação — registrada após a implementação, como referência do contrato
**Data**: 2026-08-25
**Nota**: auditoria completa em 2026-08-24 encontrou e corrigiu dois bugs — a faixa ARIA
nunca era publicada quando `value` estava ausente do markup, e `value` chegava sem validação
à interpolação CSS. `'0'`/`'100'` eram constantes mágicas (rule 024) espalhadas por dois
métodos — extraídas para o enum `RANGE` (`range.js`). Duas revisões finais pré-`/ship` em
2026-08-25 acharam a correção de injeção incompleta em dois níveis sucessivos: primeiro, o
filtro `numeric` validava com `Number.parseFloat` mas propagava a *string crua* (corrigido
propagando o número reconvertido, nunca o texto original); depois, esse filtro só protegia o
caminho de attribute (`@attributeChanged`) — `progress.value = payload` (atribuição direta na
propriedade, sem passar pelo attribute) alcançava o setter sem sanitização nenhuma. Corrigido
extraindo a validação para `toNumericString` (`packages/directive/attributeChanged/numeric.js`)
e aplicando-a **também dentro do próprio setter**, não só no filtro de attribute — os dois
caminhos de entrada convergem na mesma guarda agora. Ver seções 2 e 5. `types.d.ts` também
corrigido no mesmo dia: publicava `internals` como propriedade do contrato (divergindo de
`button`/`icon`/`cover`) e faltava o tipo `on` (herdado de `Echo`, nunca declarado).

---

Este documento segue o framework LLD (5 passos) e registra o comportamento de `kb-progress`
tal como implementado. Ele é a fonte da verdade: quando a implementação divergir dele, é a
implementação que está errada, não o inverso. Mudança de comportamento passa primeiro por
uma revisão deste documento, depois pelo código — nunca o contrário.

## Visão Geral

`kb-progress` é uma barra de progresso linear e determinada: `value` é uma percentagem que
o consumidor define, espelhada tanto na largura visual quanto na faixa ARIA
(`aria-valuenow`/`aria-valuemin`/`aria-valuemax`) via `internals`. Ele existe para dar ao
design system um indicador de progresso acessível por padrão, sem que cada consumidor
reimplemente `role="progressbar"` e o espelhamento ARIA à mão.

O que ele **não** é: indeterminado (não expressa "carregando, duração desconhecida" — um
spinner faz isso), nem input (é saída; um controle que o usuário arrasta é um slider), nem
um contador de passos navegável (isso é um stepper rotulado).

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | Upload, formulário multi-etapa, job em lote, indicador de quota/força de senha |
| Somente leitura ou interativo | Somente leitura — é saída, nunca aceita entrada do usuário |
| Caso de uso mínimo (MVP) | Renderizar uma barra preenchida por `value`, com `role="progressbar"` e faixa ARIA espelhada |
| Nome acessível | Via `alt`, herdado do mixin `Identity` — descreve o que está progredindo |
| Superfície de variação | `value` (percentual); cor e espessura vêm de custom properties de CSS, não de attributes |
| Faixa de valores | Fixa em 0–100, porque `value` é aplicado direto como `%` de largura |
| Clamping | Nenhum — decisão de produto, documentada (ver Edge Cases) |

**Requisitos funcionais**

1. Renderiza uma barra preenchida em `value`% de largura, com trilho e indicador
   estilizáveis por token.
2. Publica `role="progressbar"` no host via `internals.role`.
3. Espelha `value` em `internals.ariaValueNow`, com `aria-valuemin="0"` e
   `aria-valuemax="100"` fixos.
4. Publica a faixa ARIA completa no connect, mesmo sem `value` no markup — não deixa
   `aria-valuenow`/`min`/`max` indefinidos (ver Edge Cases, correção de bug).
5. Aceita `alt` (herdado de `Identity`) como nome acessível do que está progredindo.
6. Rejeita qualquer valor sem prefixo numérico antes que ele alcance o setter ou a
   interpolação CSS; um valor com prefixo numérico seguido de texto mantém só o número
   convertido, nunca o texto (ver Edge Cases, correção de bug).

**Não-requisitos (YAGNI, rule 023)**

- Estado indeterminado — é outro componente (spinner/skeleton).
- Faixa configurável (`min`/`max` diferentes de 0–100) — sem consumidor pedindo; ver seção 5.
- Clamping do valor — decisão de produto mantida deliberadamente (ver Edge Cases).
- Transição animada na largura — o indicador não expõe `::part()`, então uma curva de
  easing não poderia ser customizada de fora; atualizar numa cadência que já leia bem é
  responsabilidade do consumidor.

---

## 2. Contrato Público

### Attributes / Properties

| Nome | Tipo | Default | Reflete | Especificação |
|---|---|---|---|---|
| `value` | `string` | `RANGE.MIN` (`'0'`) | sim | Percentual de preenchimento, aplicado direto como `%` de largura CSS e espelhado em `aria-valuenow`. Sanitizado por `toNumericString` (`packages/directive/attributeChanged/numeric.js`) em **dois pontos**: no filtro `numeric` do `@attributeChanged` (caminho de attribute) e dentro do próprio setter (caminho de atribuição direta na propriedade) — um valor sem prefixo numérico nunca é aceito por nenhum dos dois caminhos, e um valor com texto após o prefixo numérico vira só o número, nunca o texto |
| `alt` | `string` | `''` | sim | Herdado de `Identity` — nome acessível do que está progredindo |
| `internals` | `ElementInternals` (readonly) | — | não | Compartilhado por `Identity` e pelo próprio elemento. **Não é publicado em `types.d.ts`** — é uso interno dos mixins, não contrato do consumidor (decisão do `architect`, 2026-08-25, aplicada aos oito pacotes) |
| `on` | arco `source/event:type/sink` | `undefined` | sim | Mixin `Echo` |

Nenhum attribute de faixa (`min`/`max`) — a escala é fixa em 0–100 porque `value` é aplicado
direto como `%`; ver Não-requisitos.

### Events

Nenhum. O componente é puramente de saída.

### Slots

Nenhum. O shadow root renderiza um único `<div>` indicador, sem slot — um rótulo vai ao lado
da barra, não dentro dela.

### Custom properties de CSS (pontos de extensão)

| Custom property | Default | Controla |
|---|---|---|
| `--progress-color-track` | `var(--color-pure-white)` | Cor de fundo da porção não preenchida |
| `--progress-color-indicator` | `var(--color-primary)` | Cor de preenchimento da porção completa |
| `--progress-size-height` | `6px` | Espessura da barra |
| `--progress-border-radius` | `var(--border-radius-pill)` | Arredondamento de canto, trilho e indicador juntos |

Nenhum `::part()` — as custom properties são toda a superfície de extensão.

**Rule 037 (flag arguments)**: nenhum attribute booleano no contrato.

---

## 3. Composição

**Cadeia**: `Identity(Echo(HTMLElement))`

| Mixin | Traz | Por que entra na cadeia |
|---|---|---|
| `Identity` | `alt` ↔ `internals.ariaLabel`, publicação de `[role]` em `internals.role` no connect | A barra precisa de nome acessível opcional e papel `progressbar` |
| `Echo` | Sistema de eventos: `on`, arco declarativo | O progresso se conecta a outros elementos sem listener escrito na página |

**Sobre não usar o mixin `Value`** (`packages/mixin/value.ts:4-19`): ele entrega exatamente
o par `get value`/`@attributeChanged('value') set value` — já usado por
`src/component/button/button.ts:20` — mas dois motivos afastam `Progress` dele: o setter do
mixin não tem default (`value.ts:9` retorna `undefined`; `Progress` precisa de `RANGE.MIN`),
e o setter de `Progress` empilha `@retouch` e `@around(measurable)`, que o mixin não tem como
carregar. `progress.ts:28-34` documenta a recusa no próprio getter/setter, no mesmo padrão
que `button.ts:31-36` usa para explicar por que não usa `Identity`.

**`RANGE`** (`range.js`): enum congelado com `MIN`/`MAX`, extraído porque `'0'` e `'100'`
apareciam como constantes mágicas em dois métodos diferentes de `progress.ts` (o default de
`value` e os três campos de `[measurable]()`) — rule 024. `MIN` também serve de default de
`value`, então a faixa e o ponto de partida da barra vêm da mesma fonte.

**Sub-elemento**: nenhum. O `<div>` indicador vive no shadow root, sem segunda tag pública.

**`attachInternals()`**: uma única chamada, lazy, compartilhada pelo mixin `Identity` e pelo
próprio elemento.

**Symbol privado**: `measurable` (`interfaces.js`) é o método bracket que espelha `value` na
faixa ARIA. Roda em dois gatilhos — `@connected` (garante o default no mount, mesmo sem
`value` no markup) e `@around(measurable)` no setter de `value` (mudanças subsequentes). Não
é um contrato que atravessa pacotes, por isso é `Symbol()` local, não `Symbol.for()`.

---

## 4. Gestão de Estado

| Dado | Onde mora | Controlado? | Regra de sincronização |
|---|---|---|---|
| `value` | campo privado + attribute | Controlado — DOM é a fonte da verdade | `@attributeChanged('value', numeric)` filtra o caminho de attribute; o próprio setter também chama `toNumericString` e usa guard clause, filtrando o caminho de atribuição direta na propriedade; `@retouch` reprocessa o estilo; `@around(measurable)` dispara `[measurable]()` |
| `alt` | herdado de `Identity` | Controlado | Ver `DESIGN.md` de `logo`/`icon` para o mecanismo — não redeclarado aqui |
| papel (`progressbar`) | `internals.role`, publicado por `Identity` | Derivado | `[role]` é getter fixo, lido uma vez no connect |
| faixa ARIA (`ariaValueNow`/`Min`/`Max`) | `internals.*` | Derivado de `value` | Publicada no `@connected` (com `value` no default `RANGE.MIN` se ausente) e recalculada a cada mudança válida de `value` |

**Estado derivado**: a faixa ARIA inteira é espelho de `value`, nunca escrita diretamente
pelo consumidor.

**Bug corrigido nesta auditoria**: antes, `[measurable]()` só rodava via
`@around(measurable)`, que só dispara quando o setter de `value` roda, que só é acionado por
`attributeChangedCallback` — que o navegador nunca invoca para um attribute que nunca esteve
presente. Um `<kb-progress>` sem `value` no markup deixava `aria-valuenow`/`min`/`max`
`null` para sempre, embora `value` (a propriedade) retornasse `RANGE.MIN` corretamente — um leitor
de tela recebia `role="progressbar"` sem faixa nenhuma, lido como indeterminado, enquanto a
barra pintava visualmente em 0%. Corrigido acrescentando `@connected` a `[measurable]()`
(`progress.ts:55`), no mesmo padrão que `Identity` já usa para `[identifiable]()`.

---

## 5. Edge Cases

| # | Caso | Comportamento requerido |
|---|---|---|
| 1 | `value` ausente do markup | `aria-valuenow="0"`, `aria-valuemin="0"`, `aria-valuemax="100"` (`RANGE.MIN`/`RANGE.MAX`) publicados no connect (bug corrigido; antes ficavam `null`) |
| 2 | `value` presente e válido | Faixa ARIA espelha o valor; largura CSS aplica o mesmo número como `%` |
| 3 | `value` muda depois do connect | `aria-valuenow` acompanha via `@attributeChanged` → `@around(measurable)` |
| 4 | `value > 100` | Sem clamping — o indicador fica visualmente mais largo que o trilho, mas `overflow: hidden` (`style.js:11`) esconde o excesso; `aria-valuenow` anuncia o número verbatim, incluindo o overshoot que a tela esconde. Decisão de produto documentada, não bug |
| 5 | `value < 0` | Sem clamping — largura CSS inválida colapsa o indicador a nada (visualmente idêntico a `0`); `aria-valuenow` anuncia o número negativo verbatim |
| 6 | `value` sem prefixo numérico via attribute (ex: `"abc"`) | Filtro `numeric` bloqueia antes do setter — propriedade mantém o último valor válido |
| 6b | `value` com prefixo numérico seguido de outro texto via attribute (ex: `"50; } :host { display: none }…"`) | `numeric` propaga só `toNumericString(value)` — o texto após o prefixo nunca chega ao setter nem à interpolação CSS. Não é rejeição: `value` vira `'50'`, sanitizado, não o texto original nem o último valor válido |
| 6c | `progress.value = payload` — mesmos dois casos acima, mas via atribuição direta na propriedade, sem passar pelo attribute | Comportamento idêntico aos casos 6 e 6b — o setter aplica `toNumericString` internamente com guard clause, então bypassar `@attributeChanged` não bypassa a sanitização |
| 7 | Sem `alt` | Nome acessível ausente — papel e número são anunciados, mas nada diz o que está progredindo (aceito; ver docs, "Give it an alt") |
| 8 | `--progress-color-track` não sobrescrito em fundo branco | Trilho branco sobre fundo branco desaparece — responsabilidade do consumidor ajustar o token |

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável |
|---|---|
| Contrato público, cadeia de mixins, Symbol `measurable`, `toNumericString`/filtro `numeric`, enum `RANGE` | `architect` |
| Tokens `--progress-*`, uso semântico da cor do indicador | `designer` |
| Implementação de `value`, `Identity`, `Echo`, `[measurable]` | `developer` |
| Prova de cada requisito e edge case desta especificação | `tester` |
| Página de `docs/components/progress.md` | `writer` |

---

**Criado em**: 2026-08-24
**Atualizado em**: 2026-08-25
**Versão**: 1.2
