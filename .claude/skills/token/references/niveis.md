# Catálogo dos níveis

Todo nome de token é montado a partir destes níveis. Nenhum token usa todos —
você escolhe os poucos que expressam a intenção. Os quatro grupos, na ordem
relativa em que aparecem no nome:

```
[ namespace ]  [ object ]  [ base: category · concept · property ]  [ modifier: variant · state · scale · mode ]
```

---

## 1. Base Levels — a espinha dorsal

O núcleo do token. Quase todo token tem pelo menos `category` + mais um base.

### category
A preocupação visual raiz. É o único nível quase sempre presente.

- Exemplos: `color`, `font`, `space`, `size`, `elevation`, `shadow`,
  `breakpoint`, `time`, `border`, `opacity`, `z-index`.
- **Não use `type`** para tipografia — é homônimo de "categoria". Prefira
  `font`.

### concept
Agrupa tokens *dentro* de uma category por significado. É o que dá semântica.

- Em `color`: `feedback` (success/warning/error), `action` (links, botões),
  `neutral`, `brand`, `visualization` (charting), `commerce` (sale,
  clearance).
- Busque **homogeneidade dentro do concept e heterogeneidade entre
  concepts**: tudo de `feedback` parece família; `feedback` e `action` ficam
  claramente separados.

### property
A propriedade concreta que o token pinta/mede.

- Em `color`: `background`, `text`, `border`, `fill`, `icon`.
- Em `font`: `size`, `weight`, `line-height`, `family`, `letter-spacing`.
- `category` + `property` sozinhos são genéricos demais
  (`color-background`); some `concept`/modifiers para dar intenção.

Exemplo de base completo: `color-feedback-background` (category · concept ·
property).

---

## 2. Modifier Levels — o que ajusta o base

Anexados ao final. Inclua **apenas** os que realmente distinguem este token
de outro existente.

### variant
Distingue casos de uso paralelos do mesmo base.

- Hierarquia: `primary`, `secondary`, `tertiary`.
- Feedback: `success`, `error`, `warning`, `info`.
- Ex.: `color-feedback-background-error`.

### state
Condição interativa.

- `hover`, `press` (ou `active`), `focus`, `disabled`, `visited`, `error`,
  `selected`.
- Ex.: `color-action-text-secondary-focus`.

### scale
Um valor dentro de uma progressão. Formas comuns:

- **Enumerado**: níveis de heading `1`–`5`.
- **Ordenado**: valores de cor `50`, `100`, … `900`; ou `neutral-42`.
- **Limitado/bounded**: escalas de luminosidade.
- **Proporcional**: base e múltiplos — `2-x`, `4-x` (2×, 4× a base).
- **T-shirt**: `xs`, `s`, `m`, `l`, `xl`, `xxl`.
- Ex.: `color-neutral-42`, `space-inset-2-x`.

Escolha **uma** convenção de scale por eixo e mantenha. Não misture
`100/200/300` com `s/m/l` para a mesma dimensão.

### mode
Contexto de renderização — tipicamente superfície clara vs. escura.

- `on-light`, `on-dark`.
- Ex.: `color-action-background-secondary-hover-on-light`.
- **Decisão de sistema**: explicitar sempre (`on-light`/`on-dark`) para
  legibilidade, **ou** assumir light como default e só marcar `on-dark`.
  Qualquer uma serve; o que não pode é oscilar. `mode` ≠ `theme` (ver
  namespace).

---

## 3. Object Levels — o escopo

Classificam de quem é o token. Ficam entre namespace e base.

### component-specific
Decisão que vive **local** no componente (spec de design ou arquivo do
componente) e provavelmente não se reusa. Não precisa virar global.

### nested element
Um elemento dentro de um componente, nomeado ao estilo **BEM**:
`component-element-...`.

- Ex.: `input-left-icon-color-fill` → componente `input`, elemento
  `left-icon`, base `color-fill`.

### component group
Quando **3+ componentes** compartilham a mesma decisão, o token é *promovido*
a global. Antes disso, mantenha local. Regra: **comece dentro, promova depois**
— nunca globalize por antecipação.

---

## 4. Namespace Levels — agrupamento organizacional

Prefixados no início do nome.

### system (namespace)
Prefixo que identifica o sistema e evita colisão de variáveis.

- Ex.: `esds-` (EightShapes Design System), `slds-` (Salesforce Lightning),
  ou um acrônimo do seu sistema.

### theme
Sistemas visuais alternativos coexistindo — ex.: marcas distintas de uma
mesma família (hotéis JW Marriott vs. Courtyard) com tokens de cor
temáticos. **theme ≠ mode**: são ortogonais — você pode ter theme A em modo
dark e theme B em modo dark simultaneamente.

### domain
Raro. Uma unidade de negócio cria seu ecossistema isolado de tokens, estendendo
o core.

- Ex.: `esds-consumer-color-marquee-text-primary` (domínio `consumer`).

---

## Resumo da montagem

Ordem canônica de concatenação:

```
system[-theme][-domain]  -  [object]  -  category-concept-property  -  [variant][-state][-scale][-mode]
```

Reforço: colchetes = opcional. A arte é escolher o subconjunto mínimo que
torna a intenção do token inequívoca.
