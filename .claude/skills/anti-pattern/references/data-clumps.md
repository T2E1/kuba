# Data Clumps

**Severidade:** 🟡 Média
**Regra Associada:** Regra 053

## O Que É

Grupos de dados que sempre aparecem juntos em parâmetros de funções, atributos de classes ou variáveis locais, mas não possuem um objeto próprio para representá-los como conceito coeso. São primitivos que sempre viajam juntos mas nunca se casaram.

## Sintomas

- Funções que sempre recebem `(rua, cidade, cep, pais)` em vez de um `Endereco`
- 3 ou mais parâmetros aparecem juntos em 2+ funções diferentes
- Atributos que são sempre lidos/escritos juntos em uma classe
- Remover um item de dados do grupo torna os outros sem significado
- Validação dos mesmos campos repetida em múltiplos locais

## ❌ Exemplo (violação)

```javascript
// ❌ Endereço como 4 parâmetros separados em múltiplas funções
function createOrder(street, city, zipCode, country, productId, qty) { ... }
function validateShipping(street, city, zipCode, country) { ... }
function calculateFreight(street, city, zipCode, country) { ... }
```

## ✅ Refatoração

```javascript
// ✅ Endereço como objeto coeso (Introduce Parameter Object)
class Address {
  constructor({ street, city, zipCode, country }) {
    if (!zipCode) throw new Error('CEP obrigatório');
    Object.assign(this, { street, city, zipCode, country });
  }
}

function createOrder(address, productId, qty) { ... }
function validateShipping(address) { ... }
function calculateFreight(address) { ... }
```

## Codetag Sugerido

```typescript
// FIXME: Data Clumps — (street, city, zipCode, country) aparecem em 3+ funções
// TODO: Introduce Parameter Object: criar classe Address
```
