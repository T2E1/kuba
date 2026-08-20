---
name: setter
model: sonnet
description: Quando um setter se justifica apesar da rule 008 — validação da entrada, normalização antes de atribuir, sincronização com atributo HTML via `attributeChanged`, e disparo de re-renderização via `repaint` ou `retouch`. Use ao criar setter de um campo `#` em custom element, ao revisar setter que é mera atribuição, ou ao decidir entre setter e método de intenção. Não use para atribuir sem tratamento — isso é o setter puro que a rule 008 proíbe.
---

# Setter

## O que é

O espelho da skill `getter`: a rule 008 proíbe setters puros, e esta skill define quando
um se justifica. **Um setter se justifica quando trata a escrita** — valida, normaliza,
sincroniza com o DOM ou dispara re-render.

Sem tratamento, é campo público disfarçado, e o objeto perde a capacidade de proteger o
próprio estado.

## Quando usar

| Situação | Veredito |
|---|---|
| Validação da entrada antes de atribuir | ✅ Setter |
| Normalização (trim, lowercase, coerção) | ✅ Setter |
| Sincronizar com atributo HTML | ✅ Setter com `attributeChanged` |
| Disparar re-render após mudar | ✅ Setter com `repaint` ou `retouch` |
| Sincronizar `internals.states` | ❌ Não no setter — método de contrato via `around` (skill `state`) |
| Apenas `this.#campo = value` | ❌ Rule 008 |
| Mudança que representa intenção de negócio | ❌ Método (`activate()`, não `setStatus()`) |

O teste da intenção: `pedido.setStatus('cancelado')` descreve mecânica;
`pedido.cancelar(motivo)` descreve negócio. Quando existe intenção, ela ganha do setter.

## Como aplicar

### Decorators

| Decorator | Efeito |
|---|---|
| `attributeChanged` | Sincroniza o setter com a mudança do atributo HTML; filtros (`booleanAttribute`, `resizing`, `enumerating(ENUM)`, etc., de `@directive/attributeChanged`) tratam o valor cru antes de chegar ao corpo do setter. Um filtro de aridade 2 `(value, next)` é validador — só propaga chamando `next`; sem `next`, o setter nunca roda e a property mantém o valor anterior (skill `enum`) |
| `retouch` | Re-renderização parcial após a escrita |
| `repaint` | Re-renderização completa após a escrita |
| `around` | Delega um efeito colateral que não transforma o valor (`internals.states`, `removeAttribute`, etc.) para o método de contrato, executado numa tick depois — nunca dentro do próprio setter (skill `state`) |
| `before` | Transforma o valor antes da atribuição. Só se justifica se o método **muda** o valor — se ele só faz efeito colateral e devolve o mesmo valor recebido, é `around`, não `before` |

### Regras

1. **Um setter, um campo privado** (rule 010).
2. **Getter correspondente obrigatório**, declarado antes dele (skill `anatomy`).
3. **Síncrono sempre.** Nenhuma Promise nasce num setter: não há onde tratá-la
   (rule 028), e o objeto fica num estado indefinido enquanto resolve.
4. **Validação simples.** Regra de negócio complexa é método, não setter.
5. **Tratamento de valor vem do filtro, não do corpo.** `booleanAttribute` e afins,
   em `attributeChanged`, normalizam o valor cru do atributo. O corpo do setter não
   reimplementa esse tratamento — só atribui o que o filtro já entregou pronto. Um
   `if (!VALID.includes(value)) return` dentro do setter é sinal de que o filtro devia
   ter feito essa checagem — troque por `enumerating(ENUM)` (skill `enum`).
6. **Sem efeito colateral alheio** — mexer em outro campo, ou manipular
   `internals.states` diretamente, quebra a previsibilidade (rule 036) e a
   responsabilidade única do próprio setter (rule 010). Quando a propriedade
   sincroniza um estado, o setter atribui e para: quem mexe no estado é o método de
   contrato, alcançado por `@around` (skill `state`) — nunca os dois no mesmo corpo.
7. **Até 15 linhas** (rule 007).

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Setter que valida, normaliza e sincroniza vs. atribuição pura | [treatment.valid.js](examples/treatment.valid.js) | [treatment.invalid.js](examples/treatment.invalid.js) |

## Checklist

- [ ] Todo setter trata a escrita de alguma forma
- [ ] Todo setter tem getter correspondente, declarado antes
- [ ] Nenhum setter assíncrono
- [ ] Nenhum setter mexendo em campo que não é o seu
- [ ] Nenhum setter manipulando `internals.states` diretamente — isso é do método de contrato via `around`
- [ ] Mudanças com intenção de negócio expostas como método, não setter
- [ ] Setter abaixo de 15 linhas

## Troubleshooting

### O setter precisa validar contra outro campo do objeto

**Causa:** a validação é uma regra entre campos, não sobre um valor.
**Solução:** é método de negócio. O setter valida a forma do valor; a coerência entre
campos é responsabilidade de uma operação nomeada.

### A validação lança e quebra o parsing do atributo

**Causa:** `attributeChangedCallback` recebe qualquer string do HTML, inclusive inválida.
**Solução:** decidir a política e documentá-la: ignorar valor inválido e manter o
anterior, ou refletir um estado de erro via Element Internals. Lançar durante o parsing
derruba a renderização da página inteira.

### O método decorado com `before` só faz efeito colateral e devolve o valor sem mudar nada

**Causa:** `before` foi escolhido por hábito — é o decorator "que roda antes" — sem checar
se o método de fato transforma o argumento. Foi o defeito original de `[cleanup]` em
`mixin/hidden/hidden.ts`: removia o atributo `hidden` quando o valor virava `false`, mas
devolvia o mesmo valor recebido, sem transformação nenhuma.
**Solução:** se o método não muda o valor, ele é efeito colateral puro — vira `around`,
como `[hideable]` já era. `before` fica reservado para quem de fato transforma o argumento
antes da atribuição.

### O setter faz a atribuição e também mexe em `internals.states`

**Causa:** duas responsabilidades no mesmo membro — a rule 010 vale para setters tanto
quanto para classes inteiras. Foi o defeito do primeiro rascunho do mixin `Disabled`
(`packages/mixin/disabled/`): o setter atribuía o campo e chamava
`states.add`/`states.delete` no mesmo corpo.
**Solução:** o setter atribui ao campo privado, e para. A manipulação de
`internals.states` vira um método de contrato (`[algoAvel]()`), alcançado por `@around` —
ver a skill `state` e o exemplo de `hidden.ts` (`[hideable]`).

### O `repaint` no setter causou re-render em cascata

**Causa:** vários setters disparando render em sequência na mesma inicialização.
**Solução:** `retouch` para mudança parcial, e agrupar as atribuições. Ver a skill
`render`.

## Rules relacionadas

- [008 — Proibição de Getters/Setters](../../rules/008_proibicao-getters-setters.md): a regra que esta skill delimita.
- [009 — Diga, Não Pergunte](../../rules/009_diga-nao-pergunte.md): `agendar()` em vez de `setStatus('agendado')`.
- [010 — Responsabilidade Única](../../rules/010_principio-responsabilidade-unica.md): atribuir e sincronizar estado são duas responsabilidades — não cabem no mesmo setter.
- [036 — Restrição de Efeitos Colaterais](../../rules/036_restricao-funcoes-efeitos-colaterais.md): o setter afeta o próprio campo e o render, nada além.
- [028 — Exceção Assíncrona](../../rules/028_tratamento-excecao-assincrona.md): por que setter é sempre síncrono.
- [027 — Erros de Domínio](../../rules/027_qualidade-tratamento-erros-dominio.md): validação que falha lança erro nomeado, não devolve `null`.
- [007 — Máximo de Linhas](../../rules/007_limite-maximo-linhas-classe.md): 15 linhas.

## Skills relacionadas

- [getter](../getter/SKILL.md): complements — o par de leitura, obrigatório.
- [anatomy](../anatomy/SKILL.md): depends on — getter antes do setter, no grupo 2.
- [render](../render/SKILL.md): depends on — `repaint` e `retouch` vêm de lá.
- [state](../state/SKILL.md): depends on — quando a escrita sincroniza `internals.states`, é `state` que dita a separação entre o setter e o método de contrato.
- [method](../method/SKILL.md): complements — a mudança com intenção de negócio vira método.
- [event](../event/SKILL.md): complements — quando a escrita deve notificar o mundo externo.
- [enum](../enum/SKILL.md): complements — `enumerating(ENUM)` é o filtro que valida contra um conjunto fechado.

---

**Criado em**: 2026-04-01
**Atualizado em**: 2026-08-20
**Versão**: 2.3
