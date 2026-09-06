# DESIGN — `kb-text`

**Pacote**: `src/typography/text/`
**Tag**: `<kb-text>`
**Status**: documentação retroativa — a implementação precede este documento
**Data**: 2026-09-06

---

Este documento segue o framework LLD (5 passos) e registra o comportamento de `kb-text`
tal como implementado. Ele é a fonte da verdade: quando a implementação divergir dele, é a
implementação que está errada, não o inverso. Mudança de comportamento passa primeiro por
uma revisão deste documento, depois pelo código — nunca o contrário.

O pacote foi escrito antes de qualquer processo formal de design neste repositório. Numa
passagem recente (`text.ts`, `text/types.d.ts` — working tree, ainda não commitado) os seis
attributes de aparência ganharam validação por conjunto fechado (`enumerated`) e o
`types.d.ts` ganhou tipos nomeados e o membro `on` herdado de `Echo`. Este documento
descreve o estado depois dessa passagem.

## Visão Geral

`kb-text` é o primitivo de **texto de corpo e inline** do design system: um `<slot>` cujo
`:host` mapeia seis attributes de aparência — `color`, `size`, `weight`, `family`,
`line-height`, `align` — sobre as custom properties do `packages/pixel`. Não carrega
semântica de documento (não é `<h1>`..`<h6>`, não é `<p>`), não despacha eventos, e não tem
caixa própria — comporta-se como conteúdo inline no fluxo que o cercar.

O que ele **não** é: um título com nível semântico (isso é markup nativo dentro do slot, ou
composição do consumidor), um rótulo de formulário (`kb-label`), texto auxiliar de campo
(`kb-helper`), nem um glifo (`kb-icon`). Todos os três primos de `src/typography/` que só
atribuem slot (`kb-label`, `kb-helper`) existem para casos que `kb-text` deliberadamente
não cobre.

---

## 1. Requisitos

| Pergunta (LLD passo 1) | Resposta |
|---|---|
| Quem consome, em que contexto | Praticamente toda página de `website/docs/`, e todo componente que precise de texto estilizado pelo sistema sem uma regra CSS avulsa |
| Somente leitura ou interativo | Somente leitura — estrutural, não interage; só recebe (via `on`) |
| Caso de uso mínimo (MVP) | Um `<slot>` que herda os seis tokens default, sem nenhum attribute definido |
| Participa de `<form>` | Não |
| Papel e nome acessível | Nenhum — sem `Identity` na cadeia; a semântica vem do markup colocado dentro do slot |
| Superfície de variação | `align`, `color`, `family`, `line-height`, `size`, `weight` — todos conjunto fechado; `on` herdado de `Echo` |
| Sub-elemento interno | Nenhum. O shadow root é um único `<slot>` |

**Requisitos funcionais**

1. Renderiza um `<slot>` default; o `:host` recebe os seis eixos de tipografia
   (`component.js`, `style.js`).
2. `color` resolve `var(--color-{value})`, aceitando toda a escala de
   `packages/pixel/tokens/color.css` — os 42 tokens, incluindo os degraus (`master-dark`),
   diferente de `kb-icon`/`kb-button`, que só usam o nome-base da família.
3. `family`, `line-height`, `size`, `weight` resolvem `var(--font-family-{value})`,
   `var(--line-height-{value})`, `var(--font-size-{value})`, `var(--font-weight-{value})`.
4. `align` é interpolado **direto** em `text-align` (`style.js`), não roteado por custom
   property.
5. Os seis attributes são validados contra um `Object.freeze` local
   (`align.js`, `color.js`, `family.js`, `lineHeight.js`, `size.js`, `weight.js`) via
   `enumerated(...)` no `@attributeChanged`: um valor fora do conjunto nunca chega ao
   setter, e a propriedade mantém o último valor válido.
6. Cada mudança de attribute dispara `@repaint` — re-executa `component` e `style`.

**Não-requisitos (YAGNI, rule 023)**

- Evento próprio — o texto não interage. `Echo` está na cadeia como **receptor** de arco,
  nunca emissor.
- `Hidden` / `Width` / `Height` — um trecho de texto condicional é removido pelo consumidor
  ou escondido pelo container; a largura é a do fluxo inline. Abrir esses eixos criaria
  segunda fonte de verdade para a caixa.
- `Identity` / papel ARIA — texto de corpo não tem papel a publicar; a semântica é do
  conteúdo do slot (`<strong>`, `<a>`, um heading nativo).
- Níveis de heading como attribute (`level="1"`) — seria semântica de documento embutida
  num primitivo de estilo; markup nativo no slot resolve.

---

## 2. Contrato Público

### Attributes / Properties

| Nome | Tipo | Default | Reflete | Especificação |
|---|---|---|---|---|
| `align` | `KUBATextAlignAttribute` (`left` \| `center` \| `right` \| `justify`) | `'left'` | não | `enumerated(ALIGNS)` no `@attributeChanged` + `@repaint`. Interpolado direto em `text-align` — o conjunto fechado é a única barreira contra injeção de CSS |
| `color` | `KUBATextColorAttribute` (42 tokens) | `'master-dark'` | não | `enumerated(COLORS)` + `@repaint`. Resolve `var(--color-{value})` |
| `family` | `KUBATextFamilyAttribute` (`base` \| `highlight`) | `'base'` | não | `enumerated(FAMILIES)` + `@repaint`. Resolve `var(--font-family-{value})` |
| `line-height` | `KUBATextLineHeightAttribute` (7 passos) | `'lg'` | não | `enumerated(LINE_HEIGHTS)` + `@repaint`. Propriedade JS `lineHeight`. Resolve `var(--line-height-{value})` |
| `size` | `KUBATextSizeAttribute` (11 passos) | `'xxs'` | não | `enumerated(SIZES)` + `@repaint`. Resolve `var(--font-size-{value})` |
| `weight` | `KUBATextWeightAttribute` (`regular` \| `medium` \| `bold`) | `'regular'` | não | `enumerated(WEIGHTS)` + `@repaint`. Resolve `var(--font-weight-{value})` |
| `on` | `KUBATextOnAttribute \| (string & {})` | — | não | Herdado de `Echo`. Fiação de arco, `source/event:type/sink` — deixa outro elemento dirigir um attribute deste texto |

Não há `hidden`, `width`, `height`, `value`, `disabled`, `alt` nem `internals` — a cadeia é
só `Echo(HTMLElement)`, então nenhum deles é contribuído.

**Assimetria da validação**: `enumerated` guarda só o caminho de attribute. Escrita direta
de propriedade (`text.size = payload`) alcança o setter sem filtro — decisão consistente
com `kb-button`/`kb-card`/`kb-stack`/`kb-icon`: atribuição direta de propriedade é caminho
confiável, não fronteira de segurança. Só `align` tem interpolação direta em CSS; os outros
cinco caem em `var(--x-${...})`, onde um valor inválido resolve para propriedade indefinida
e a declaração é descartada.

### Events

Nenhum. `kb-text` não despacha nada; `on` apenas recebe.

### Slots

Um `<slot>` default sem nome — texto e markup inline (`<a>`, `<strong>`, `<kb-icon>`), que
herdam `color` e `size` do host.

### Parts

Nenhum, e nenhum a ter — não existe sub-elemento no shadow root.

### Custom properties de CSS (pontos de extensão)

| Custom property | Fallback | Controla |
|---|---|---|
| `--text-color` | `var(--color-${text.color})` | Cor do texto, sobrepondo o attribute |
| `--text-font-family` | `var(--font-family-${text.family})` | Família, sobrepondo o attribute |
| `--text-font-size` | `var(--font-size-${text.size})` | Tamanho, sobrepondo o attribute |
| `--text-font-weight` | `var(--font-weight-${text.weight})` | Peso, sobrepondo o attribute |
| `--text-letter-spacing` | `0.38px` (literal) | Tracking |
| `--text-line-height` | `var(--line-height-${text.lineHeight})` | Entrelinha, sobrepondo o attribute |

`align` é aplicado direto no host, sem custom property equivalente.

**Rule 037 (flag arguments)**: nenhum attribute booleano no contrato.

---

## 3. Composição

**Cadeia**: `Echo(HTMLElement)`

| Mixin | Traz | Por que entra na cadeia |
|---|---|---|
| `Echo` | Attribute `on` em `observedAttributes`, roteamento do barramento de arcos para este host, aceitação de filhos `<kb-on>` | É a linha de base que todo elemento consumível do sistema compartilha: um consumidor pode dirigir `<kb-text>` declarativamente (trocar `size`/`color` conforme o estado de outro elemento) sem escrever listener. Entra como **receptor**, não emissor |

**Sobre não usar `Identity`, `Hidden`, `Width`, `Height`**: nenhum tem uso — ver
"Não-requisitos". Herdar seria herança recusada (rule 059).

**Sub-elemento**: nenhum. O `<slot>` vive no shadow root, sem segunda tag pública —
hierarquia rasa (rule 064).

**Symbol privado**: nenhum. `kb-text` não tem ciclo de vida próprio nem método bracket —
fora do que `Echo` traz, é getters/setters de campo privado.

**`attachInternals()`**: não é chamado. Sem `Identity`/`Hidden`/`Disabled` na cadeia, não
há mixin que precise de `internals`, e o elemento não publica semântica própria.

**Foco**: `attachShadow({ mode: 'open' })`, sem `delegatesFocus` — não há nada focável num
shadow root que é um único `<slot>` de texto.

---

## 4. Gestão de Estado

| Dado | Onde mora | Controlado? | Regra de sincronização |
|---|---|---|---|
| `align` | `#align` + attribute | Controlado — DOM é a fonte da verdade | `@attributeChanged('align', enumerated(ALIGNS))` filtra o caminho de attribute; `@repaint` re-renderiza |
| `color` | `#color` + attribute | Controlado | `@attributeChanged('color', enumerated(COLORS))` + `@repaint` |
| `family` | `#family` + attribute | Controlado | `@attributeChanged('family', enumerated(FAMILIES))` + `@repaint` |
| `lineHeight` | `#lineHeight` + attribute `line-height` | Controlado | `@attributeChanged('line-height', enumerated(LINE_HEIGHTS))` + `@repaint` |
| `size` | `#size` + attribute | Controlado | `@attributeChanged('size', enumerated(SIZES))` + `@repaint` |
| `weight` | `#weight` + attribute | Controlado | `@attributeChanged('weight', enumerated(WEIGHTS))` + `@repaint` |

**Nenhum estado derivado** — os seis eixos são espelho direto do que o consumidor escreve,
filtrado pelo enum correspondente. Cada default é resolvido via `??=` no getter, a partir
da constante do enum (`ALIGNS.LEFT`, `COLORS.MASTER_DARK`, …).

**Atributo vs. propriedade, após rejeição**: quando um valor é rejeitado, o *attribute* no
DOM continua mostrando o que foi escrito; só a *propriedade* cai para o último valor válido,
porque o filtro `enumerated` não chama o setter.

**`@repaint` vs. `@retouch`**: `kb-text` usa `@repaint` nos seis (re-executa `component` e
`style`). É mais forte do que o necessário para os que só afetam CSS — `kb-inset` e os
mixins `Width`/`Height` usam `@retouch` no caso equivalente. Divergência de forma, sem
efeito observável além de um re-render de markup redundante; registrada, não corrigida.

---

## 5. Edge Cases

| # | Caso | Comportamento requerido |
|---|---|---|
| 1 | `<kb-text>` sem attribute | Os seis eixos caem no default via `??=` nos getters — `left`, `master-dark`, `base`, `lg`, `xxs`, `regular` |
| 2 | `color`/`size`/`weight`/`family`/`line-height` com keyword desconhecida mas inofensiva | `enumerated` rejeita; a propriedade mantém o último válido. O attribute no DOM mostra o valor rejeitado |
| 3 | `align` com payload de injeção de CSS (fecha a declaração `text-align` e abre `:host { … }`) | `enumerated(ALIGNS)` rejeita a string inteira antes do setter — nenhuma regra injetada chega à folha adotada. Coberto por teste (`text.test.js`, "rejects a CSS injection payload carried by the align attribute") |
| 4 | Escrita direta de propriedade com payload (`text.align = payload`) | **Não filtrado** — o setter atribui direto. Decisão explícita (ver seção 2), mesma de `button`/`card`/`stack`/`icon` |
| 5 | `line-height` alterado depois do mount | `@attributeChanged` dispara, `enumerated` valida, `@repaint` re-renderiza |
| 6 | Valor recebido via arco (`on="#source/clicked:setter/size"`) | Chega ao setter `size` pelo sink `setter`; `Echo` na cadeia é o que observa `on` e conecta o barramento. Coberto por teste (`text.test.js`, "receives a token through an arc, as an Echo sink") |
| 7 | Markup inline no slot (`<a>`, `<strong>`, `<kb-icon>`) | Herda `color` e `size` do host; mantém a própria semântica |
| 8 | Leitor de tela | Anuncia o conteúdo do slot com a semântica do markup que estiver dentro; o host não acrescenta papel nem nome |
| 9 | `<kb-on>` como filho | Aceito — `Echo` na cadeia. Adiciona arcos além do único attribute `on` |
| 10 | `--text-letter-spacing` não definido | Cai no literal `0.38px` (`style.js`) — ver nota ao `designer` abaixo |

---

## Auditoria de tokens (designer)

`kb-text` nunca passou por revisão formal do `designer`. Esta seção registra só o que é
verificável do lado da arquitetura; a revisão do `designer` permanece pendente.

- `--text-letter-spacing` tem fallback literal `0.38px` — o único valor não tokenizado do
  `style.js`. Não há escala global de tracking em `packages/pixel`; se `0.38px` for uma
  decisão de tipografia do sistema, ela merece um token (`--font-letter-spacing-*`), não um
  literal enterrado num componente.
- Os outros cinco eixos caem em token global de verdade (`--color-*`, `--font-*`,
  `--line-height-*`), sem literal — correto.
- Contraste: sem `color` explícito o texto resolve `--color-master-dark` sobre o fundo do
  consumidor; o par depende do contexto e o componente não tem como garanti-lo.

---

## Divisão de trabalho entre ofícios

| Área | Ofício responsável | Status |
|---|---|---|
| Contrato público, cadeia de mixins, decisão sobre `Identity`/`Hidden`/`Width`/`Height` | `architect` | Concluído — só `Echo` |
| Granularidade dos seis enums, e o conjunto completo de `color` (42 tokens, não as 8 famílias) | `architect` → `designer` | Concluído na passagem recente |
| Implementação de `enumerated` nos seis `@attributeChanged`, tipos nomeados em `types.d.ts` | `developer` | Concluído (working tree) |
| `--text-letter-spacing: 0.38px` — tokenizar ou justificar o literal | `designer` | **Pendente** |
| Prova de cada requisito e edge case, incluindo o vetor de injeção em `align` | `tester` | Concluído — `text.test.js` |
| Páginas de `website/docs/components/text.mdx` e traduções `es`/`pt-br` | `writer` | Concluído na passagem recente |

---

**Criado em**: 2026-09-06
**Atualizado em**: 2026-09-06
**Versão**: 1.0
