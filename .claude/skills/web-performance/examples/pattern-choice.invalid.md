# ❌ O pattern escolhido antes do problema

Correto em: `pattern-choice.valid.md`

## O que aconteceu

> "Vi que a aplicação estava pesada, então apliquei code splitting em todos os
> componentes, coloquei prefetch nos links e troquei os componentes compartilhados por
> HOCs para reaproveitar a lógica."

Nenhum número. Nenhum problema nomeado. Quatro patterns aplicados de uma vez.

## Os defeitos, em ordem de gravidade

| Problema | Consequência |
|---|---|
| **Nenhuma medição antes** | Não há como saber o que pesava, nem se pesava. É otimização prematura ([rule 012](../../../rules/012_otimizacao-prematura.md)) |
| **Divisão em todos os componentes** | Dezenas de arquivos pequenos: mais requisições, compressão pior, e cascatas onde havia uma ida à rede |
| **Prefetch em todos os links** | Banda e dado do usuário gastos em previsões que ninguém calculou; em conexão limitada, o efeito é negativo |
| **HOC onde um hook resolveria** | Níveis a mais na árvore e contrato de props reescrito, sem ganho — o comportamento tinha estado ([rule 013](../../../rules/013_overengineering.md)) |
| **Nenhuma medição depois** | "Ficou mais rápido" é opinião  |
| **Quatro mudanças num diff** | Se piorou, não há como saber qual delas piorou |

## O resultado provável

A divisão fina anula o ganho de compressão. O prefetch em massa compete por banda com os
recursos críticos. As cascatas somam latência em série onde antes havia paralelo. E o
tempo até a interação **sobe**, com quatro mecanismos novos a manter.

Este é o desfecho mais comum de aplicar patterns de carregamento sem medir: o custo é
certo e imediato; o ganho é hipotético.

## O teste que esta escolha não passa

> Qual número estava ruim antes, e qual está agora?

Sem resposta para as duas metades, não houve otimização — houve mudança.
