---
title: "Mutação Acidental (Accidental Mutation)"
category: "Code Smells"
type: reference
id: "BEHAVIORAL-037"
severity: "🟠 High"
tags: [code-smells]
---

# Mutação Acidental (Accidental Mutation)

## Explanation

### O que é

Mutação acidental ocorre quando objetos ou estruturas de dados são modificados inadvertidamente, geralmente através de passagem por referência ou efeitos colaterais não documentados. O estado original é alterado sem intenção explícita do desenvolvedor, causando bugs difíceis de rastrear.

**Sintomas:**

- Função nomeada como `getX`, `filterX` ou `calculateX` que também modifica o parâmetro
- Bugs que aparecem apenas após chamar uma função específica
- Arrays que mudam de ordem inesperadamente (`Array.sort` opera in-place)
- Objetos com propriedades alteradas sem que o módulo chamador o faça explicitamente
- Testes dependentes da ordem de execução

### Por que importa

- Bugs imprevisíveis: estado mutado silenciosamente falha testes e produz comportamento incorreto
- Rastreamento difícil: o local onde a mutação ocorre pode estar distante de onde o erro é detectado
- Comportamento não-idempotente: mesmo código pode ter resultados diferentes dependendo do estado anterior
- Baixa confiança no código: desenvolvedores hesitam em reutilizar funções devido a efeitos colaterais ocultos

## How-to

### Exemplo

```javascript
// ❌ .sort() opera in-place — modifica o array original
function getTopUsers(users) {
  return users
    .sort((a, b) => b.score - a.score) // MUTA users!
    .slice(0, 5);
}

const users = [{ name: 'Alice', score: 80 }, { name: 'Bob', score: 95 }];
const top = getTopUsers(users);
console.log(users); // [Bob, Alice] — ordem original destruída
```

```javascript
// ✅ Cópia rasa com spread — preserva o array original
function getTopUsers(users) {
  return [...users]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

// ✅ Para objetos: retornar novo objeto
function deactivate(user) {
  return { ...user, active: false };
}

// ✅ Para clone profundo: structuredClone (Node 17+)
const copy = structuredClone(order);
```

Codetag sugerido para dívida não resolvida agora:

```typescript
// FIXME: Accidental Mutation — getTopUsers modifica o array original via .sort()
// TODO: Clonar users antes de ordenar: [...users].sort(...)
```

## Reference

### Critérios Objetivos

- [ ] Funções modificam parâmetros recebidos sem documentação explícita
- [ ] Objetos são retornados de funções após modificação de propriedades
- [ ] Arrays são modificados via `push()`, `splice()`, `pop()` sem criar cópia
- [ ] Estruturas de dados compartilhadas são mutadas de múltiplos locais
- [ ] Variáveis locais têm seu valor reatribuído sem razão clara
- [ ] Mudanças em objetos se propagam para outros componentes não relacionados

### Exceções Permitidas

- **Métodos Mutadores Explícitos**: `save()`, `update()` e afins, cuja intenção de mutação está declarada no nome.
- **Objetos de Escopo Local**: Construídos e descartados dentro do mesmo escopo, sem escapar dele.
- **Contratos de Framework**: Quando a interface exigida não suporta imutabilidade.
- **Código Legado Testado**: Quando a mutação está documentada e coberta por testes que garantem o comportamento.

### Como Detectar

#### Manual

- Procurar por `push()`, `pop()`, `splice()`, `unshift()` em arrays transitórios
- Identificar funções que retornam o mesmo objeto recebido como parâmetro
- Buscar reatribuições de parâmetros
- Verificar objetos compartilhados entre múltiplos módulos

#### Automático

- Biome: `style/noParameterAssign`, `correctness/noConstAssign`
- Rigor de tipos: usar `Readonly<T>`, `as const`, `readonly`
- Bibliotecas: Immer, Immutable.js para detectar mutações
- Testes de snapshot: capturar estado antes/depois para detectar mudanças inesperadas

## Related to

- [Object Immutability (freeze)](../skills/clean-code/references/imutabilidade-objetos-freeze.md): reinforces
- [Side-Effect Function Restrictions](../skills/clean-code/references/restricao-funcoes-efeitos-colaterais.md): reinforces
- [Tell, Don't Ask](../skills/calisthenics/references/diga-nao-pergunte.md): complements
- [Boy Scout Rule (Continuous Refactoring)](../skills/clean-code/references/regra-escoteiro-refatoracao-continua.md): reinforces
- [008 — Shared Mutable State](008_estado-mutavel-compartilhado.md): complements
- [Value Object](../skills/poeaa/references/value-object.md): reinforces — Value Objects imutáveis eliminam a superfície onde a mutação acidental poderia ocorrer.
- [Escopo Mínimo de Dados Compartilhados entre Threads](../skills/clean-code/references/escopo-minimo-dados-compartilhados-concorrencia.md): reinforces — o mesmo raciocínio se aplica com risco maior em ambientes concorrentes.
