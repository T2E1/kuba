# ✅ Comentário de review com pattern nomeado, rule citada e refatoração

> Este trecho exibe **Pyramid of Doom** (rule 066): são 4 níveis de aninhamento
> de `if`, e o caminho feliz está no nível mais profundo.
>
> Refatoração sugerida: guard clauses para linearizar o fluxo — cada validação
> vira um `return` antecipado no topo, e o caminho feliz sobe para o nível zero.
> Ver `references/pyramid-of-doom.md`.

> Aqui é **Feature Envy** (rule 057): `calculateShipping` chama quatro getters de
> `order` e nenhum membro próprio. O método está na classe errada.
>
> Refatoração: mover o cálculo para `Order`, que já tem os dados. O chamador passa
> a dizer `order.shippingCost()` em vez de perguntar quatro vezes (rule 009).

## O que torna o comentário acionável

| Elemento | Papel |
|---|---|
| Nome do pattern | Dá vocabulário comum e conecta a uma solução conhecida |
| Rule citada | Transforma preferência em critério objetivo do repositório |
| Sintoma medido | "4 níveis", "quatro getters" — verificável, não opinativo |
| Refatoração nomeada | Diz o próximo passo concreto, não só o problema |
| Link para a referência | Quem não conhece o pattern aprende sem perguntar |

Com os cinco, o autor sabe exatamente o que fazer e reconhece o padrão sozinho
na próxima vez.
