# Mixin Pattern

## Problema

Compartilhar comportamento entre classes sem herança múltipla — JavaScript só permite
herança simples, e concerns ortogonais (log, serialização, rastreamento de mudança)
precisam de outra via.

## Como funciona

Duas formas:

1. **Trait-object**: um objeto com métodos instalado no protótipo via `Object.assign`.
2. **Subclass-factory**: uma função que recebe uma classe base e devolve uma subclasse
   estendida, podendo chamar `super`. É esta segunda forma que o `packages/mixin/` deste
   repositório usa.

```javascript
const dirtyTrackable = {
  markDirty() {
    this._dirty = true;
  },
  isDirty() {
    return Boolean(this._dirty);
  },
};

Object.assign(Document.prototype, dirtyTrackable);
```

## Quando não aplicar

- Trait-object puro esconde métodos que não aparecem na declaração da classe — dificulta
  navegação de IDE e análise estática. A forma subclass-factory (a deste repositório) é
  preferível justamente porque o `extends` na composição documenta a cadeia.
- Conflito de nome entre dois mixins aplicados à mesma classe sobrescreve silenciosamente
  — sem aviso, sem erro.

## Relação com as rules deste repositório

- **059 (Herança Recusada)**: um mixin que a classe final usa em 1-2 métodos de dez é o
  mesmo sintoma desta rule, aplicado à composição em vez de à herança.
- A skill `mixin` já documenta a convenção exata usada em `packages/mixin/` — este
  reference é o pattern genérico; aquela skill é a aplicação específica do repositório.
