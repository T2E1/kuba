# ✅ O pattern escolhido a partir do problema medido

Incorreto em: `pattern-choice.invalid.md`

## O problema, nomeado e medido

> A rota de pedido leva 4,1s até responder ao primeiro clique. O bundle inicial tem
> 780KB comprimidos, e o relatório de build aponta 310KB numa biblioteca de edição de
> texto rico usada só no campo de observações, que 12% das sessões abrem.

Três fatos, todos verificáveis: o tempo, o peso, e a fração de uso. Sem os três não há
como escolher entre adiar, dividir ou não fazer nada.

## A escolha

| Pergunta | Resposta | Consequência |
|---|---|---|
| O código é necessário na primeira tela? | Não — 88% das sessões nunca o executam | Candidato a adiamento |
| O que dispara o uso? | Um clique no campo de observações | Gatilho de interação |
| A espera cabe entre o clique e a resposta? | 310KB em rede típica: sim, com antecipação no foco | Aceitável |
| Existe estado de espera e de erro? | Precisam ser escritos — não existiam | Parte da implementação |

Pattern: **Import On Interaction**, com antecipação no primeiro sinal de intenção.

## O que foi implementado

O editor passa a ser carregado sob demanda. O carregamento começa quando o ponteiro entra
no campo ou o foco chega nele — antes do clique —, e o campo mostra o estado de espera
no próprio controle, ocupando as mesmas dimensões do editor final.

O erro de rede tem tratamento próprio: o campo volta a ser uma área de texto simples, com
aviso, em vez de ficar inerte.

## A medição depois

> Bundle inicial: 780KB → 470KB. Tempo até responder: 4,1s → 2,3s. Nas sessões que abrem
> o editor, a espera percebida após o clique é de 0ms em 84% dos casos, porque a
> antecipação no foco já concluiu o carregamento.

Sem este parágrafo, o ganho seria afirmação, não fato
sem ela.

## O que faz esta escolha ser correta

**O problema veio antes do pattern.** A biblioteca pesada foi encontrada no relatório de
build, não suposta.

**O custo foi aceito explicitamente.** Dois estados novos a tratar e a testar, e a
latência deslocada para o meio da tarefa do usuário — compensada pela antecipação, que
também foi medida.

**A forma é mínima.** Um ponto de adiamento, não uma arquitetura de carregamento.

**O ganho foi verificado.** A medição posterior é parte da entrega.
