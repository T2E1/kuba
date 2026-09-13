---
name: object-mother
model: sonnet
effort: medium
description: Funções utilitárias nomeadas que produzem instâncias fixas e reutilizáveis de markup ou dados de teste — um cenário comum montado uma vez e reaproveitado por vários testes, em vez de repetido em cada Arrange. Use quando o mesmo markup ou objeto aparece em três ou mais testes do mesmo pacote, ao extrair um cenário nomeado para `vitest.helpers.js` ou um helper local, ou ao decidir entre instância fixa e construção customizável. Não use quando o cenário varia por teste — aí é a skill test-data-builder.
---

# Object Mother

## O que é

Uma função nomeada que devolve uma instância **fixa** e conhecida de um cenário de teste
— o markup de um `<kb-input>` obrigatório e vazio, um usuário válido, uma lista com três
itens. O nome da função é o nome do cenário: `umInputObrigatorioVazio()`, não
`criarInput(true, false, '')`. Diferente do Test Data Builder, aqui não há customização
por chamada — quem precisa de variação usa o builder, não a mother.

## Quando usar

| Situação | Ação |
|---|---|
| O mesmo markup/objeto aparece em 3+ testes do pacote | Extrair para uma função Object Mother |
| O cenário tem nome de negócio reconhecível | Nomear a função por esse nome, não por parâmetros |
| Cada teste precisa de uma variação diferente do cenário | ❌ Não é aqui — skill test-data-builder |
| A instância exige setup e teardown compartilhado entre suíte | Complementar — skill fixture |
| Only um teste usa aquele cenário | Não extrair — inline no Arrange é mais direto (rule 023) |

## Como aplicar

1. **Identificar a repetição.** Três ou mais testes montando o mesmo Arrange é o sinal —
   antes disso, extrair é especulação (rule 023, YAGNI).
2. **Nomear pela intenção do cenário**, não pelos parâmetros: `campoObrigatorioVazio()`,
   não `criarInput(required=true, value='')`.
3. **Devolver o resultado pronto para o Act** — markup, elemento montado ou objeto —
   nunca uma função que ainda precisa de argumentos para decidir o cenário.
4. **Colocar a função onde os testes que a usam já colocam helpers**: `vitest.helpers.js`
   quando o cenário atravessa pacotes, ou um arquivo `<nome>.mothers.js` ao lado do
   `*.test.js` quando é local a um único pacote.
5. **Uma mother por cenário**, não uma mother parametrizável com flags — flag argument
   numa mother é o Test Data Builder disfarçado (rule 037), e some a vantagem do nome.
6. **Congelar o que a mother devolve** quando o objeto pode ser mutado por engano entre
   testes (rule 070) — cada teste que usa a mesma instância mutável contamina o próximo.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Mother nomeada por cenário vs. parâmetros disfarçados de mother | [required-field.valid.js](examples/required-field.valid.js) | [required-field.invalid.js](examples/required-field.invalid.js) |

## Checklist

- [ ] A repetição existe em 3+ testes antes de extrair
- [ ] O nome da função é o nome do cenário, não uma lista de parâmetros
- [ ] A função não recebe flag para decidir variação — isso é Test Data Builder
- [ ] O cenário devolvido é o que o Act consome, sem passo extra no teste
- [ ] Instância mutável não é compartilhada entre testes sem proteção

## Troubleshooting

### A mother ganhou um segundo e um terceiro parâmetro opcional

**Causa:** o cenário na verdade varia por teste — não é mais uma instância fixa.
**Solução:** migrar para Test Data Builder; a mother continua existindo só para o caso
mais comum, sem parâmetro nenhum.

### Dois testes que usam a mesma mother interferem um no outro

**Causa:** a mother devolve o mesmo objeto mutável, e um teste mutou antes do outro rodar.
**Solução:** a mother monta uma instância nova a cada chamada, nunca reaproveita a
mesma referência entre invocações.

## Rules relacionadas

- [021 — Proibição de Duplicação](../../rules/021_proibicao-duplicacao-logica.md): a mother elimina a cópia do mesmo Arrange em múltiplos testes.
- [023 — Proibição de Funcionalidade Especulativa](../../rules/023_proibicao-funcionalidade-especulativa.md): não extrair mother para um cenário usado uma vez só.
- [037 — Proibição de Argumentos Sinalizadores](../../rules/037_proibicao-argumentos-sinalizadores.md): uma mother com flag de variação é um Test Data Builder mal nomeado.
- [070 — Proibição de Estado Mutável Compartilhado](../../rules/070_proibicao-estado-mutavel-compartilhado.md): cada chamada devolve instância nova, nunca a mesma referência reaproveitada.

## Skills relacionadas

- [aaa](../aaa/SKILL.md): reinforces — a mother encolhe o Arrange a uma chamada.
- [test-data-builder](../test-data-builder/SKILL.md): complements — cobre a face oposta: cenário que varia por teste.
- [fixture](../fixture/SKILL.md): complements — a fixture cuida do ciclo de vida; a mother, do conteúdo da instância.
- [naming](../naming/SKILL.md): reinforces — o nome da mother é a intenção do cenário, mesmo critério de nome de método.

---

**Criado em**: 2026-09-13
**Atualizado em**: 2026-09-13
**Versão**: 1.0
