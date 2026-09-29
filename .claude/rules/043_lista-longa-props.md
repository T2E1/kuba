---
title: "Lista Longa de Props (Long Props List)"
category: "Component Anti-Patterns"
type: reference
id: "STRUCTURAL-043"
severity: "🟡 Medium"
tags: [component-anti-patterns]
---

# Lista Longa de Props (Long Props List)

## Explanation

### O que é

Limita a **5** o número de props que um componente declara. A skill `clean-code` limita a 3 os
parâmetros de uma função; um componente recebe um objeto só, e o limite se desloca para
os campos desse objeto. Lista longa de props não é um problema de assinatura: é o aviso
de que o componente acumulou responsabilidades.

*(Previne o anti-pattern Long Props List: o contrato que cresce porque ninguém quis
dividir o componente.)*

### Por que importa

- Cada prop é uma combinação a mais de estados possíveis, e o número de casos de teste
  cresce por multiplicação — sete props booleanas são cento e vinte e oito estados
- O local de uso fica ilegível: uma chamada com nove props não cabe na tela e não se lê
  de relance
- Props opcionais em excesso escondem combinações inválidas que o tipo permite e o
  componente não suporta
- A lista longa esconde Data Clumps: props que sempre viajam juntas são um conceito de
  domínio que ninguém nomeou (rule 018)
- Mudar o contrato passa a exigir tocar todos os pontos de uso, porque não há um objeto
  intermediário que absorva a mudança

## How-to

### Exemplo

```tsx
// ❌ nove props, três booleanas de comportamento, três que sempre viajam juntas
<PatientCard
  name={p.name} birthDate={p.birthDate} document={p.document}
  compact readOnly showAvatar
  onEdit={edit} onRemove={remove} highlight={selected}
/>
```

```tsx
// ✅ o objeto de domínio conta como uma prop; variante substitui booleanas; ações compostas
<PatientCard patient={p} variant="compact" selected={selected}>
  <PatientCard.Actions onEdit={edit} onRemove={remove} />
</PatientCard>
```

Codetag sugerido para dívida não resolvida agora:

```typescript
// REFACTOR(078): PatientCard com 9 props — agrupar em `patient`, trocar booleanas por `variant`
```

## Reference

### Critérios Objetivos

- [ ] No máximo **5** props declaradas por componente.
- [ ] No máximo **2** props booleanas por componente — a terceira indica que o componente
  faz coisas demais, ou que as três deviam ser um valor de variante (skill `clean-code`).
- [ ] Nenhum conjunto de **3** ou mais props que sempre são passadas juntas — agrupar
  num objeto de domínio nomeado (rule 018).
- [ ] Nenhuma prop cujo nome descreva um comportamento alternativo em vez de um estado
  (skill `clean-code`).
- [ ] Ao atingir **4** props, o componente é candidato imediato a divisão ou composição.

### Exceções Permitidas

- **Primitiva de design system**: componente que encaminha ao elemento raiz o conjunto de
  atributos padrão da plataforma, tipado como tal e contado como **1**.
- **Objeto de domínio como entrada única**: um componente que recebe uma entidade inteira
  conta **1** prop, mesmo que a entidade tenha muitos campos.
- **Adaptador de biblioteca de terceiro**: quando a superfície exigida vem de fora e não
  pode ser reduzida — com o motivo declarado no contrato.
- **Composição por conteúdo**: as áreas de conteúdo injetado não contam para o limite; são
  a alternativa recomendada às props, não uma violação dele.

### Como Detectar

#### Manual

- Contar os campos do tipo de props de cada componente exportado
- Contar quantos deles são booleanos
- Procurar grupos de props que aparecem sempre juntos nos pontos de uso
- Ler um ponto de uso real: se a chamada não cabe em três linhas, o contrato é longo demais

#### Automático

- Sem regra nativa de Biome para contagem de campos do tipo de props — detecção via
  revisão de código

## Related to

- [Maximum Function Parameters](../skills/clean-code/SKILL.md): depends on
- [018 — Agrupamentos de Dados Repetidos (Data Clumps)](018_agrupamentos-dados-repetidos.md): reinforces
- [Prohibition of Flag Arguments](../skills/clean-code/SKILL.md): reinforces
- [Interface Segregation Principle (ISP)](../skills/solid/SKILL.md): reinforces
- [042 — God Component](042_god-component.md): complements
- [045 — Prop Drilling](045_prop-drilling.md): complements
- [Primitive Domain Encapsulation](../skills/calisthenics/SKILL.md): complements
