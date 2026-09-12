# Observer Pattern

## Problema

Permitir que múltiplos componentes desacoplados reajam a uma mudança de estado sem que o
objeto que muda conheça nominalmente quem o observa.

## Como funciona

Um *subject* mantém uma coleção de observadores e os notifica quando algo muda.
Observadores se inscrevem e cancelam a inscrição a qualquer momento.

```javascript
class Subject {
  #observers = new Set();

  subscribe(observer) {
    this.#observers.add(observer);
    return () => this.#observers.delete(observer);
  }

  notify(payload) {
    for (const observer of this.#observers) observer(payload);
  }
}
```

## Quando não aplicar

- Quando não há esquecimento de `unsubscribe` sob controle: referências vivas de
  observadores esquecidos são a causa mais comum de vazamento de memória neste pattern.
- Quando a ordem de notificação importa — o pattern não garante ordem, e depender dela é
  acoplamento oculto entre observadores.

## Relação com as rules deste repositório

- **070 (Estado Mutável Compartilhado)**: o `Set` de observadores é estado compartilhado
  por desenho — o cuidado é não deixar o `notify` mutar o subject a partir de um observer.
- **018 (Dependências Acíclicas)**: um observer que notifica de volta o mesmo subject cria
  ciclo de notificação — o equivalente comportamental de uma dependência circular.
- **event** (skill): `EventTarget` + `AbortSignal` é a forma nativa deste pattern para
  custom elements — ver a skill `event` para o decorator `on.*` que o repositório usa.
