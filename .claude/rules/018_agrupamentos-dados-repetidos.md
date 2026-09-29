---
title: "Agrupamentos de Dados Repetidos (Data Clumps)"
category: "Code Smells"
type: reference
id: "STRUCTURAL-018"
severity: "🟡 Medium"
tags: [code-smells]
---

# Agrupamentos de Dados Repetidos (Data Clumps)

## Explanation

### O que é

Data Clumps ocorrem quando grupos de dados sempre aparecem juntos como parâmetros de função, atributos de classe ou variáveis locais, mas não possuem seu próprio [Value Object](../skills/poeaa/references/value-object.md) ou estrutura representando aquele conceito coeso. São primitivos que sempre viajam juntos mas nunca se casaram.

### Por que importa

- Inflação de parâmetros: funções recebem muitos valores individuais em vez de um objeto
- Validação duplicada: mesma lógica de validação repetida em múltiplos locais
- Mudança custosa: alterar o conceito requer modificar N assinaturas de função
- Baixa coesão conceitual: o domínio é modelado como primitivos espalhados
- Dificuldade de extensão: adicionar novo campo requer alterar todas as funções que usam o grupo

## How-to

### Exemplo

```javascript
// ❌ Endereço como 4 parâmetros separados em múltiplas funções
function createOrder(street, city, zipCode, country, productId, qty) { ... }
function validateShipping(street, city, zipCode, country) { ... }
function calculateFreight(street, city, zipCode, country) { ... }
```

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

```typescript
// FIXME: Data Clumps — (street, city, zipCode, country) aparecem em 3+ funções
// TODO: Introduce Parameter Object: criar classe Address
```

## Reference

### Critérios Objetivos

- [ ] 3 ou mais parâmetros aparecendo juntos em mais de 2 funções diferentes
- [ ] Grupo de atributos que são sempre lidos/escritos juntos em uma classe
- [ ] Remover um elemento de dados do grupo torna os outros sem significado ou incompletos
- [ ] Mesmo conjunto de tipos/formato aparece repetidamente em assinaturas de métodos
- [ ] Validação de campos é idêntica em diferentes locais do código

### Exceções Permitidas

- **Grupos Efêmeros**: Agrupamentos de vida curta em evento único ou script de migração.
- **Contratos de API Externa**: Quando a API de terceiro não aceita objeto customizado.
- **Código Legado**: Quando a refatoração traria alto risco sem ganho claro.

### Como Detectar

#### Manual

- Procurar assinaturas de função com parâmetros repetidos com exatamente o mesmo nome/tipo
- Identificar funções que sempre recebem `(rua, cidade, cep, pais)`, `(startX, startY, endX, endY)`, `(dia, mes, ano)`
- Buscar padrões de coerência: se um campo muda, os outros sempre mudam juntos

#### Automático

- Sem regra nativa de Biome para detectar grupos de parâmetros repetidos — detecção via revisão de código ("Introduce Parameter Object")

## Related to

- [Primitive Domain Encapsulation](../skills/calisthenics/references/encapsulamento-primitivos.md): reinforces — ambos combatem primitivos soltos que deveriam ser um conceito de domínio único.
- [Maximum Function Parameters](../skills/clean-code/references/limite-parametros-funcao.md): complements — agrupar os dados clumped em um objeto é a forma mais comum de respeitar o limite.
- [Consistent Class and Method Names](../skills/naming/references/nomes-classes-metodos-consistentes.md): complements — o novo objeto extraído precisa de um nome que revele o conceito coeso.
- [Flag Arguments](../skills/clean-code/references/argumentos-sinalizadores.md): reinforces — ambos são sintomas de assinaturas de função sobrecarregadas com dados primitivos.
- [Value Object](../skills/poeaa/references/value-object.md): complements — Value Object é o padrão de PoEAA que resulta da extração do Data Clump.
- [021 — Data Class](021_classe-de-dados.md): contrasts — o Data Clump vira uma Data Class quando ganha estrutura própria mas ainda carece de comportamento.
