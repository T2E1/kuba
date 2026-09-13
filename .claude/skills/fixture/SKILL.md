---
name: fixture
model: sonnet
effort: medium
description: Organiza o setup e o teardown compartilhados entre vários testes do mesmo arquivo — `beforeEach`/`afterEach` para o que se repete em todo teste da suíte — no modelo de quatro fases (setup, exercise, verify, teardown), superset do AAA quando há estado a limpar entre execuções. Use ao ver o mesmo Arrange repetido em todo teste do arquivo, ao precisar restaurar um dublê ou limpar o DOM entre testes, ou ao decidir o que vai para `beforeEach` versus o que fica no Arrange de cada teste. Não use para o corpo de um teste individual — isso é a skill aaa.
---

# Fixture Pattern (Four-Phase Test)

## O que é

O que é comum a **todo teste do arquivo** vai para `beforeEach`/`afterEach` — a fixture —
em vez de repetido no Arrange de cada um. É o Four-Phase Test (Setup, Exercise, Verify,
Teardown) aplicado no nível da suíte: Setup e Teardown são a fixture compartilhada;
Exercise e Verify são o Act e o Assert de cada teste, que a skill `aaa` já cobre.

A diferença do Object Mother: a fixture cuida do **ciclo de vida** (quando nasce, quando
morre, o que precisa ser limpo); o Object Mother cuida do **conteúdo** de uma instância
específica. Um `beforeEach` pode usar uma Object Mother dentro dele.

## Quando usar

| Situação | Ação |
|---|---|
| Todo teste do arquivo monta o mesmo elemento antes de variar algo | Mover a montagem comum para `beforeEach` |
| Um `spyOn` ou dublê precisa ser desfeito para não vazar entre testes | `afterEach` com `vi.restoreAllMocks()` |
| O `beforeEach` já customiza o cenário por teste | Sinal de que a variação pertence ao Arrange de cada teste, não à fixture |
| O corpo de um único teste, sem nada compartilhado | ❌ Não é aqui — skill aaa |
| DOM ou estado global do teste anterior vaza para o próximo | Fixture ausente ou incompleta — rule 070 |

## Como aplicar

1. **Identificar o que é idêntico em todo teste do arquivo** — não o que é parecido,
   o que é exatamente igual. Parecido-mas-não-igual continua no Arrange individual.
2. **`beforeEach` monta o Setup comum**: `mount()` do markup base, listener padrão,
   dublê que todo teste usa.
3. **`afterEach` desfaz o que o Setup criou**: `vi.restoreAllMocks()` para dublês,
   limpeza de `document.body` quando o próximo arquivo depende de um DOM limpo.
4. **Nunca customizar o cenário por teste dentro do `beforeEach`** com `if` — se um
   teste precisa de algo diferente, essa diferença é Arrange dele, não da fixture.
5. **Devolver a referência montada** de `beforeEach` (via variável de escopo do
   `describe`, ou retorno de contexto do runner) para os testes usarem no Act — nunca
   remontar dentro de cada teste o que a fixture já montou.
6. **Preferir fixture só quando 3+ testes do arquivo compartilham o mesmo setup.** Um
   ou dois testes com Arrange repetido não justificam a indireção (rule 023).

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| `beforeEach`/`afterEach` compartilhado vs. `if` decidindo o cenário dentro do setup | [shared-setup.valid.js](examples/shared-setup.valid.js) | [shared-setup.invalid.js](examples/shared-setup.invalid.js) |

## Checklist

- [ ] `beforeEach` contém só o que é idêntico em todo teste do arquivo
- [ ] `afterEach` desfaz exatamente o que o `beforeEach` criou (dublês, DOM, listeners)
- [ ] Nenhum `if` dentro do `beforeEach` decidindo variação por teste
- [ ] A fixture existe porque 3+ testes compartilham o mesmo setup
- [ ] Nenhum teste depende da ordem de execução dos outros

## Troubleshooting

### O `beforeEach` cresceu e ganhou um `if` para casos diferentes

**Causa:** o setup deixou de ser comum — parte dele é variação de teste individual.
**Solução:** mover o que varia para o Arrange de cada teste; o `beforeEach` volta a
conter só o que sobra igual em todos.

### Um teste falha apenas quando roda depois de outro

**Causa:** `afterEach` ausente ou incompleto — dublê, listener ou DOM vazando entre
execuções (rule 070).
**Solução:** completar o `afterEach` com a limpeza exata do que o `beforeEach` criou.

## Rules relacionadas

- [070 — Proibição de Estado Mutável Compartilhado](../../rules/070_proibicao-estado-mutavel-compartilhado.md): fixture sem teardown é a fonte mais comum de teste que depende de ordem de execução.
- [023 — Proibição de Funcionalidade Especulativa](../../rules/023_proibicao-funcionalidade-especulativa.md): extrair fixture antes de 3 testes compartilharem o setup é indireção sem ganho.
- [021 — Proibição de Duplicação](../../rules/021_proibicao-duplicacao-logica.md): a fixture elimina a repetição do mesmo setup em todo teste do arquivo.
- [002 — Proibição da Cláusula ELSE](../../rules/002_proibicao-clausula-else.md): `if`/`else` dentro do `beforeEach` decidindo cenário é sinal de que a variação não pertence à fixture.

## Skills relacionadas

- [aaa](../aaa/SKILL.md): complements — a fixture organiza o que é comum entre testes; o AAA organiza o corpo de cada um.
- [object-mother](../object-mother/SKILL.md): complements — o conteúdo que o `beforeEach` monta pode vir de uma mother.
- [test-double](../test-double/SKILL.md): depends on — o `afterEach` restaura os dublês criados no Setup.
- [colocation](../colocation/SKILL.md): reinforces — a fixture mora no mesmo `*.test.js` que os testes que a compartilham.

---

**Criado em**: 2026-09-13
**Atualizado em**: 2026-09-13
**Versão**: 1.0
