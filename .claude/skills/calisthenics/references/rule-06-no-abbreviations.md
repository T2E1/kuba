# Regra 6 — Proibição de No Abbreviations (Nomes Abreviados)

**Regra deMGoncalves:** ESTRUTURAL-006
**Questão:** Este nome é uma abreviação incompreensível?

## O que é

Exige que nomes de variáveis, métodos, classes e parâmetros sejam completos, autoexplicativos e não utilizem abreviações ou acrônimos que não sejam amplamente reconhecidos no domínio do problema.

## Quando Aplicar

- Nome com menos de 3 caracteres (exceto loops)
- Nome com abreviação (`usr`, `calc`, `mngr`)
- Nome com acrônimo ambíguo (`Proc`, `Svc`, `Mgr`)
- Nome que exige comentário para explicar

## ❌ Violação

```typescript
class UsrMngr {  // VIOLA: abreviações
  calcTot(ord: Order): number {  // VIOLA: calc, tot, ord
    const itms = ord.getItms();  // VIOLA: itms
    let t = 0;  // VIOLA: t é ambíguo
    for (const i of itms) {  // OK: i em loop é exceção
      t += i.prc;  // VIOLA: prc
    }
    return t;
  }
}
```

## ✅ Correto

```typescript
class UserManager {
  calculateTotal(order: Order): number {
    const items = order.getItems();
    let total = 0;
    for (const item of items) {
      total += item.price;
    }
    return total;
  }
}
```

## ✅ Correto (Melhor Abordagem)

```typescript
class OrderTotalCalculator {
  calculate(order: Order): number {
    return order.items.reduce(
      (total, item) => total + item.price,
      0
    );
  }
}
```

## Exceções

- **Convenções de Loop**: `i`, `j`, `k` para iteradores
- **Acrônimos Ubíquos**: `ID`, `URL`, `API`, `HTTP`, `CPF`

## Regras Relacionadas

- [003 - Wrap Primitives](rule-03-wrap-primitives.md): reforça
- [024 - Proibição de Constantes Mágicas](../../rules/024_proibicao-constantes-magicas.md): complementa
- [034 - Nomes Consistentes](../../rules/034_nomes-classes-metodos-consistentes.md): reforça
