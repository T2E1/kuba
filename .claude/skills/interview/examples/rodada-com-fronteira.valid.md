# ✅ Entrevista correta: rodadas, fronteira, uma pergunta com recomendação

Pedido do operador: "cria um módulo de auditoria de consumo de token por sessão".

## Rodada 1 — o que só o operador sabe

Antes de perguntar, explorei `packages/` e `website/docs/` procurando precedente de
módulo de auditoria ou de métrica — não encontrei nenhum (`grep -ri "audit" packages/`
sem resultado). A pergunta abaixo não tem resposta no repositório, então vai ao operador.

> **Pergunta 1/1 desta rodada.** O módulo precisa persistir o histórico entre sessões do
> navegador, ou basta refletir o estado da sessão atual?
> **Recomendação**: refletir só a sessão atual — persistência é escopo maior (storage,
> retenção, expurgo) e nada no pedido menciona histórico.

Operador responde: "sessão atual está bom por agora".

## Rodada 2 — a fronteira avançou

Com "sem persistência" resolvido, a próxima pergunta (que dependia dessa resposta) entra
na fronteira:

> **Pergunta 1/1 desta rodada.** Sem persistência, o módulo é um mixin que qualquer
> componente pode compor, ou um elemento único que observa os outros via `dataflow`?
> **Recomendação**: mixin — o pedido fala em "consumo por sessão", não em um painel
> visual próprio; um mixin evita nascer um pacote novo para um dado que outros
> componentes só precisam ler.

## Encerramento

Fronteira vazia — nenhuma pergunta pendente cujo pré-requisito não tenha sido resolvido.
Resumo: módulo sem persistência, como mixin componível. Próximo passo: `architect` decide
a forma exata do mixin (Symbols expostos, onde mora o contador).
