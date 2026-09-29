---
title: "Message Chains"
category: "Code Smells"
type: reference
id: "BEHAVIORAL-034"
severity: "🟠 High"
tags: [code-smells]
---

# Message Chains

## Explanation

### O que é

Message Chains (também chamado Train Wreck) ocorre quando uma sequência de chamadas encadeadas navega por vários objetos intermediários até chegar ao dado desejado — cada resultado serve como receptor da próxima chamada. O cliente passa a conhecer a estrutura interna de toda a cadeia de objetos. É a violação clássica da Lei de Demeter.

### Por que importa

- Acoplamento estrutural profundo: o código que chama a cadeia quebra sempre que qualquer objeto intermediário muda sua estrutura
- Dificulta testes: mockar a cadeia exige construir stubs profundos, um para cada elo
- Segurança contra nulo problemática: quando a cadeia falha, é difícil diagnosticar qual objeto intermediário era nulo
- Espalha conhecimento sobre a topologia interna do domínio por lugares que não deveriam precisar conhecê-la

## How-to

### Exemplo

```javascript
// ❌ Cadeia que expõe estrutura interna profunda (Train Wreck)
const city = order.getCustomer().getAddress().getCity().getName();

// ❌ Falha de null obscura: qual objeto é null?
const url = order.getUser().getProfile().getAvatar().getUrl();
```

```javascript
// ✅ Cada objeto encapsula o acesso ao seu vizinho (Hide Delegate)
class Order {
  getCustomerCity() {
    return this.customer.getCity(); // encapsula a navegação
  }
}

const city = order.getCustomerCity();

// ✅ Ou usar optional chaining para segurança (se a estrutura for inevitável)
const url = order.getUser()?.getProfile()?.getAvatar()?.getUrl();
```

```typescript
// FIXME: Message Chains — order.getCustomer().getAddress().getCity().getName()
// TODO: Hide Delegate — criar order.getCustomerCity()
```

## Reference

### Critérios Objetivos

- [ ] Linha com 3 ou mais chamadas encadeadas navegando objetos (`a.getB().getC().getD()`)
- [ ] Código que quebra quando a estrutura interna de qualquer objeto intermediário da cadeia muda
- [ ] Necessidade de stubs profundos para testar o trecho que usa a cadeia
- [ ] Falha de nulo em algum ponto da cadeia sem indicação clara de qual elo falhou

### Exceções Permitidas

- **APIs Fluentes Intencionais**: [Builder](../skills/gof/references/builder.md)s e query builders desenhados propositalmente para encadeamento (`query.where(...).orderBy(...).limit(...)`) — a cadeia aqui é a interface, não um acidente de navegação de estrutura.
- **Optional Chaining em Estrutura Inevitável**: quando a estrutura aninhada é inerente ao domínio e não há um ponto natural de encapsulamento, usar acesso seguro a nulo (`?.`) é aceitável como mitigação, não como solução.

### Como Detectar

#### Manual

- Ler expressões com múltiplas chamadas de getter encadeadas em sequência
- Verificar se o objeto de origem da cadeia expõe métodos que já entregam o resultado final, sem exigir navegação manual

#### Automático

- Sem regra nativa de Biome para limitar encadeamento de chamadas — detecção via revisão
  de código, buscando dois ou mais pontos consecutivos numa mesma instrução

## Related to

- [029 — Feature Envy](029_feature-envy.md): complements — ambos surgem de um método buscar dados de fora da própria classe em vez de pedir comportamento
- [035 — Middle Man](035_middle-man.md): complements — a correção (Hide Delegate) cria um método intermediário, mas em excesso pode se tornar este outro smell
- [Tell, Don't Ask](../skills/calisthenics/references/diga-nao-pergunte.md): reinforces
- [Restrição de Encadeamento de Chamadas (Method Chaining)](../skills/calisthenics/references/maximo-uma-chamada-por-linha.md): reinforces — a mesma regra que restringe method chaining ajuda a evitar Message Chains.
- [Builder](../skills/gof/references/builder.md): contrasts — encadeamento intencional de uma API fluente (Builder) não é o mesmo smell que navegação acidental de estrutura interna.
