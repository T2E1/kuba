---
title: "Duplicação entre Componentes (Duplicated Component)"
category: "Component Anti-Patterns"
type: reference
id: "STRUCTURAL-041"
severity: "🟠 High"
tags: [component-anti-patterns]
---

# Duplicação entre Componentes (Duplicated Component)

## Explanation

### O que é

Proíbe repetir, entre componentes, o mesmo bloco de marcação, a mesma sequência de hooks
ou o mesmo par de estado e efeito. A rule 005 proíbe duplicar lógica; esta fixa as três
formas em que a duplicação aparece na camada de interface, onde ela costuma passar por
"são telas diferentes".

*(Previne o anti-pattern Duplicated Code aplicado à árvore de componentes: a correção
feita em um lugar e esquecida nos outros dois.)*

### Por que importa

- A correção de um defeito é aplicada numa cópia e esquecida nas outras, e o mesmo bug
  volta pelo caminho que ninguém tocou
- Cada cópia envelhece por conta própria: seis meses depois as três são parecidas o
  bastante para enganar e diferentes o bastante para quebrar
- A duplicação de marcação carrega junto a duplicação de acessibilidade — e a cópia
  esquecida é a que fica sem nome acessível
- Sequência de hooks repetida significa que uma regra de ciclo de vida existe sem nome:
  ninguém consegue procurar por ela
- O custo de manter cresce por multiplicação, não por soma: cada cópia nova multiplica o
  custo de toda mudança futura

## How-to

### Exemplo

```tsx
// ❌ em PatientPanel.tsx e em PrescriptionPanel.tsx, o mesmo par estado+efeito
const [open, setOpen] = useState(false)
useEffect(() => {
  const onKey = (e) => e.key === 'Escape' && setOpen(false)
  window.addEventListener('keydown', onKey)
  return () => window.removeEventListener('keydown', onKey)
}, [])
```

```tsx
// ✅ a regra de ciclo de vida ganha nome, mora num hook e é testada uma vez
export function useDismissOnEscape(): [boolean, (open: boolean) => void] { … }

// nos dois componentes
const [open, setOpen] = useDismissOnEscape()
```

Codetag sugerido para dívida não resolvida agora:

```typescript
// REFACTOR(076): par estado+efeito repetido em PatientPanel e PrescriptionPanel
// TODO: extrair useDismissOnEscape
```

## Reference

### Critérios Objetivos

- [ ] Nenhum bloco de marcação com **5** ou mais linhas aparece igual, ou diferente
  apenas em literais, em **2** ou mais arquivos.
- [ ] Nenhuma sequência com **2** ou mais hooks na mesma ordem, com o mesmo propósito,
  aparece em **2** ou mais componentes — extrair para um hook nomeado.
- [ ] Nenhum par estado-mais-efeito que resolve o mesmo problema é escrito mais de uma
  vez.
- [ ] Na **3ª** ocorrência, a extração é obrigatória e não admite adiamento por codetag.
- [ ] Nenhuma cópia de componente criada para variar comportamento — a variação entra por
  entrada ou por composição.

### Exceções Permitidas

- **Segunda ocorrência ainda indecisa**: duas cópias podem coexistir enquanto a abstração
  correta não estiver clara — abstrair cedo é pior (skill `clean-code`). A terceira encerra a
  exceção.
- **Semelhança acidental**: dois blocos iguais hoje que respondem a razões de mudança
  diferentes devem permanecer separados; unificá-los cria acoplamento entre conceitos
  independentes (rule 036).
- **Marcação gerada**: saída de gerador de código não conta, desde que o gerador seja a
  fonte e ninguém edite o resultado.
- **Repetição estrutural de baixo nível**: declarações de duas linhas entre pacotes, na
  exceção já prevista pela rule 005.

### Como Detectar

#### Manual

- Buscar o mesmo texto visível em mais de um componente
- Comparar a ordem dos hooks entre componentes do mesmo domínio
- Procurar arquivos com nome quase igual — sufixo numérico, `V2`, `New`, `Old`
- Ao corrigir um defeito, buscar o mesmo trecho no repositório antes de fechar

#### Automático

- Sem regra nativa de Biome para detecção de clones entre arquivos — detecção via revisão
  de código e busca textual

## Related to

- [005 — Cut-and-Paste Programming](005_cut-and-paste-programming.md): depends on
- [036 — Mudança Divergente (Divergent Change)](036_mudanca-divergente.md): complements
- [038 — Shotgun Surgery](038_shotgun-surgery.md): reinforces
- [Prohibition of Speculative Functionality (YAGNI)](../skills/clean-code/SKILL.md): complements
- [Common Reuse Principle (CRP)](../skills/package/SKILL.md): reinforces
- [004 — Lava Flow (Código Zumbi)](004_codigo-zombie-lava-flow.md): complements
