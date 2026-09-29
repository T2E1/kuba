---
title: "Vazamento de Regra de Negócio na Apresentação (Business Leakage)"
category: "Component Anti-Patterns"
type: reference
id: "STRUCTURAL-047"
severity: "🔴 Critical"
tags: [component-anti-patterns]
---

# Vazamento de Regra de Negócio na Apresentação (Business Leakage)

## Explanation

### O que é

Proíbe que um componente de apresentação — aquele cujo contrato é receber dado pronto e
desenhá-lo — contenha regra de negócio: elegibilidade, cálculo de valor, política de
permissão, decisão de fluxo. A regra mora no domínio; o componente exibe o resultado
dela.

*(Previne o anti-pattern Business Leakage: a mesma regra passa a existir em dois lugares
— o domínio e a tela — e diverge silenciosamente.)*

### Por que importa

- A mesma regra passa a ter duas implementações, e a da tela é a que o usuário vê: quando
  divergem, o sistema mostra um número e cobra outro
- Regra na apresentação não é reaproveitável por outro canal — outra tela, um relatório,
  uma rotina — e é reescrita em cada um
- A regra deixa de ser testável isoladamente: provar uma política de permissão passa a
  exigir renderizar a tela inteira
- Auditoria e conformidade perdem o rastro: a resposta para "onde está a regra?" deixa de
  ser um módulo e passa a ser uma busca
- Trocar a camada de apresentação — biblioteca, framework, plataforma — passa a significar
  reescrever o negócio junto

## How-to

### Exemplo

```tsx
// ❌ o prazo de validade é política do domínio, decidido na tela
function PrescriptionRow({ p }) {
  const expired = Date.now() - p.issuedAt.getTime() > 30 * 24 * 60 * 60 * 1000
  return expired ? <ExpiredRow p={p} /> : <ActiveRow p={p} />
}
```

```tsx
// ✅ o core decide; a tela recebe o resultado
// core/prescription/src/policy.ts
export const isExpired = (p: Prescription, now: Date): boolean => …

// packages/prescription — o hook aplica a política; o componente só desenha
function PrescriptionRow({ p, expired }: { p: Prescription; expired: boolean }) {
  return expired ? <ExpiredRow p={p} /> : <ActiveRow p={p} />
}
```

Codetag sugerido para dívida não resolvida agora:

```typescript
// FIXME(074): regra de validade duplicada na view — mover para core/prescription/policy
```

## Reference

### Critérios Objetivos

- [ ] Nenhum componente de apresentação importa de módulo de domínio algo que não seja
  **tipo** — nenhuma função de regra, nenhum serviço, nenhum cliente de dado.
- [ ] Nenhum componente de apresentação contém comparação contra constante de domínio
  (limite, faixa, estado elegível) que não tenha vindo pronta como entrada.
- [ ] Nenhum cálculo de valor de negócio — total, desconto, prazo, elegibilidade — é
  executado dentro de um componente.
- [ ] Toda decisão de permissão chega ao componente como valor booleano já resolvido, e
  não como o dado que permitiria resolvê-la.
- [ ] `pnpm boundaries:check` passa sem violação de fronteira para o arquivo do
  componente.

### Exceções Permitidas

- **Decisão puramente visual**: escolher variante, cor ou ícone a partir de um estado já
  resolvido é apresentação, não negócio.
- **Validação de formato na entrada**: obrigatoriedade, comprimento e formato de campo
  pertencem ao formulário; a regra de negócio sobre o valor, não.
- **Componente de fronteira de feature**: o componente-raiz de uma feature pode compor o
  domínio e a apresentação, desde que não implemente regra — só orquestre.
- **Regra de acessibilidade**: decidir o que anunciar a uma tecnologia assistiva é
  apresentação, mesmo quando depende do estado do dado.

### Como Detectar

#### Manual

- Ler os imports do componente e classificar cada um: tipo, apresentação, ou domínio
- Buscar comparações numéricas e de estado dentro de componentes
- Perguntar de cada condicional: "isto mudaria se a tela fosse outra?" — se não, é negócio
- Procurar a mesma regra escrita no módulo de domínio e no componente

#### Automático

- `pnpm boundaries:check` — os verificadores de fronteira de feature acusam o import que
  atravessa a camada
- Sem regra nativa de Biome que distinga regra de negócio de lógica de apresentação —
  detecção via revisão de código

## Related to

- [Dependency Inversion Principle (DIP)](../skills/solid/SKILL.md): reinforces
- [Single Responsibility Principle (SRP)](../skills/solid/SKILL.md): reinforces
- [005 — Cut-and-Paste Programming](005_cut-and-paste-programming.md): reinforces
- [029 — Feature Envy](029_feature-envy.md): complements
- [Common Closure Principle (CCP)](../skills/package/SKILL.md): reinforces
- [046 — Transformação de Dados no Componente (In-Component Data Transformation)](046_transformacao-dados-no-componente.md): reinforces
- [044 — Lógica Complexa na View (Complicated Logic in Views)](044_logica-complexa-na-view.md): complements
