---
title: "Componente Grande (Big Component)"
category: "Component Anti-Patterns"
type: reference
id: "STRUCTURAL-039"
severity: "🟡 Medium"
tags: [component-anti-patterns]
---

# Componente Grande (Big Component)

## Explanation

### O que é

Limita o tamanho físico de um componente: **80** linhas na função e **150** no arquivo,
excluindo linhas em branco e comentários. É o par da rule 042 — aquela conta
responsabilidades, esta conta linhas. Um componente pode violar uma sem violar a outra, e
as duas medem coisas diferentes de propósito.

*(Previne o anti-pattern Big Component: o arquivo que ninguém abre inteiro porque não
cabe na tela.)*

### Por que importa

- O que não cabe na tela não é lido inteiro: quem edita vê um trecho e supõe o resto, e é
  daí que vem a alteração que quebra o que estava fora do campo de visão
- O tamanho é o indicador mais barato que existe — não exige julgamento, não admite
  discussão e antecipa quase sempre a violação de SRP que a rule 042 vai confirmar
- Arquivo grande concentra conflito de merge e torna o histórico ilegível: o `blame`
  aponta para a mesma linha reescrita por cinco motivos diferentes
- Componente grande não é reaproveitado, é copiado — e a cópia é a origem da duplicação
  que a rule 041 proíbe
- A revisão degrada com o tamanho do diff: acima de certo ponto, revisar vira aprovar

## How-to

### Exemplo

```tsx
// ❌ 210 linhas, dois componentes exportados, seis níveis de JSX
export function PrescriptionPage() { /* 140 linhas */ }
export function PrescriptionSummary() { /* 70 linhas */ }
```

```tsx
// ✅ um componente por arquivo, abaixo de 80 linhas, composição rasa
// PrescriptionPage.tsx      — 30 linhas: só compõe
// PrescriptionSummary.tsx   — 45 linhas
// PrescriptionForm.tsx      — 60 linhas
// usePrescriptionDraft.ts   — o estado que os três compartilham
```

Codetag sugerido para dívida não resolvida agora:

```typescript
// REFACTOR(079): PrescriptionPage.tsx com 210 linhas e 2 exports — dividir por responsabilidade
```

## Reference

### Critérios Objetivos

- [ ] Função de componente com no máximo **80** linhas de código, excluindo linhas em
  branco e comentários.
- [ ] Arquivo de componente com no máximo **150** linhas de código, no mesmo critério.
- [ ] Profundidade máxima de **4** níveis de aninhamento na marcação retornada.
- [ ] **1** componente exportado por arquivo.
- [ ] Componente que atinge **60** linhas é candidato imediato a divisão, no mesmo
  critério da rule 022.

### Exceções Permitidas

- **Marcação sem ramificação**: uma estrutura longa e linear — uma tabela de dezoito
  colunas, um formulário longo sem regra entre campos — pode ultrapassar o limite de
  linhas, desde que a profundidade de aninhamento e a complexidade ciclomática fiquem
  dentro dos limites.
- **Componente gerado**: saída de gerador, desde que ninguém edite o resultado à mão.
- **Mapa de configuração**: arquivo que declara constantes e variantes não é componente e
  não responde a este limite.
- **Código legado em migração**: com a divisão registrada como codetag `REFACTOR` e o
  recorte proposto anotado.

### Como Detectar

#### Manual

- Contar as linhas do arquivo e da função de componente
- Contar os níveis de aninhamento entre o início do retorno e o elemento mais profundo
- Verificar se o arquivo exporta mais de um componente
- Rolar o arquivo: se a leitura exige rolagem para entender uma decisão, o limite já passou

#### Automático

- `pnpm lint` — Biome `complexity/noExcessiveCognitiveComplexity` acusa o excesso de
  ramificação, que costuma acompanhar o excesso de linhas
- Sem regra nativa de Biome para limite de linhas por arquivo ou por função — detecção
  via revisão de código

## Related to

- [022 — Classe Grande (Large Class)](022_classe-grande.md): depends on
- [033 — Limite Máximo de Linhas por Método](033_limite-maximo-linhas-metodo.md): reinforces
- [042 — God Component](042_god-component.md): complements
- [001 — The Blob (God Object)](001_anti-pattern-the-blob.md): reinforces
- [Single-Level Indentation Rule](../skills/calisthenics/SKILL.md): reinforces
- [041 — Duplicação entre Componentes (Duplicated Component)](041_duplicacao-entre-componentes.md): complements
- [044 — Lógica Complexa na View (Complicated Logic in Views)](044_logica-complexa-na-view.md): complements
