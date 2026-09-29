---
title: "Transformação de Dados no Componente (In-Component Data Transformation)"
category: "Component Anti-Patterns"
type: reference
id: "BEHAVIORAL-046"
severity: "🟠 High"
tags: [component-anti-patterns]
---

# Transformação de Dados no Componente (In-Component Data Transformation)

## Explanation

### O que é

Proíbe que um componente concentre, no mesmo corpo, a **origem** do dado (a requisição ou
a leitura do cache), a **transformação** do payload recebido e a **renderização**. A
remodelagem do dado acontece na camada que o busca; o componente recebe a forma de
domínio já pronta.

*(Previne o anti-pattern In-Component Data Transformation: o componente vira o único
lugar onde a forma da resposta da API é conhecida.)*

### Por que importa

- O formato da API vaza para a árvore de componentes: uma mudança no backend obriga a
  editar um arquivo de interface, e o compilador só acusa o último consumidor
- A transformação não pode ser testada sem montar o componente — o que era uma função
  pura passa a exigir renderização, requisição simulada e espera de efeito
- Dois componentes que consomem o mesmo endpoint reimplementam a mesma remodelagem, e
  divergem no primeiro campo opcional
- A transformação roda a cada renderização, não a cada resposta, e o custo aparece como
  lentidão sem causa aparente
- O componente passa a ter duas razões para mudar — o formato do dado e a aparência —
  violando SRP antes de qualquer crescimento

## How-to

### Exemplo

```tsx
// ❌ origem + remodelagem + render, a cada render, com o tipo da API na tela
function PrescriptionList({ patientId }) {
  const { data } = useQuery(['prescriptions', patientId], () => api.get(patientId))
  const items = data?.items
    .map((i) => ({ id: i.prescription_id, issuedAt: new Date(i.created_at) }))
    .sort((a, b) => b.issuedAt - a.issuedAt)
  return <ul>{items?.map(renderRow)}</ul>
}
```

```tsx
// ✅ o core remodela uma vez, com função pura testada; a tela recebe o tipo de domínio
// core/prescription/src/mappers.ts
export const toPrescriptionList = (dto: PrescriptionListDto): Prescription[] => …

// packages/prescription/src/usePrescriptions.ts
export const usePrescriptions = (patientId) =>
  useQuery({ queryKey: prescriptionKeys.list(patientId), queryFn, select: toPrescriptionList })

// packages/prescription/src/PrescriptionList.tsx
function PrescriptionList({ prescriptions }: { prescriptions: Prescription[] }) { … }
```

Codetag sugerido para dívida não resolvida agora:

```typescript
// REFACTOR(072): remodelagem do payload dentro do componente
// TODO: mover para core/prescription/mappers e usar `select` no hook
```

## Reference

### Critérios Objetivos

- [ ] Nenhum componente contém, ao mesmo tempo, a chamada que obtém o dado remoto e uma
  operação de remodelagem (`map`, `filter`, `reduce`, `flat`, `sort`, `groupBy`) sobre a
  resposta.
- [ ] Nenhum componente declara ou importa o tipo bruto da resposta da API — recebe o
  tipo de domínio.
- [ ] Toda remodelagem de payload vive numa função pura, fora do arquivo do componente, e
  tem teste próprio que não monta componente nenhum.
- [ ] Nenhuma operação de remodelagem sobre coleção remota aparece diretamente no corpo do
  retorno renderizado.

### Exceções Permitidas

- **Formatação de apresentação**: converter um valor já de domínio para exibição —
  máscara, unidade, localidade — é trabalho do componente, e não é remodelagem.
- **Ordenação e filtro controlados pela interface**: quando a ordem ou o recorte são
  estado da própria tela (coluna clicada, busca digitada), a operação pertence ao
  componente porque o critério é dele.
- **Seleção de um campo**: ler uma propriedade do objeto de domínio não é transformação.
- **Protótipo descartável**: exploração com prazo e codetag `CLEANUP`, nunca no caminho
  de um merge para a branch principal.

### Como Detectar

#### Manual

- Buscar, no mesmo arquivo, a chamada de obtenção de dado e operações de coleção sobre o resultado
- Procurar tipos com nome de contrato de API (`Response`, `Payload`, `Dto`) importados por componentes
- Verificar se a mesma remodelagem aparece em mais de um componente que consome o mesmo endpoint
- Conferir se existe teste da transformação que não precisa renderizar nada

#### Automático

- `pnpm boundaries:check` — acusa import que atravessa a fronteira de camada declarada
- Sem regra nativa de Biome para coabitação de origem e transformação no mesmo arquivo —
  detecção via revisão de código

## Related to

- [Single Responsibility Principle (SRP)](../skills/solid/SKILL.md): reinforces
- [047 — Vazamento de Regra de Negócio na Apresentação (Business Leakage)](047_vazamento-negocio-apresentacao.md): reinforces
- [005 — Cut-and-Paste Programming](005_cut-and-paste-programming.md): complements
- [Side-Effect Function Restrictions](../skills/clean-code/SKILL.md): reinforces
- [Dependency Inversion Principle (DIP)](../skills/solid/SKILL.md): reinforces
- [044 — Lógica Complexa na View (Complicated Logic in Views)](044_logica-complexa-na-view.md): complements
