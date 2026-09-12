---
name: interview
model: opus
effort: high
description: Entrevista o operador rodada por rodada até alinhar uma ideia vaga de feature, componente, módulo ou mudança antes de comprometer código — identifica a fronteira de perguntas cujos pré-requisitos já foram respondidos, propõe uma resposta recomendada para cada uma, explora o repositório em vez de perguntar quando a resposta já está no código, e encerra quando a fronteira esvazia. Use quando o pedido do operador for vago ("adiciona um carrossel", "melhora isso", "cria um módulo de X"), antes de acionar architect ou developer, ou quando o operador pedir para "entrevistar", "grillar" ou testar o plano. Não use para o roteiro fixo de 5 passos de um custom element — isso é a skill lld; não use depois que a forma já foi decidida — aí é Implement, não Plan.
---

# Interview — Entrevista Estruturada Antes de Comprometer Código

## O que é

Um procedimento de entrevista que transforma uma ideia vaga em uma decisão que o
operador consegue defender, **antes** da primeira linha de código. Adaptado da skill
`/grill-me` de AI Hero (Matt Pocock) ao vocabulário deste repositório: em vez de uma
lista de perguntas soltas, a entrevista avança em **rodadas** — a cada rodada, só entram
perguntas cuja resposta não depende de nada ainda em aberto (a "fronteira"). Isso evita
perguntar sobre o nome do evento antes de saber se o componente é controlado, ou sobre o
formato do payload antes de saber se ele existe.

O valor não é a lista de perguntas — é obrigar cada decisão implícita a virar decisão
explícita, registrada e defensável, em vez de emergir por acidente enquanto se escreve
`component.js` ou `service.js`. É o mesmo objetivo da fase **Plan** descrita no
`CLAUDE.md` raiz, aplicado antes mesmo de `architect` ou `lld` entrarem: a fronteira
vazia é o sinal de que "o que fazer" já está decidido, e falta só "como fazer bem".

## Quando usar

| Situação | Ação |
|---|---|
| Pedido vago de feature, app, componente ou módulo ("adiciona um carrossel", "cria um módulo de auditoria") | Rodar a entrevista antes de acionar `architect`, `lld` ou `developer` |
| Operador diz "grilla isso", "testa esse plano", "me entrevista sobre X" | Rodar a entrevista sob demanda, mesmo com plano já esboçado |
| Plano existe mas tem lacuna que só o operador resolve (prioridade de negócio, escopo do MVP) | Fronteira identifica exatamente qual pergunta está pendente |
| Decisão de arquitetura entre duas abordagens já claras, sem ambiguidade de requisito | Não usar — é `architect` sozinho; a entrevista serve para alinhar, não para escolher entre alternativas técnicas equivalentes |
| Especificar o contrato público de um custom element (attribute/property/event/slot/part) | Não usar — é a skill `lld`, que já tem o roteiro de 5 passos para esse caso específico |
| A forma já foi decidida e só falta escrever | Não usar — a fase é Implement, não Plan |

Esta skill não escreve código nem cria arquivo: ela produz o alinhamento que precede o
Plan. Quem edita `.claude/` ou `src/` depois é sempre outro ofício ou eu mesmo, conforme
a tabela de agents do `CLAUDE.md` raiz.

## Como aplicar

### 1. Mapear a árvore de decisão

Antes da primeira pergunta, esboçar mentalmente (não em arquivo — esta skill não cria
artefato) os ramos que a ideia do operador precisa resolver: escopo, contrato público,
composição, estado, edge cases — o que for aplicável ao tipo de coisa sendo planejada.
Identificar quais perguntas dependem de outras (ex.: "que eventos ele dispara" depende de
"é interativo ou somente leitura").

### 2. Explorar o repositório antes de perguntar

Toda pergunta cuja resposta já existe no código — um padrão em pacote vizinho, uma
convenção em `rules/`, um precedente em `website/docs/` — não vai para o operador. Usar
`Read`, `Glob`, `Grep` primeiro. Perguntar apenas o que **só o operador sabe**: prioridade
de negócio, trade-off aceito, escopo do MVP, quem consome. Confundir os dois tipos de
pergunta é o erro mais caro deste procedimento — desperdiça o tempo de quem está sendo
entrevistado com algo que a rule 072 já proíbe afirmar sem verificar: se dá para verificar
lendo, não se pergunta.

### 3. Identificar a fronteira e fazer uma pergunta por vez

A fronteira é o conjunto de perguntas cujos pré-requisitos já foram respondidos (pelo
operador ou pela exploração do passo 2). Fazer **uma pergunta por vez**, nunca uma lista.
Para cada pergunta, **propor a resposta recomendada** — o operador aprova, corrige ou
diverge, mas nunca parte do zero. Uma pergunta sem recomendação transfere trabalho de
julgamento que é desta skill, não do operador.

### 4. Registrar resposta e avançar a fronteira

Cada resposta pode abrir novas perguntas (um novo ramo da árvore) ou fechar um ramo
inteiro (o operador descarta a variação). Atualizar a fronteira a cada rodada — nunca
reaproveitar uma pergunta cujo pré-requisito acabou de mudar de resposta.

### 5. Encerrar quando a fronteira esvaziar

A entrevista termina quando não sobra pergunta cujo pré-requisito já não tenha sido
respondido — não por número fixo de rodadas. Uma sessão pode ter três perguntas ou
quarenta; o critério é a árvore, não uma cota. Ao encerrar, resumir as decisões tomadas
em prosa (não em arquivo) e indicar qual agent ou skill assume a partir daqui — `lld` para
o contrato de um custom element, `architect` para a forma de um pacote, `developer`
direto quando a tarefa é pequena o bastante para não delegar (ver "Quando não delegar" no
`CLAUDE.md` raiz).

## Exemplos

| Caso | Correto | Incorreto |
|---|---|---|
| Entrevista por rodadas, uma pergunta com recomendação, fronteira avançando | [rodada-com-fronteira.valid.md](examples/rodada-com-fronteira.valid.md) | [rodada-com-fronteira.invalid.md](examples/rodada-com-fronteira.invalid.md) |

## Checklist

- [ ] O repositório foi explorado antes de qualquer pergunta cuja resposta poderia estar nele
- [ ] Cada pergunta feita ao operador é algo que só ele sabe responder
- [ ] Uma pergunta por vez, nunca uma lista
- [ ] Toda pergunta veio com uma resposta recomendada
- [ ] Nenhuma pergunta feita antes de seu pré-requisito estar resolvido
- [ ] A sessão encerrou porque a fronteira esvaziou, não por número de rodadas
- [ ] Ao final, ficou explícito qual agent ou skill assume a partir da decisão tomada

## Rules relacionadas

- [072 — Proibição de Afirmação Não Verificada](../../rules/072_proibicao-afirmacao-nao-verificada.md):
  o passo 2 obriga explorar o código antes de perguntar — o mesmo princípio de citar
  `arquivo:linha` em vez de assumir aplicado à fase de alinhamento.
- [023 — Proibição de Funcionalidade Especulativa (YAGNI)](../../rules/023_proibicao-funcionalidade-especulativa.md):
  cada ramo descartado pelo operador na entrevista é escopo especulativo cortado antes de
  virar código morto.
- [064 — Proibição de Overengineering](../../rules/064_proibicao-overengineering.md):
  a fronteira impede perguntar (e portanto projetar) para variação hipotética que o
  operador ainda não confirmou que existe.

## Skills relacionadas

- [lld](../lld/SKILL.md): complements — quando a entrevista termina num custom element,
  o roteiro fixo de 5 passos do `lld` assume a partir da decisão já tomada aqui.
- [adr](../adr/SKILL.md): complements — quando a decisão tem peso arquitetural e precisa
  sobreviver a "por que fizemos assim?", o resumo desta entrevista vira o conteúdo do ADR.
- [package-by-feature](../package-by-feature/SKILL.md): complements — a entrevista pode
  chegar até o eixo de decomposição do sistema; esta skill decide sozinha o que fazer com
  a resposta.

---

**Criado em**: 2026-09-12
**Atualizado em**: 2026-09-12
**Versão**: 1.0
