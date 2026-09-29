# Dynamic Import

**Categoria:** Carregamento
**Intenção:** Pedir um módulo em execução, para que o empacotador o separe num arquivo
próprio e ele só chegue quando for preciso.

---

## Quando Usar

- Código que só parte dos usuários executa: um editor, um visualizador, um fluxo
  administrativo.
- Módulo grande atrás de uma condição — e o tamanho está medido, não suposto.
- Como base dos demais padrões de adiamento: [import-on-visibility.md](import-on-visibility.md)
  e [import-on-interaction.md](import-on-interaction.md) são este pattern com um gatilho.

## Quando NÃO Usar

- Para o que a primeira tela precisa. Adiar o imediato cria uma cascata: o pedaço só é
  pedido depois que o principal executa, somando duas idas à rede em série.
- Para módulo pequeno. O ganho de bytes não paga a ida à rede a mais.
- Sem medição do que se ganha ([rule 012](../../../rules/012_otimizacao-prematura.md)).

## Estrutura Mínima

A chamada devolve o módulo de forma diferida. **Os dois estados — espera e erro — são
parte da implementação, não um acréscimo posterior.** O estado de espera ocupa as mesmas
dimensões do conteúdo final, ou a página salta.

## O que custa

- Uma ida à rede a mais, no momento em que o usuário está esperando.
- Dois estados novos a tratar e a testar, por ponto de adiamento.
- Falha de rede num módulo adiado acontece depois que a página já parecia funcionar, e
  precisa de recuperação própria.

## Relacionado a

- [static-import.md](static-import.md): complementa — a escolha padrão
- [import-on-visibility.md](import-on-visibility.md): depende — é este pattern com gatilho de visibilidade
- [import-on-interaction.md](import-on-interaction.md): depende — é este pattern com gatilho de interação
- [route-based-splitting.md](route-based-splitting.md): depende — a divisão por navegação é construída sobre ele
- [rule 012 — Proibição de Otimização Prematura](../../../rules/012_otimizacao-prematura.md): reforça
- [skill `clean-code` — Tratamento de Exceção Assíncrona](../../clean-code/references/tratamento-excecao-assincrona.md): reforça

---

**Fonte:** patterns.dev — /vanilla/dynamic-import
