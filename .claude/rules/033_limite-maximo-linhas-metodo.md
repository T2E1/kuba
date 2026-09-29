---
title: "Limite Máximo de Linhas por Método"
category: "Code Smells"
type: reference
id: "STRUCTURAL-033"
severity: "🟠 High"
tags: [code-smells]
---

# Limite Máximo de Linhas por Método

## Explanation

### O que é

Long Method ocorre quando um método possui muitas linhas de código, tipicamente fazendo várias coisas diferentes. Métodos longos são difíceis de entender, testar, reutilizar e manter. E frequentemente contêm múltiplas abstrações ocultas.

**Sintomas:**

- Funções com mais de 20–30 linhas
- Necessidade de comentários separando "seções" dentro da função
- Múltiplos níveis de abstração misturados: I/O, validação, cálculo, formatação
- Impossível testar sem setup complexo
- Mais de um ponto de retorno com lógica diferente em cada

### Por que importa

- Baixa legibilidade: desenvolvedores perdem o fluxo lógico em métodos extensos, muitas vezes elevando a [complexidade ciclomática](../skills/complexity/SKILL.md) do método
- Dificuldade de teste: testar múltiplas responsabilidades em um único método é complexo
- Baixa reusabilidade: partes do método não podem ser reutilizadas isoladamente
- Code smell: métodos longos frequentemente indicam violação de SRP e baixa coesão
- Bugs ocultos: é fácil se perder no fluxo de controle complexo e introduzir bugs

## How-to

### Exemplo

```javascript
// ❌ Uma função fazendo validação, transformação, persistência e notificação
async function registerUser(data) {
  // validação
  if (!data.email) throw new Error('Email obrigatório');
  if (!data.email.includes('@')) throw new Error('Email inválido');
  if (!data.password || data.password.length < 8) throw new Error('Senha fraca');

  // transformação
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const slug = data.name.toLowerCase().replace(/\s+/g, '-');

  // persistência
  const user = await db.users.create({ ...data, password: hashedPassword, slug });

  // notificação
  await emailService.send(user.email, 'Bem-vindo!', welcomeTemplate(user));
  await analyticsService.track('user_registered', { userId: user.id });

  return user;
}
```

```javascript
// ✅ Cada responsabilidade em sua própria função
async function registerUser(data) {
  validateUserData(data);
  const prepared = await prepareUserData(data);
  const user = await db.users.create(prepared);
  await notifyRegistration(user);
  return user;
}
```

Codetag sugerido para dívida não resolvida agora:

```typescript
// FIXME: Long Method — 27 linhas, 4 responsabilidades
// TODO: Extrair validateUserData, prepareUserData, notifyRegistration
```

## Reference

### Critérios Objetivos

- [ ] Métodos com mais de 20 linhas de código (excluindo linhas em branco e comentários)
- [ ] Métodos com mais de 3 níveis de indentação aninhada
- [ ] Métodos que fazem mais de 3 coisas diferentes (ex: valida + persiste + loga)
- [ ] Métodos com múltiplas responsabilidades em sequência sem dependência clara
- [ ] Métodos onde até o autor não consegue explicar "o que ele faz" em uma frase

### Exceções Permitidas

- **Construtores Complexos**: Quando quebrar a construção em partes reduziria a legibilidade.
- **Algoritmos Matemáticos**: Onde dividir a lógica reduziria a clareza em vez de aumentá-la.
- **Código Legado**: Quando a refatoração traria alto risco de regressão.
- **Handlers de Terceiros**: Exigidos por biblioteca externa, com corpo que não controlamos.

### Como Detectar

#### Manual

- Ler métodos: se você precisa pausar no meio para continuar entendendo, está longo demais
- Buscar comentários explicando "aqui ele faz X, agora faz Y" — pontos de extração
- Identificar métodos onde CTRL+F mostra padrões repetidos, condições ou validações

#### Automático

- Biome: `complexity/noExcessiveCognitiveComplexity` (sinaliza métodos com complexidade acumulada alta, correlacionada a métodos longos)

## Related to

- [Single-Level Indentation Rule](../skills/calisthenics/references/nivel-unico-indentacao.md): reinforces
- [Single Responsibility Principle (SRP)](../skills/solid/SKILL.md): reinforces
- [Maximum Lines per Class File](../skills/calisthenics/references/limite-maximo-linhas-classe.md): complements
- [Tell, Don't Ask](../skills/calisthenics/references/diga-nao-pergunte.md): complements
- [Flag Arguments](../skills/clean-code/references/argumentos-sinalizadores.md): reinforces
- [030 — Refused Bequest](030_heranca-refusao.md): reinforces
