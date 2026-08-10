# Clever Code

**Severidade:** 🟡 Média
**Regra Associada:** Regra 062

## O Que É

Código escrito para demonstrar a habilidade do autor, não para comunicar intenção. Usa truques de linguagem, expressões densas, abuso de operadores ou metaprogramação onde código direto e legível funcionaria igualmente bem.

## Sintomas

- One-liners que fazem 5 coisas ao mesmo tempo
- Abuso de operadores: `!!value`, `~~n`, `value | 0`, truques bitwise
- Longas cadeias de `reduce`, `flatMap` e `map` aninhados
- Variáveis de uma única letra fora de contextos matemáticos
- Comentário `// não toque nisto` sem explicação do porquê
- Comentários de code review perguntando "o que isso faz?" ou "pode ficar mais claro?"

## ❌ Exemplo (violação)

```javascript
// ❌ "Inteligente" — o que isso faz?
const getDiscount = (u) =>
  u?.premium && u?.purchases > 10 ? (u?.vip ? 0.3 : 0.2) : u?.purchases > 5 ? 0.1 : 0;

// ❌ Truque bitwise para truncar número
const n = value | 0;

// ❌ Coerção implícita como lógica
const display = user.name || user.email || user.id + '';
```

## ✅ Refatoração

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

## Codetag Sugerido

```typescript
// FIXME: Clever Code — ternários aninhados ilegíveis
// TODO: Reescrever com if/else para clareza
```
