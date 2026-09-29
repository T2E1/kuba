---
title: "Prop Drilling"
category: "Component Anti-Patterns"
type: reference
id: "STRUCTURAL-045"
severity: "🟠 High"
tags: [component-anti-patterns]
---

# Prop Drilling

## Explanation

### O que é

Proíbe atravessar uma *prop* por componentes intermediários que não a consomem, apenas
para que ela alcance um descendente mais profundo. O componente do meio passa a declarar,
tipar e repassar um dado que não lhe diz respeito.

*(Previne o anti-pattern Prop Drilling: acoplamento em cadeia entre componentes que não
têm relação de domínio, criado só pelo caminho da árvore.)*

### Por que importa

- Cada componente no caminho ganha uma prop que não usa, e passa a mudar toda vez que o
  contrato do descendente muda — é Shotgun Surgery pela árvore de renderização
- O tipo de props do intermediário deixa de descrever o que ele faz e passa a descrever
  quem está abaixo dele, tornando o componente impossível de reusar noutro contexto
- Renomear ou remover o dado obriga a tocar todos os níveis, e o compilador só acusa o
  último — os intermediários continuam compilando com a prop órfã
- O caminho vira invisível: ler o componente do topo não diz quem consome o dado, e ler o
  de baixo não diz de onde ele veio

## How-to

### Exemplo

```tsx
// ❌ `patient` atravessa Page → Layout → Sidebar sem nenhum dos três lê-lo
function PrescriptionPage({ patient }) {
  return <Layout patient={patient} />
}
function Layout({ patient }) {
  return <Sidebar patient={patient} />
}
function Sidebar({ patient }) {
  return <PatientCard patient={patient} />
}
```

```tsx
// ✅ O consumidor lê da fonte; os intermediários não sabem que o dado existe
function PrescriptionPage() {
  return <Layout><PatientCard /></Layout>
}
function PatientCard() {
  const patient = usePatient() // store do core, ou contexto da feature
  return <Card>{patient.name}</Card>
}
```

Codetag sugerido para dívida não resolvida agora:

```typescript
// REFACTOR(071): Prop Drilling — `patient` atravessa Layout e Sidebar sem uso
// TODO: mover a leitura para PatientCard via usePatient()
```

## Reference

### Critérios Objetivos

- [ ] Nenhuma prop atravessa **2** ou mais componentes intermediários que não a leem.
- [ ] Nenhum componente declara prop cuja única aparição no corpo é o repasse a um filho.
- [ ] Nenhum `{...props}` usado para repassar um conjunto de props que o componente não
  declara nem consome.
- [ ] O tipo de props de um componente não cita nenhum conceito que só o descendente usa.

### Exceções Permitidas

- **Encaminhamento de atributos nativos**: primitivas de design system que repassam ao
  elemento raiz o conjunto de atributos padrão da plataforma, tipado como tal.
- **Um único nível**: pai que passa ao filho direto não é drilling; é a interface normal
  entre os dois.
- **Adaptador de fronteira**: componente que existe exatamente para traduzir o contrato
  de uma biblioteca de terceiro, com o repasse documentado como sua razão de existir.
- **Código legado em migração**: quando a cadeia já existe e a correção está registrada
  como codetag `REFACTOR`, com o caminho completo anotado.

### Como Detectar

#### Manual

- Buscar props declaradas no tipo e ausentes do corpo, exceto na chamada do filho
- Percorrer do consumidor até a origem contando os níveis que não leem o dado
- Procurar `{...props}` ou `{...rest}` em componentes que não são primitivas de encaminhamento
- Verificar, no tipo de props, nomes que pertencem ao vocabulário de outro componente

#### Automático

- Sem regra nativa de Biome para propagação de props entre componentes — detecção via
  revisão de código

## Related to

- [038 — Shotgun Surgery](038_shotgun-surgery.md): reinforces
- [Interface Segregation Principle (ISP)](../skills/solid/SKILL.md): reinforces
- [035 — Middle Man](035_middle-man.md): complements
- [Common Reuse Principle (CRP)](../skills/package/SKILL.md): reinforces
- [043 — Lista Longa de Props (Long Props List)](043_lista-longa-props.md): complements
- [042 — God Component](042_god-component.md): complements
