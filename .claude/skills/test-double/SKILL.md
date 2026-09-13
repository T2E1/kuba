---
name: test-double
model: sonnet
effort: medium
description: Substitui uma dependência real por um dublê — Spy (`vi.fn()`, observa chamadas sem mudar comportamento), Stub (devolve um valor fixo) ou Mock (`vi.spyOn()`, substitui e verifica interação) — para isolar a unidade sob teste de rede, tempo ou de outro componente. Use ao testar que um evento foi disparado sem depender de um listener real, ao isolar uma chamada de rede ou temporizador, ou ao decidir qual dos três dublês cabe no cenário. Não use para substituir o próprio componente sob teste — ele deve rodar de verdade, no shadow DOM real.
---

# Dublês de Teste (Test Doubles)

## O que é

Um substituto controlado de uma dependência real, para isolar a unidade sob teste de algo
que não é o foco do teste — rede, tempo, outro componente. Três formas, cada uma com um
propósito distinto:

| Dublê | O que faz | API neste repositório |
|---|---|---|
| **Spy** | Observa chamadas sem alterar comportamento | `vi.fn()` como listener de evento |
| **Stub** | Substitui e devolve um valor fixo, sem verificar chamada | `vi.spyOn(obj, 'method').mockReturnValue(x)` |
| **Mock** | Substitui e a asserção verifica a interação em si | `vi.spyOn()` combinado com `toHaveBeenCalledWith` |

## Quando usar

| Situação | Ação |
|---|---|
| Provar que um evento foi disparado | Spy: `vi.fn()` como `addEventListener` |
| Isolar de uma chamada de rede, `Date.now()` ou temporizador | Stub ou Mock via `vi.spyOn()` |
| Verificar que um método foi chamado com argumento certo | Mock: `expect(spy).toHaveBeenCalledWith(...)` |
| O componente sob teste em si | ❌ Nunca dublar — ele roda real, no shadow DOM |
| Substituir uma dependência para simplificar setup, sem motivo de isolamento | Repensar — reduzir Arrange é papel do Object Mother/Builder, não do dublê |

## Como aplicar

1. **Dublar só o que não é o foco do teste.** O componente sob teste roda real —
   dublar sua própria implementação prova que o dublê funciona, não o componente
   (rule 032, este projeto testa comportamento em navegador real).
2. **Spy quando a única pergunta é "foi chamado?"** — `vi.fn()` como listener,
   `expect(spy).toHaveBeenCalled()`, sem mexer no comportamento real do evento.
3. **Stub quando o teste precisa de um valor determinístico** de algo instável —
   hora do sistema, resposta de rede — sem se importar em como foi chamado.
4. **Mock quando a interação em si é o comportamento sob prova** — que argumento foi
   passado, quantas vezes, em que ordem.
5. **Restaurar o dublê depois do teste** com `vi.restoreAllMocks()` num `afterEach` —
   um `spyOn` vazando para o próximo teste é estado mutável compartilhado (rule 070).
6. **Nunca dublar `ElementInternals`, `:state()` ou `adoptedStyleSheets`** — são
   exatamente o que este ambiente de teste existe para exercitar de verdade; dublá-los
   devolve o problema que a suíte deveria evitar (emulação que finge bem o bastante).

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Spy de evento vs. dublar o próprio componente sob teste | [event-spy.valid.js](examples/event-spy.valid.js) | [event-spy.invalid.js](examples/event-spy.invalid.js) |

## Checklist

- [ ] O dublê substitui uma dependência externa, nunca o componente sob teste
- [ ] Spy, Stub ou Mock escolhido pela pergunta que o teste faz — chamada, valor ou interação
- [ ] `vi.restoreAllMocks()` limpa o dublê depois do teste
- [ ] Nenhum dublê de `ElementInternals`, `:state()` ou `adoptedStyleSheets`
- [ ] O dublê não está ali só para encurtar o Arrange — isso é Object Mother/Builder

## Troubleshooting

### O teste passa mesmo quando o evento não é mais disparado

**Causa:** o Spy foi anexado a um listener que não é mais o caminho real do evento —
ex.: escutando no host quando o evento só borbulha a partir do shadow root.
**Solução:** verificar `composed: true` no evento real antes de suspeitar do dublê.

### Um teste que passa sozinho falha na suíte inteira

**Causa:** `vi.spyOn()` sem `vi.restoreAllMocks()` no `afterEach`, vazando para o
próximo teste (rule 070).
**Solução:** adicionar a restauração; nunca depender da ordem de execução dos testes.

## Rules relacionadas

- [032 — Cobertura Mínima e Qualidade](../../rules/032_cobertura-teste-minima-qualidade.md): este projeto testa em navegador real; o dublê isola a dependência, não o componente.
- [070 — Proibição de Estado Mutável Compartilhado](../../rules/070_proibicao-estado-mutavel-compartilhado.md): `spyOn` sem restauração vaza entre testes.
- [028 — Tratamento de Exceção Assíncrona](../../rules/028_tratamento-excecao-assincrona.md): stub de chamada assíncrona ainda exige `await` no teste.
- [038 — Separação Comando-Consulta (CQS)](../../rules/038_conformidade-principio-inversao-consulta.md): Spy observa (consulta), Mock verifica interação (comando) — escolher o dublê certo evita confundir os dois papéis no mesmo teste.

## Skills relacionadas

- [aaa](../aaa/SKILL.md): reinforces — o dublê entra no Arrange; a verificação, no Assert.
- [event](../event/SKILL.md): depends on — o Spy de evento precisa saber por que `composed: true` importa.
- [page-object](../page-object/SKILL.md): complements — o Page Object interage com o componente real; o dublê isola o que está ao redor dele.
- [quality](../quality/SKILL.md): reinforces — dublê no lugar errado é a forma mais comum de teste que não prova nada.

---

**Criado em**: 2026-09-13
**Atualizado em**: 2026-09-13
**Versão**: 1.0
