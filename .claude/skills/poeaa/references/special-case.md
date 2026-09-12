# Special Case

**Camada:** Base Patterns
**Complexidade:** Simples
**Intenção:** Cria uma subclasse que fornece comportamento especial para um caso particular (mais comumente, um "objeto nulo" que responde com comportamento neutro em vez de exigir verificação de `null` em todo lugar).

---

## Quando Usar

- Para eliminar verificações repetidas de `null`/`undefined` espalhadas pelo código cliente
- Quando o caso ausente tem um comportamento neutro e previsível (ex: `GuestCustomer` no lugar de `null`)

## Quando NÃO Usar

- Quando a ausência é um erro de fato — nesse caso deve lançar uma exceção de domínio, não virar Special Case (regra 027)

## Estrutura Mínima (TypeScript)

```typescript
interface Customer {
  getDiscountRate(): number
}

class RegularCustomer implements Customer {
  constructor(private readonly loyaltyPoints: number) {}
  getDiscountRate(): number { return this.loyaltyPoints > 100 ? 0.1 : 0 }
}

class GuestCustomer implements Customer {
  getDiscountRate(): number { return 0 } // Special Case: nunca precisa de "if (customer === null)"
}
```

## Relacionado com

- [regra 027 - Tratamento de Erros de Domínio](../../../rules/027_qualidade-tratamento-erros-dominio.md): complementa — Special Case é para ausência esperada, exceção é para ausência que é erro
- [regra 002 - Proibição da Cláusula ELSE](../../../rules/002_proibicao-clausula-else.md): reforça — elimina o `if (customer) ... else ...` repetido no cliente
- [regra 012 - Substituição de Liskov](../../../rules/012_principio-substituicao-liskov.md): reforça — o Special Case deve honrar o mesmo contrato da classe regular

---

**Camada PoEAA:** Base Patterns
**Fonte:** Patterns of Enterprise Application Architecture — Martin Fowler (2002)
