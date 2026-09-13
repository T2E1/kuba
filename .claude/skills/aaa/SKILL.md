---
name: aaa
model: sonnet
effort: low
description: Organiza um teste em três fases separadas por linha em branco — Arrange (monta o cenário), Act (executa a única ação sob teste) e Assert (verifica o efeito observável), sem lógica de controle no corpo e no máximo duas asserções. Use ao escrever qualquer teste em `*.test.js`, ao revisar teste com `if`/`for` no corpo, ou ao decidir onde termina o setup e começa a ação. Não use para organizar fixtures compartilhadas entre vários testes — é a skill fixture.
---

# AAA (Arrange-Act-Assert)

## O que é

A forma mínima de um teste de comportamento: três fases na ordem — **Arrange** monta o
cenário, **Act** executa a única ação sob teste, **Assert** verifica o efeito observável.
Cada fase existe uma vez, na ordem, e nenhuma se mistura com a seguinte.

## Quando usar

| Situação | Ação |
|---|---|
| Escrevendo qualquer teste em `*.test.js` | Separar as três fases por linha em branco |
| Teste com `if`, `for` ou `switch` no corpo | Extrair a decisão para fora do teste — rule 032 proíbe |
| Teste com mais de duas asserções | Dividir em dois testes, um comportamento cada |
| Fixture nasce e é reaproveitada por vários testes | ❌ Não é aqui — skill fixture |
| Decidir se um teste prova alguma coisa | Perguntar: "o Act tem uma única ação?" |

## Como aplicar

1. **Arrange**: montar apenas o que a ação precisa — `mount()`, atributo inicial,
   listener. Nada que o Act não use.
2. **Act**: uma única ação — um clique, uma atribuição de `value`, uma chamada de
   método. Duas ações no mesmo bloco escondem qual delas causou o efeito.
3. **Assert**: no máximo duas afirmações (rule 032), sobre o efeito observável da ação —
   nunca sobre detalhe interno que o consumidor não vê.
4. **Separar as três fases por uma linha em branco.** É o sinal visual de que a fase
   terminou; sem ele, o leitor não sabe onde o Arrange vira Act.
5. **Nomear o teste pelo efeito**, não pelo método chamado: `dispatches changed on
   every keystroke`, não `tests the input handler`.
6. **Proibir controle de fluxo no corpo do teste** (`if`, `for`, `while`) — rule 032.
   Um teste que decide é um teste que esconde o cenário que não decidiu testar.

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Três fases separadas, uma ação, duas asserções | [three-phases.valid.js](examples/three-phases.valid.js) | [three-phases.invalid.js](examples/three-phases.invalid.js) |

## Checklist

- [ ] As três fases existem, nesta ordem, separadas por linha em branco
- [ ] O Act tem uma única ação
- [ ] No máximo duas asserções, e todas no Assert
- [ ] Nenhum `if`/`for`/`while` no corpo do teste
- [ ] O nome do teste descreve o efeito, não o método chamado
- [ ] Toda `Promise` do Act é consumida com `await`

## Troubleshooting

### O teste parece precisar de um `if`

**Causa:** o cenário condicional é, na verdade, dois testes — um por ramo.
**Solução:** duplicar o Arrange com o valor que cai em cada ramo, um teste por ramo.

### O Arrange ficou maior que o Act e o Assert juntos

**Causa:** o cenário monta mais do que a ação precisa.
**Solução:** mover o excesso para um Object Mother ou Test Data Builder — o Arrange
deste teste some para uma chamada só.

## Rules relacionadas

- [032 — Cobertura Mínima e Qualidade](../../rules/032_cobertura-teste-minima-qualidade.md): a rule que exige AAA e proíbe lógica de controle e mais de duas asserções.
- [028 — Tratamento de Exceção Assíncrona](../../rules/028_tratamento-excecao-assincrona.md): toda Promise do Act precisa de `await`; sem isso o Assert roda antes do efeito.
- [022 — Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md): um Act com uma ação só é a aplicação de KISS ao teste.

## Skills relacionadas

- [fixture](../fixture/SKILL.md): complements — a fixture organiza o que é compartilhado entre testes; o AAA organiza o corpo de cada um.
- [object-mother](../object-mother/SKILL.md): depends on — reduz o Arrange a uma chamada quando o cenário é comum.
- [test-data-builder](../test-data-builder/SKILL.md): depends on — reduz o Arrange quando o cenário precisa de variação.
- [naming](../naming/SKILL.md): reinforces — o nome do teste segue o mesmo critério de revelar intenção.
- [complexity](../complexity/SKILL.md): reinforces — um teste com `if` tem complexidade ciclomática que a rule 022 já limita no código de produção.

---

**Criado em**: 2026-09-13
**Atualizado em**: 2026-09-13
**Versão**: 1.0
