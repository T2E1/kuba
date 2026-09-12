# ❌ Entrevista que ignora fronteira, exploração e recomendação

Correto em: `rodada-com-fronteira.valid.md`

Pedido do operador: "cria um módulo de auditoria de consumo de token por sessão".

## Variante 1 — lista de perguntas sem rodada nem fronteira

> 1. Precisa persistir entre sessões?
> 2. É mixin ou elemento próprio?
> 3. Que evento ele dispara quando o limite estoura?
> 4. Onde fica o contador — campo privado ou `ElementInternals`?

Problema: a pergunta 3 depende da resposta da pergunta 2 (se ainda não existe elemento
que dispare evento, não há o que nomear), e a pergunta 4 depende de as duas primeiras.
Perguntar tudo de uma vez força o operador a responder fora de ordem ou a devolver
perguntas que ele não tem como responder ainda.

## Variante 2 — pergunta sem explorar o repositório primeiro

> Existe algum padrão de módulo de métrica neste projeto que eu deva seguir?

Problema: essa é uma pergunta que um `grep -ri "metric\|audit" packages/` responde
sozinho — perguntar ao operador delega ao ser humano um trabalho que é desta skill,
violando o mesmo princípio da rule 072 (verificar antes de afirmar, aqui invertido:
verificar antes de perguntar).

## Variante 3 — pergunta sem recomendação

> Precisa persistir entre sessões?

Problema: sem uma resposta recomendada, o operador parte do zero em cada pergunta, o que
é exatamente o retrabalho que a entrevista existe para evitar.
