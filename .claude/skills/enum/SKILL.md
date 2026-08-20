---
name: enum
model: sonnet
description: Elimina magic strings e numbers criando enums congelados com `Object.freeze` — ativado quando um literal com significado aparece duas ou mais vezes, nomeado em `UPPER_SNAKE_CASE` e declarado no módulo dono do conceito. Use ao encontrar string ou número repetido em condicional, ao criar constantes de domínio (status, tipos, seletores, nomes de evento, atributos), ou ao revisar código com literais hardcoded. Não use para valor que aparece uma vez só e é autoexplicativo no contexto.
---

# Enum

## O que é

Um literal com significado de negócio repetido é uma constante mágica esperando divergir.
O enum lhe dá nome, dono e imutabilidade.

O gatilho é objetivo: **duas ocorrências**. Uma só, num contexto onde o valor se explica,
não justifica a indireção (rule 023).

## Quando usar

| Situação | Ação |
|---|---|
| Literal repetido 2+ vezes no mesmo módulo | Enum local |
| Literal usado por vários módulos | Enum no módulo dono, exportado |
| String em condicional de status ou tipo | Enum |
| Nome de evento usado em mais de um lugar | Enum |
| Número com significado de negócio | Constante nomeada |
| Valor único e óbvio no contexto | Deixar como está |

`0` e `1` em operação matemática comum não são constantes mágicas — a rule 024 os
excepciona explicitamente.

## Como aplicar

### Forma

`Object.freeze` sobre um objeto literal, chaves em `UPPER_SNAKE_CASE`. O congelamento não
é decorativo: sem ele, o enum é mutável em runtime e vira estado compartilhado
modificável (rules 029 e 070).

### Onde declarar

O módulo que **define o conceito** é o dono do enum. Status de pedido pertence ao módulo
de pedido, não a um `constants.js` genérico — isso é CCP (rule 016).

| Conceito | Arquivo | Enum |
|---|---|---|
| Seletores DOM | `element.js` | `Element` |
| Propriedades CSS | `property.js` | `Property` |
| Eventos | `event.js` ou `interfaces.js` | `Event` |
| Status | `status.js` | `Status` |
| Tipos e papéis | `type.js` | `Type` |
| Atributos | `attribute.js` | `Attribute` |

### O que o enum não resolve

Enum elimina o literal, não a ramificação. Se o código tem `if` para cada valor do enum,
o problema seguinte é OCP (rule 011) — a solução é polimorfismo ou function map, não mais
constantes. Ver a skill `gof`.

### Enum como conjunto fechado de um `attribute`

Quando o enum é o domínio válido de um `attribute` de custom element (`color`, `variant`,
`type`...), ele não para no `Object.freeze` — precisa impedir que um valor fora do
conjunto chegue à property. A ferramenta é o filtro `enumerating(ENUM)` de
`@directive/attributeChanged`, aplicado no decorator do setter:
`@attributeChanged('color', enumerating(COLORS))`.

`enumerating` faz `Object.values(ENUM).includes(value)` e só chama `next(value)` quando o
valor é conhecido — um atributo desconhecido nunca chega ao corpo do setter, e a property
mantém o último valor válido (skill `setter`, decorator `attributeChanged`). O setter não
reimplementa essa checagem; um `if (!VALID.includes(value)) return` dentro do corpo é o
sinal de que o filtro devia ter feito esse trabalho.

O getter correspondente usa o próprio enum como default, nunca a string solta:
`this.#color ??= COLORS.PRIMARY`, não `this.#color ??= 'primary'`.

Ver `packages/component/button/{color,variant,type}.js` e `button.ts` para o padrão
completo — um enum por arquivo, cada um consumido por `enumerating` no `attributeChanged`
e pelo próprio enum no default do getter.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Enum congelado no módulo dono vs. literais espalhados | [domain-enum.valid.js](examples/domain-enum.valid.js) | [domain-enum.invalid.js](examples/domain-enum.invalid.js) |

## Checklist

- [ ] Nenhum literal com significado repetido 2+ vezes
- [ ] Todo enum congelado com `Object.freeze`
- [ ] Chaves em `UPPER_SNAKE_CASE`
- [ ] Enum no módulo dono do conceito, não num depósito genérico
- [ ] Valores descritivos, não códigos numéricos opacos
- [ ] Nenhum enum criado para valor de ocorrência única

## Troubleshooting

### O enum virou um depósito de constantes não relacionadas

**Causa:** arquivo `constants.js` global acumulando tudo.
**Solução:** um enum por conceito, no módulo dono (rule 016). O depósito genérico viola
CCP e CRP ao mesmo tempo.

### Trocar literais por enum não melhorou nada

**Causa:** o problema não era o literal — era a ramificação por tipo.
**Solução:** o enum é o primeiro passo; o segundo é substituir o `switch` por
polimorfismo (rule 011).

### `Object.freeze` não impediu a mudança de um valor aninhado

**Causa:** `freeze` é raso.
**Solução:** enum de domínio tem valores primitivos. Se há aninhamento, provavelmente não
é enum — é configuração, e precisa de congelamento profundo.

## Rules relacionadas

- [024 — Proibição de Constantes Mágicas](../../rules/024_proibicao-constantes-magicas.md): a regra que ativa esta skill.
- [029 — Imutabilidade de Objetos](../../rules/029_imutabilidade-objetos-freeze.md): `Object.freeze` obrigatório.
- [021 — Proibição de Duplicação](../../rules/021_proibicao-duplicacao-logica.md): o valor tem uma fonte de verdade.
- [016 — Fechamento Comum](../../rules/016_principio-fechamento-comum.md): o enum vive com o conceito que define.
- [070 — Estado Mutável Compartilhado](../../rules/070_proibicao-estado-mutavel-compartilhado.md): enum não congelado é estado global mutável.
- [006 — Nomes Abreviados](../../rules/006_proibicao-nomes-abreviados.md): valores revelam intenção.
- [023 — Funcionalidade Especulativa](../../rules/023_proibicao-funcionalidade-especulativa.md): uma ocorrência não justifica enum.

## Skills relacionadas

- [token](../token/SKILL.md): reinforces — a mesma disciplina, aplicada a valores visuais em CSS.
- [event](../event/SKILL.md): depends on — nomes de evento saem daqui.
- [clean-code](../clean-code/SKILL.md): reinforces — constante mágica é um dos smells do detector.
- [gof](../gof/SKILL.md): complements — quando o enum vira ramificação, o passo seguinte é Strategy.
- [calisthenics](../calisthenics/SKILL.md): complements — a regra 3 leva o conceito além do enum, para Value Object.
- [setter](../setter/SKILL.md): complements — `enumerating(ENUM)` é o filtro que valida o enum contra o `attribute`.
- [getter](../getter/SKILL.md): complements — o default do getter é o próprio enum, não a string solta.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-20
**Versão**: 2.1
