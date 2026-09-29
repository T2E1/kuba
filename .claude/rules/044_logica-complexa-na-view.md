---
title: "Lógica Complexa na View (Complicated Logic in Views)"
category: "Component Anti-Patterns"
type: reference
id: "BEHAVIORAL-044"
severity: "🟠 High"
tags: [component-anti-patterns]
---

# Lógica Complexa na View (Complicated Logic in Views)

## Explanation

### O que é

Proíbe que o corpo de um componente acumule ramificação, cálculo derivado e condicional
aninhada a ponto de a decisão de *o que renderizar* deixar de ser legível. A lógica sai
para um *hook* próprio ou para uma função pura; o componente fica com a descrição da
saída.

*(Previne o anti-pattern Complicated Logic in Views: a árvore de decisão escondida dentro
do retorno renderizado.)*

### Por que importa

- Condicional aninhada dentro do retorno não tem nome: o leitor precisa executar o código
  mentalmente para descobrir qual caminho produz qual saída
- Cada ramo é um caso de teste, e testar ramos através da renderização custa uma ordem de
  grandeza mais que testar uma função pura
- A lógica fica presa àquele componente: o mesmo cálculo é reescrito no próximo lugar que
  precisar dele
- O diff de uma mudança visual passa a incluir mudança de regra, e a revisão perde a
  capacidade de julgar as duas separadamente
- Ternário aninhado dentro do retorno é o formato onde um erro de precedência sobrevive à
  revisão com mais frequência

## How-to

### Exemplo

```tsx
// ❌ a regra de qual linha renderizar está enterrada em ternários aninhados
return (
  <li>
    {p.status === 'issued'
      ? p.expiresAt < now
        ? p.renewable ? <RenewRow p={p} /> : <ExpiredRow p={p} />
        : <ActiveRow p={p} />
      : p.status === 'draft' ? <DraftRow p={p} /> : null}
  </li>
)
```

```tsx
// ✅ a decisão tem nome, mora numa função pura e tem teste próprio
const rowFor = (p: Prescription): RowKind => { … } // core ou hook da feature

const ROWS: Record<RowKind, ComponentType<{ p: Prescription }>> = {
  renew: RenewRow, expired: ExpiredRow, active: ActiveRow, draft: DraftRow,
}

function PrescriptionRow({ p }) {
  const Row = ROWS[rowFor(p)]
  return <li><Row p={p} /></li>
}
```

Codetag sugerido para dívida não resolvida agora:

```typescript
// REFACTOR(073): ternário aninhado decidindo a linha — extrair rowFor() e mapa de variantes
```

## Reference

### Critérios Objetivos

- [ ] Complexidade ciclomática do corpo do componente ≤ **5** (mesmo limite da skill `clean-code`).
- [ ] Nenhum operador ternário aninhado dentro do retorno renderizado.
- [ ] No máximo **2** níveis de condicional decidindo o que é renderizado.
- [ ] Nenhum valor derivado calculado a partir de **3** ou mais entradas dentro do corpo
  do componente — extrair para função pura nomeada.
- [ ] Nenhuma função declarada dentro do componente com mais de **5** linhas, exceto
  receptor de evento.
- [ ] Nenhuma expressão dentro do retorno renderizado com mais de **1** operador lógico.

### Exceções Permitidas

- **Guarda de saída antecipada**: o retorno antecipado para estado de carregamento, erro
  ou ausência de dado é o padrão recomendado, não aninhamento — não conta para o limite.
- **Receptor de evento**: o corpo de um receptor pode ultrapassar 5 linhas até o limite da
  rule 033, desde que trate de uma responsabilidade só.
- **Alternância de variante**: escolher entre variantes visuais por mapa de valores é
  ramificação aparente, não lógica — desde que o mapa seja uma constante nomeada
  (skill `clean-code`).
- **Componente raiz de rota**: pode concentrar as guardas de acesso e carregamento da
  tela inteira, com a concentração declarada em comentário.

### Como Detectar

#### Manual

- Buscar `?` seguido de `?` na mesma expressão do retorno renderizado
- Contar os níveis de condicional entre o início do retorno e o elemento mais profundo
- Procurar variáveis calculadas no corpo cujo nome não existe no domínio
- Verificar se o componente tem mais casos de teste que estados visuais

#### Automático

- `pnpm lint` — Biome `complexity/noExcessiveCognitiveComplexity`
- Sem regra nativa de Biome para profundidade de condicional dentro do retorno
  renderizado — detecção via revisão de código

## Related to

- [Simplicity and Clarity (KISS)](../skills/clean-code/SKILL.md): reinforces
- [Single-Level Indentation Rule](../skills/calisthenics/SKILL.md): reinforces
- [Prohibition of ELSE Clause](../skills/calisthenics/SKILL.md): reinforces
- [014 — Pirâmide do Destino (Pyramid of Doom / Arrow Anti-Pattern)](014_piramide-do-destino.md): complements
- [025 — Código Inteligente (Clever Code)](025_codigo-inteligente-clever-code.md): reinforces
- [047 — Vazamento de Regra de Negócio na Apresentação (Business Leakage)](047_vazamento-negocio-apresentacao.md): complements
