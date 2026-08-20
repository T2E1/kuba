---
name: state
model: sonnet
description: Estado de custom element via Element Internals API — `internals.states.add/delete` em vez de atributo `data-*`, acessível no CSS pela pseudo-classe `:state()`, com contrato Symbol e decorator `around` fazendo a ponte entre o setter e os internals. Use ao criar estado gerenciável de um componente (ativo, colapsado, desabilitado, visível), ao estilizar por estado no CSS, ou ao revisar código que usa atributo para representar estado interno. Não use para valor de dado do componente — isso é atributo refletido.
---

# State

## O que é

Estado de componente não vive em atributo. Vive em `internals.states`, através da Element
Internals API — encapsulado, invisível no DOM inspecionado, e alcançável pelo CSS via
`:state(nome)`.

A distinção que decide onde algo mora: **dado é atributo, condição é estado**. `value`,
`color` e `href` são dados, e refletem no DOM. `active`, `collapsed` e `invalid` são
condições internas, e vão para `internals.states`.

## Quando usar

| Situação | Onde mora |
|---|---|
| Condição interna do componente (ativo, inválido, colapsado) | `internals.states` |
| Dado que o consumidor define | Atributo refletido |
| Estilizar conforme a condição | CSS `:state(nome)` |
| Estado que precisa ser lido de fora | Atributo — states não é observável externamente |

## Como aplicar

### Anatomia completa de um estado

| Componente | Onde |
|---|---|
| Campo privado | Grupo 1 da classe (skill `anatomy`) |
| Getter | Grupo 2, com valor padrão |
| Setter com `attributeChanged` e `around` | Grupo 2, após o getter |
| Symbol de contrato | `interfaces.js` do módulo |
| Método de contrato `[symbol]()` | Grupo 5, manipula `internals.states` |
| Getter `internals` preguiçoso | Grupo 2 |

### Fluxo

1. O atributo HTML muda, ou a propriedade é atribuída.
2. `attributeChanged` dispara o setter.
3. O setter atribui ao campo privado.
4. `around` intercepta e chama o método de contrato.
5. O método de contrato faz `states.add` ou `states.delete`.
6. O CSS reage por `:state(nome)`.

O setter **não** manipula `internals.states` diretamente — quem faz isso é o método de
contrato, alcançado pelo `around`. Isso mantém uma responsabilidade por membro (rule 010)
e permite que um mixin implemente o contrato sem tocar o setter.

### Nomenclatura

| Elemento | Padrão | Exemplo |
|---|---|---|
| Estado | Particípio ou adjetivo | `active`, `collapsed`, `disabled` |
| Symbol de contrato | Estado + `-able` | `activable`, `collapsible` |
| Campo privado | `#` + nome | `#active` |
| Getter e setter | Nome do estado | `active` |
| Método de contrato | `[symbol]()` | `[activable]()` |

### `internals` preguiçoso

`attachInternals()` só pode ser chamado uma vez por elemento, e os mixins da cadeia
precisam da mesma instância. Getter com `??=`, público — ver a skill `constructor`.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Estado em Element Internals vs. atributo `data-*` | [internals-state.valid.js](examples/internals-state.valid.js) | [internals-state.invalid.js](examples/internals-state.invalid.js) |

## Checklist

- [ ] Nenhuma condição interna representada por atributo `data-*`
- [ ] `internals` exposto por getter preguiçoso público
- [ ] Setter não manipula `states` diretamente — o método de contrato manipula
- [ ] Symbol do contrato exportado por `interfaces.js`
- [ ] Um estado por método de contrato
- [ ] CSS usa `:state(nome)`, não seletor de atributo
- [ ] Nenhum `repaint`/`retouch` num setter de estado — quem faz a ponte é `around`

## Troubleshooting

### O `:state()` não aplica o estilo

**Causa:** o estado foi adicionado antes de `attachInternals()` ter sido chamado, ou o
mixin usou uma segunda instância de internals.
**Solução:** getter preguiçoso público, uma instância só. Foi o defeito do `Hidden` com
`<kb-button>`.

### Preciso ler o estado de fora do componente

**Causa:** `internals.states` é deliberadamente não observável de fora — é encapsulamento.
**Solução:** se o consumidor precisa saber, isso não é estado interno: ou vira atributo
refletido, ou vira evento notificando a mudança.

### O setter ficou fazendo a atribuição e o `states.add`/`delete` no mesmo corpo

**Causa:** a manipulação de `internals.states` foi colada direto no setter "porque já
estava ali" — duas responsabilidades no mesmo membro (rule 010), o mesmo defeito que a
skill `setter` documenta no seu próprio troubleshooting.
**Solução:** mover a manipulação para o método de contrato (`[algoAvel]()`), e ligar os
dois só pelo `@around`. O setter some com uma linha: `this.#campo = value`. Foi o que
aconteceu no primeiro rascunho do mixin `Disabled` (`packages/mixin/disabled/`), corrigido
ao espelhar `hidden.ts`.

### O estado e o atributo divergiram

**Causa:** duas fontes de verdade para a mesma condição.
**Solução:** o campo privado é a fonte; atributo e `states` são reflexos dele, atualizados
pelo mesmo fluxo.

## Rules relacionadas

- [008 — Proibição de Getters/Setters](../../rules/008_proibicao-getters-setters.md): o estado não é exposto por acessor cru; a manipulação passa pelo contrato.
- [010 — Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): um estado por método de contrato.
- [029 — Imutabilidade](../../rules/029_imutabilidade-objetos-freeze.md): a mudança de estado é explícita e localizada, nunca acidental.
- [070 — Estado Mutável Compartilhado](../../rules/070_proibicao-estado-mutavel-compartilhado.md): o estado pertence ao elemento, não a um objeto global.
- [013 — Segregação de Interfaces](../../rules/013_principio-segregacao-interfaces.md): cada Symbol é um contrato de um estado só.

## Skills relacionadas

- [setter](../setter/SKILL.md): depends on — o setter é o ponto de entrada do fluxo.
- [bracket](../bracket/SKILL.md): depends on — o contrato é um Symbol exportado.
- [constructor](../constructor/SKILL.md): depends on — o getter preguiçoso de `internals`.
- [anatomy](../anatomy/SKILL.md): depends on — onde cada peça do estado é declarada.
- [token](../token/SKILL.md): complements — o CSS que reage a `:state()` usa tokens.
- [mixin](../mixin/SKILL.md): complements — mixins de estado implementam o contrato.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-12
**Versão**: 2.1
