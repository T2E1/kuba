# Long Method

**Severidade:** 🟠 Alta
**Regra Associada:** Regra 055

## O Que É

Função ou método com linhas demais, executando múltiplas tarefas em sequência. Fowler: quanto mais longa a função, mais difícil de entender. Funções curtas com bons nomes são autodocumentadas.

## Sintomas

- Funções com mais de 20–30 linhas
- Necessidade de comentários separando "seções" dentro da função
- Múltiplos níveis de abstração misturados: I/O, validação, cálculo, formatação
- Impossível testar sem setup complexo
- Mais de um ponto de retorno com lógica diferente em cada

## ❌ Exemplo (violação)

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

## ✅ Refatoração

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

## Codetag Sugerido

```typescript
// FIXME: Long Method — 27 linhas, 4 responsabilidades
// TODO: Extrair validateUserData, prepareUserData, notifyRegistration
```
