---
name: prose
model: sonnet
description: Remove os sinais de texto gerado por máquina e devolve voz à escrita — inflação de significado, tom promocional, análises com -ing, atribuição vaga, travessão em excesso, regra de três, paralelismo negativo, vocabulário de LLM, resíduo de conversa com chatbot e enchimento. Use ao escrever ou revisar qualquer texto que o projeto publica: página de documentação, README, CHANGELOG, comentário JSDoc, mensagem de commit, ADR, relatório de investigação. Não use para nomear identificadores no código — é a skill naming.
---

# Prosa

## O que é

Um catálogo de padrões que denunciam texto escrito por máquina, e o que colocar no lugar.
Baseado em [Wikipedia:Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing),
mantido pelo WikiProject AI Cleanup a partir de milhares de casos reais.

A causa raiz explica o resto: um modelo de linguagem escolhe estatisticamente o que vem
depois, e o resultado tende ao mais provável para o maior número de casos. Daí vem tudo —
o adjetivo genérico, a tríade, a conclusão otimista, a importância inflada. **Texto que
serve para qualquer assunto não diz nada sobre nenhum.**

Remover os padrões é metade do trabalho. Texto limpo e sem voz também se reconhece de
longe. A outra metade é ter opinião, variar o ritmo e admitir a dúvida.

## Quando usar

| Situação | Ação |
|---|---|
| Escrevendo página de `docs/` | Aplicar antes de commitar |
| Escrevendo `README`, `CONTRIBUTING`, `SECURITY` | Aplicar — é a porta de entrada do projeto |
| Escrevendo entrada de `CHANGELOG` | Aplicar; a entrada descreve efeito, não celebra |
| Escrevendo comentário ou JSDoc | Aplicar a régua do enchimento e da atribuição vaga |
| Escrevendo relatório, veredito ou decisão | Aplicar; conclusão genérica esconde a ausência de conclusão |
| Revisando texto que alguém colou | Passar o checklist antes de aceitar |
| Nomeando classe, método ou Symbol | ❌ Não é aqui — skill `naming` |
| Traduzindo para `pt-br/` ou `es/` | Aplicar na língua de destino; os padrões atravessam idioma |

Não use para reescrever citação literal, texto de licença ou mensagem de erro de
terceiro — o que é citado se mantém como está.

## Como aplicar

1. **Ler em voz alta.** O teste mais barato: se você não falaria a frase, não a escreva.
2. **Caçar os padrões** pelos sete grupos abaixo. O catálogo completo, com os 24 padrões e
   o antes/depois de cada um, está em [catalogo.md](references/catalogo.md).
3. **Trocar afirmação vaga por fato específico.** É a substituição que resolve mais casos
   de uma vez: "desempenha um papel crucial" vira o que a coisa faz, com número e fonte.
4. **Devolver a voz** — ver [voz.md](references/voz.md). Sem esta etapa o texto fica
   correto e morto.
5. **Reler procurando o que sobrou:** travessão, negrito, tríade, conclusão animada.

### Os sete grupos

| Grupo | O que é | Padrões |
|---|---|---|
| **Significado inflado** | Dizer que algo "marca um momento" em vez de dizer o que é | 1, 2, 3, 6, 24 |
| **Tom promocional** | Adjetivo de folheto turístico: *vibrante*, *deslumbrante*, *aninhado em* | 4, 7 |
| **Evasão** | Atribuir a "especialistas", hedge empilhado, ressalva de corte de conhecimento | 5, 20, 23 |
| **Construção artificial** | Fugir do verbo *ser*, paralelismo negativo, tríade, ciclo de sinônimos, falso intervalo | 8, 9, 10, 11, 12 |
| **Formatação mecânica** | Travessão, negrito, lista com cabeçalho, Title Case, emoji, aspas curvas | 13, 14, 15, 16, 17, 18 |
| **Resíduo de conversa** | "Ótima pergunta!", "Espero que ajude!", tom bajulador | 19, 21 |
| **Enchimento** | "Com o objetivo de", "é importante notar que", "neste momento" | 22 |

### As trocas que mais rendem

| Em vez de | Escreva |
|---|---|
| serve como / atua como / representa | **é** |
| possui / oferece / conta com | **tem** |
| com o objetivo de | **para** |
| devido ao fato de que | **porque** |
| é importante notar que os dados mostram | **os dados mostram** |
| tem a capacidade de processar | **processa** |
| especialistas afirmam | *quem*, *onde*, *quando* |
| não é apenas X, é Y | só Y |

### O vocabulário que denuncia

Palavras cuja frequência disparou depois de 2023, e que costumam aparecer juntas:
*adicionalmente, alinhado com, crucial, aprofundar, enfatizando, duradouro, aprimorar,
fomentar, destacar, interação, intrincado, chave (adjetivo), cenário (abstrato), pivotal,
apresentar, tapeçaria, testemunho, sublinhar, valioso, vibrante*.

Nenhuma é proibida. Duas na mesma página já é sinal; três é diagnóstico.

## Exemplos

A prosa que este projeto publica é em inglês — `docs/`, `README`, `CHANGELOG` —, então os
exemplos estão em inglês, na forma real em que o texto é escrito aqui.

| Caso | Correto | Incorreto |
|---|---|---|
| Página de componente da documentação | [component-page.valid.md](examples/component-page.valid.md) | [component-page.invalid.md](examples/component-page.invalid.md) |
| Entrada de CHANGELOG | [changelog-entry.valid.md](examples/changelog-entry.valid.md) | [changelog-entry.invalid.md](examples/changelog-entry.invalid.md) |
| Texto com voz versus texto correto e morto | [voice.valid.md](examples/voice.valid.md) | [voice.invalid.md](examples/voice.invalid.md) |

## Checklist

- [ ] Nenhuma frase afirma que algo "marca", "reflete" ou "simboliza" algo maior
- [ ] Nenhum adjetivo promocional — *vibrante*, *deslumbrante*, *rico*, *inovador*
- [ ] Nenhuma oração com `-ing` grudada no fim para dar profundidade
- [ ] Toda atribuição tem nome, data ou link — nenhum "especialistas dizem"
- [ ] `ser` e `ter` usados onde cabem, no lugar de *serve como* e *possui*
- [ ] Nenhum "não é apenas X, é Y"
- [ ] Nenhuma tríade que não seja genuinamente três coisas
- [ ] Nenhum travessão que uma vírgula resolveria
- [ ] Negrito só onde a ênfase é real; nenhuma lista de `**Cabeçalho:** frase`
- [ ] Títulos em caixa de frase, não Title Case; sem emoji
- [ ] Aspas retas, não curvas
- [ ] Nenhum resíduo de chat — "Claro!", "Espero que ajude", "Quer que eu..."
- [ ] Nenhuma ressalva de corte de conhecimento — "até onde sei", "detalhes são escassos"
- [ ] Nenhuma conclusão genérica animada sobre o futuro
- [ ] O ritmo varia: existem frases curtas e frases longas
- [ ] Há uma opinião, uma dúvida ou uma ressalva de quem escreveu

## Troubleshooting

### Removi tudo e o texto ficou sem graça

**Causa:** você aplicou só a primeira metade da skill.
**Solução:** [voz.md](references/voz.md). Texto sem os padrões e sem opinião é um comunicado
de imprensa. Diga o que você acha, admita o que não sabe, varie o comprimento das frases.

### O texto técnico precisa mesmo de três itens

**Causa:** a regra de três proíbe a tríade *forçada*, não a contagem.
**Solução:** se são três de verdade — três variantes, três arquivos — mantenha. O padrão
é inventar o terceiro para a frase soar completa.

### O travessão é parte do meu estilo

**Causa:** o problema é a frequência, não o sinal.
**Solução:** um por parágrafo longo é estilo; um por frase é o padrão. Onde a vírgula
serve, use a vírgula.

## Referências

- `references/catalogo.md` — os 24 padrões, cada um com o sinal, a causa e um antes/depois.
- `references/voz.md` — como devolver personalidade sem cair em informalidade forçada.

Fonte: [Wikipedia:Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing).

## Rules relacionadas

- [026 — Qualidade de Comentários: o Porquê](../../rules/026_qualidade-comentarios-porque.md): a skill é essa rule aplicada a toda prosa, não só a comentário.
- [022 — Simplicidade e Clareza](../../rules/022_priorizacao-simplicidade-clareza.md): *serve como* no lugar de *é* é complexidade sem ganho.
- [035 — Proibição de Nomes Enganosos](../../rules/035_proibicao-nomes-enganosos.md): atribuição vaga é desinformação com aparência de fonte.
- [021 — Proibição de Duplicação](../../rules/021_proibicao-duplicacao-logica.md): ciclo de sinônimos é a mesma frase repetida com roupa nova.
- [062 — Proibição de Código Inteligente](../../rules/062_proibicao-codigo-inteligente-clever-code.md): a mesma preferência por clareza sobre esperteza, na prosa.
- [024 — Proibição de Constantes Mágicas](../../rules/024_proibicao-constantes-magicas.md): "significativamente mais rápido" é o número mágico da prosa — diga quanto.

## Skills relacionadas

- [jsdoc](../jsdoc/SKILL.md): reinforces — o comentário é prosa e responde às mesmas regras.
- [naming](../naming/SKILL.md): complements — nomear identificador é lá; escrever frase é aqui.
- [clean-code](../clean-code/SKILL.md): reinforces — nome honesto e frase honesta são a mesma disciplina.
- [preview](../preview/SKILL.md): complements — a descrição da story é prosa publicada.
- [adr](../adr/SKILL.md): reinforces — decisão registrada com hedge empilhado não decide nada.
- [codetags](../codetags/SKILL.md): complements — a nota do codetag também é lida por alguém.

---

**Criado em**: 2026-08-10
**Atualizado em**: 2026-08-10
**Versão**: 1.0
