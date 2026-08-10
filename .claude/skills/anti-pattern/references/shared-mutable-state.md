# Shared Mutable State

**Severidade:** 🟠 Alta
**Regra Associada:** Regra 070

## O Que É

Múltiplos módulos, funções ou threads leem e modificam o mesmo objeto sem coordenação explícita. Qualquer parte do sistema pode alterar estado a qualquer momento, tornando o comportamento do programa imprevisível e difícil de rastrear.

## Sintomas

- Objeto de domínio passado por referência e modificado em dois ou mais módulos distintos
- Variável de módulo ou global alterada por múltiplas funções sem coordenação explícita
- Objetos de domínio passados por referência e modificados em vários pontos
- Variáveis globais ou de módulo alteradas por múltiplas funções
- Bugs que surgem longe do ponto de modificação
- Testes que falham dependendo da ordem de execução (sinal de estado compartilhado)
- Array ou objeto usado como "buffer de comunicação" entre partes do sistema sem cópia
- Comportamento diferente entre a primeira e a segunda chamada da mesma função

## ❌ Exemplo (violação)

```javascript
// ❌ Estado de carrinho compartilhado e mutável
const cart = { items: [], total: 0 };

function addItem(item) {
  cart.items.push(item);        // muta array global
  cart.total += item.price;     // muta propriedade global
}

function applyDiscount(percent) {
  cart.total = cart.total * (1 - percent); // muta novamente
}

// Quem é responsável por cart.total agora? Ninguém sabe com certeza.
```

## ✅ Refatoração

```javascript
// ✅ Estado imutável — cada transformação retorna novo objeto
function addItem(cart, item) {
  return Object.freeze({
    items: [...cart.items, item],
    total: cart.total + item.price,
  });
}

function applyDiscount(cart, percent) {
  return Object.freeze({
    ...cart,
    total: cart.total * (1 - percent),
  });
}

// Cada módulo recebe e retorna versões imutáveis — rastreável e testável
const cart1 = addItem(emptyCart, item);
const cart2 = applyDiscount(cart1, 0.1);
```

## Codetag Sugerido

```typescript
// FIXME: Shared Mutable State — cart mutado por múltiplas funções
// TODO: Tornar imutável: cada função retorna novo objeto com Object.freeze()
```
