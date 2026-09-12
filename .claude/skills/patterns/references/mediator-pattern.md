# Mediator/Middleware Pattern

## Problema

Reduzir acoplamento entre múltiplos componentes que, sem intermediário, precisariam de
conexões diretas entre si — N componentes gerando da ordem de N² conexões.

## Como funciona

Um objeto central coordena a interação: componentes não se conhecem entre si, apenas
notificam o mediador sobre eventos, e é o mediador quem decide a próxima ação.

```javascript
class WizardMediator {
  #current = 0;
  #steps = [];

  notify(sender, event, payload) {
    if (event !== "submit") return;
    const nextIndex = this.#computeNext(sender, payload);
    this.#current = nextIndex;
  }
}
```

## Quando não aplicar

- Para dois componentes que sempre se comunicam diretamente — o mediador aqui é
  indireção sem ganho, um Middle Man (rule 061) com passo extra.
- Quando o mediador cresce para conhecer regra de negócio de todos os componentes —
  vira um God Object (rule 025) centralizando o que deveria estar distribuído.

## Relação com as rules deste repositório

- **025 (The Blob)**: o risco central deste pattern é o mediador virar o próprio Blob que
  ele foi criado para evitar nos componentes individuais.
- **061 (Middle Man)**: mediador que só repassa chamada sem decidir nada não é mediador,
  é Middle Man — o pattern exige lógica de coordenação real.
- **dataflow** (skill): o event bus declarativo (`source/event:type/sink`) deste
  repositório é a forma que este pattern assume entre componentes que não se conhecem.
