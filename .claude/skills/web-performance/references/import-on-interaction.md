# Import On Interaction

**Categoria:** Carregamento
**Intenção:** Carregar o código quando o usuário demonstra intenção de usá-lo.

---

## Quando Usar

- Funcionalidade atrás de um clique: diálogo, editor, exportação, seletor complexo.
- Recurso que uma minoria usa, mas que é grande o suficiente para pesar em todos.
- Script de terceiro que só importa depois de uma ação — um chat de suporte, por exemplo.

## Quando NÃO Usar

- Quando a ação precisa responder imediatamente. A espera entre o clique e a resposta é
  percebida como travamento, não como carregamento.
- Quando o módulo é grande e a rede é lenta: o usuário clica e nada acontece por
  segundos, o que é pior que o peso inicial que se quis evitar.
- Sem retorno visual imediato no próprio controle acionado.

## Estrutura Mínima

O receptor da interação dispara o carregamento e mostra o estado de espera **no controle
que foi acionado**. Antecipar no primeiro sinal de intenção — o ponteiro entrando no
controle, o foco chegando nele — costuma eliminar a espera percebida.

## O que custa

- A latência sai da carga inicial e entra no meio da tarefa do usuário, que é onde ela
  incomoda mais.
- A ação precisa ser idempotente: dois cliques rápidos não podem carregar duas vezes nem
  perder o primeiro.

## Relacionado a

- [dynamic-import.md](dynamic-import.md): depende — é a base deste pattern
- [import-on-visibility.md](import-on-visibility.md): complementa — o outro gatilho
- [prefetch.md](prefetch.md): complementa — antecipar no sinal de intenção é prefetch aplicado ao mesmo momento
- [third-parties.md](third-parties.md): reforça — é o gatilho preferido para script de terceiro
- [progressive-hydration.md](../../react/references/progressive-hydration.md): reforça — o mesmo gatilho, aplicado ao comportamento

---

**Fonte:** patterns.dev — /vanilla/import-on-interaction
