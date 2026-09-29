---
title: "Código Inteligente (Clever Code)"
category: "Code Smells"
type: reference
id: "BEHAVIORAL-025"
severity: "🟡 Medium"
tags: [code-smells]
---

# Código Inteligente (Clever Code)

## Explanation

### O que é

Clever Code ocorre quando um desenvolvedor escreve código excessivamente conciso, usando truques não-óbvios, operadores complexos ou padrões de código não convencionais para mostrar "habilidade" em vez de priorizar clareza. Código que faz o desenvolvedor se sentir inteligente ao escrever (e outros se sentirem confusos ao ler).

**Sintomas:**

- One-liners que fazem 5 coisas ao mesmo tempo
- Abuso de operadores: `!!value`, `~~n`, `value | 0`, truques bitwise
- Longas cadeias de `reduce`, `flatMap` e `map` aninhados
- Variáveis de uma única letra fora de contextos matemáticos
- Comentário `// não toque nisto` sem explicação do porquê
- Comentários de code review perguntando "o que isso faz?" ou "pode ficar mais claro?"

### Por que importa

- Dificuldade de manutenção: outros desenvolvedores não entendem o código sem gastar muito tempo
- Esconde bugs: código complexo tem mais casos extremos e é mais difícil raciocinar sobre
- Frustra time: cria cultura de "esperteza de código" sobre clareza de código
- Dificuldade de onboarding: novos desenvolvedores levam muito mais tempo para serem produtivos
- Comum em code reviews: "isso funciona mas não consigo entender"

## How-to

### Exemplo

```javascript
// ❌ "Inteligente" — o que isso faz?
const getDiscount = (u) =>
  u?.premium && u?.purchases > 10 ? (u?.vip ? 0.3 : 0.2) : u?.purchases > 5 ? 0.1 : 0;

// ❌ Truque bitwise para truncar número
const n = value | 0;

// ❌ Coerção implícita como lógica
const display = user.name || user.email || user.id + '';
```

```javascript
// ✅ Legível — intenção clara em cada linha
function getDiscount(user) {
  if (!user) return 0;
  if (user.premium && user.vip && user.purchases > 10) return 0.3;
  if (user.premium && user.purchases > 10) return 0.2;
  if (user.purchases > 5) return 0.1;
  return 0;
}

// ✅ Intenção explícita
const n = Math.trunc(value);
const display = user.name ?? user.email ?? String(user.id);
```

Codetag sugerido para dívida não resolvida agora:

```typescript
// FIXME: Clever Code — ternários aninhados ilegíveis
// TODO: Reescrever com if/else para clareza
```

## Reference

### Critérios Objetivos

- [ ] Comentários de code review perguntando "o que isso faz?" ou "pode ser mais claro?"
- [ ] Uso de one-liners complexos: encadeamento de ternários, arrow functions com múltiplas operações
- [ ] Operadores de bit-shifting, manipulações bitwise ou outros recursos avançados da linguagem sem comentários explicativos
- [ ] Regex complexo ou parsing de string embutido no código principal
- [ ] Funções com nomes curtos não-explicativos (`fn()`, `go()`, `proc()`) fazendo lógica complexa

### Exceções Permitidas

- **Algoritmos Canônicos**: Implementação conhecida — CRC32, MD5 — cujo propósito o nome da função entrega.
- **Funções Minúsculas**: Função intencionalmente minúscula onde o contexto torna o significado óbvio.
- **Hotspots Perfilados**: Caminho identificado por profiling, com comentário justificando a otimização.
- **Domínio Especializado**: Cripto, gráficos ou programação de sistemas, onde a operação é padrão da área.

### Como Detectar

#### Manual

- Code review: regras explícitas para rejeitar código "esperto" sobre código "claro"
- Buscar one-liners com > 3 operações nas mesmas linhas
- Identificar código que desenvolvedor gasta 5 minutos lendo sem ser o autor

#### Automático

- Biome: `complexity/noExcessiveCognitiveComplexity` (nested ternaries/arrow functions complexas elevam a complexidade)
- Biome (formatter): aplica estilo consistente, reduzindo variações "espertas" de formatação

## Related to

- [Simplicity and Clarity (KISS)](../skills/clean-code/references/priorizacao-simplicidade-clareza.md): reinforces
- [Consistent Class and Method Names](../skills/naming/references/nomes-classes-metodos-consistentes.md): reinforces
- [Single-Level Indentation Rule](../skills/calisthenics/references/nivel-unico-indentacao.md): reinforces
- [012 — Premature Optimization](012_otimizacao-prematura.md): reinforces
- [Uso de Variáveis Explicativas (G19)](../skills/clean-code/references/variaveis-explicativas.md): reinforces — extrair variáveis nomeadas é o antídoto direto para expressões "espertas" e densas.
- [Intenção Obscurecida (G16)](../skills/clean-code/references/intencao-obscurecida.md): reinforces — Clever Code é a causa mais comum de intenção obscurecida no código.
- [Qualidade de Comentários: Apenas o Porquê](../skills/clean-code/references/qualidade-comentarios-porque.md): complements — um comentário "não toque nisto" sem porquê é sintoma do mesmo problema.
- [003 — Código Spaghetti (Spaghetti Code)](003_codigo-spaghetti.md): contrasts — Spaghetti Code é desorganização estrutural; Clever Code é ilegibilidade por densidade excessiva de uma única expressão.
