# Optimize Third-Parties

**Categoria:** Carregamento
**Intenção:** Impedir que código de terceiro — análise, suporte, publicidade,
experimentação — domine o tempo até a página responder.

---

## Quando Usar

- Sempre que um script de terceiro entra na aplicação. A decisão de **como** carregá-lo é
  parte de adotá-lo, não um ajuste posterior.
- Quando a medição mostra tempo de execução de origem que não é a sua.

## Quando NÃO Usar

- Não há caso de não usar. Há casos em que o script precisa executar cedo — medição de
  experiência real, decisão de experimento que evita piscar conteúdo — e aí a decisão é
  aceitar o custo conscientemente, não ignorá-lo.

## Estrutura Mínima

Em ordem de preferência:

1. **Não adotar.** Todo script de terceiro é dependência permanente sobre a qual não se
   tem controle ([rule 007](../../../rules/007_dependencia-barco-ancora.md)).
2. **Adiar até a interação** ([import-on-interaction.md](import-on-interaction.md)).
3. **Carregar sem bloquear**, depois do conteúdo.
4. **Isolar** num contexto separado, quando o script não precisa alcançar o documento.
5. **Servir da própria origem**, quando a licença permitir, para controlar o cache e
   eliminar uma conexão a mais.

Estabelecer conexão antecipada com a origem do terceiro reduz parte do custo quando o
script é inevitável.

## O que custa

- Adiar um script de medição atrasa o dado que ele coleta, e parte dos eventos iniciais
  se perde. É um trade-off a declarar, não um efeito colateral a descobrir.
- Servir da própria origem transfere a responsabilidade de atualizar o script.

## Relacionado a

- [import-on-interaction.md](import-on-interaction.md): reforça — o gatilho preferido
- [loading-sequence.md](loading-sequence.md): depende — o terceiro entra na ordem como todo o resto
- [rule 007 — Proibição de Dependência Barco-Âncora](../../../rules/007_dependencia-barco-ancora.md): reforça
- [skill `twelve-factor` — Declaração Explícita de Dependências](../../twelve-factor/references/02-dependencies.md): complementa

---

**Fonte:** patterns.dev — /vanilla/third-party
