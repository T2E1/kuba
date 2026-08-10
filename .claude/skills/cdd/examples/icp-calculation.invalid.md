# ❌ Avaliação de complexidade sem ICP

Correto em: `icp-calculation.valid.md`

## O que aconteceu no review

> **Revisor A:** esse método tá complexo demais, precisa quebrar.
>
> **Autor:** complexo por quê? A CC é 4, tá dentro do limite de 5.
>
> **Revisor A:** sei lá, é difícil de ler.
>
> **Revisor B:** eu achei tranquilo.

## Por que travou

- **CC sozinha não fecha o caso.** Ela conta caminhos e ignora aninhamento,
  número de responsabilidades e quantidade de colaboradores. Um método com
  CC = 4 pode aninhar três níveis e depender de seis objetos.
- **Sem número, vira gosto.** "Difícil de ler" contra "achei tranquilo" não
  tem critério de desempate.
- **Sem componente identificado, não há ação.** Mesmo aceitando que está
  complexo, ninguém sabe o que atacar: extrair método? injetar dependência?
  reduzir aninhamento?

O revisor A percebeu algo real — a CC estava mesmo dentro do limite e o método
era mesmo pesado. Faltou a métrica que enxerga o resto.
