# ✅ ICP calculado, componente dominante identificado, ação definida

## O comentário no PR

> `OrderCheckout#submit` está com **ICP 11** 🔴 (limiar de refatoração
> obrigatória é 10).
>
> | Componente | Pontos | Origem |
> |---|---|---|
> | `CC_base` | 4 | dois `if` e um ternário — dentro da rule 022 |
> | Aninhamento | 3 | três níveis de bloco — viola a rule 001 |
> | Responsabilidades | 2 | valida, persiste e notifica — viola a rule 010 |
> | Acoplamento | 2 | seis colaboradores externos |
> | **ICP** | **11** | |
>
> O peso não está na ramificação: a CC está dentro do limite. Está em
> aninhamento e responsabilidades.
>
> Ação: extrair a validação e a notificação para métodos próprios. Isso
> derruba responsabilidades para 1 e aninhamento para 1 — ICP projetado 6 🟡.

## Por que isso destrava

- **O número substitui a opinião.** Não há "achei tranquilo" contra 11.
- **O componente dominante diz o que fazer.** Aninhamento alto pede guard
  clause e extração; acoplamento alto pediria injeção (rule 014). A ação
  vem da decomposição, não da intuição.
- **A projeção fecha o acordo.** O autor sabe onde precisa chegar (≤ 6) e
  como verificar que chegou.
- **É calibrável.** Se fosse um hotfix, ICP 11 ainda seria bloqueio; ICP 7
  não seria. O contexto entra depois do número, nunca no lugar dele.
