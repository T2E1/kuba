# Golden Hammer

**Severidade:** 🟡 Média
**Regra Associada:** Regra 068

## O Que É

Usar uma tecnologia, ferramenta ou padrão familiar para resolver todos os problemas, independentemente de ser a solução mais adequada. "Se a única ferramenta que você tem é um martelo, tudo parece um prego." — Abraham Maslow.

## Sintomas

- Mesma ferramenta/padrão aplicado em 3+ contextos significativamente diferentes
- O mesmo banco de dados, framework ou padrão é aplicado em contextos muito diferentes
- Decisões técnicas baseadas em familiaridade, não em adequação ao problema
- Resistência a avaliar alternativas: "já usamos X para tudo, vamos usar aqui também"
- Usar padrão de microsserviço em sistemas onde um único monolito seria suficiente
- Usar banco de dados NoSQL em sistemas fortemente relacionais ou vice-versa
- Soluções superdimensionadas para problemas simples (ex: Kafka para 10 mensagens/dia)

## ❌ Exemplo (violação)

```javascript
// ❌ Usar Redis (cache distribuído) para armazenar config que muda uma vez por semana
const config = await redis.get('app:config');
// Solução superdimensionada: um arquivo JSON ou variável de ambiente resolveria

// ❌ Usar GraphQL para uma API com 2 endpoints simples
// porque "usamos GraphQL para tudo"
```

## ✅ Refatoração

```javascript
// ✅ Solução proporcional ao problema (KISS + Ferramenta Certa para o Trabalho)
import config from './config.json'; // ou process.env.CONFIG

// ✅ REST simples para API simples
app.get('/users/:id', getUserHandler);
app.post('/users', createUserHandler);
```

## Codetag Sugerido

```typescript
// FIXME: Golden Hammer — Redis para config estática (superdimensionado)
// TODO: Usar config.json ou variáveis de ambiente; reservar Redis para cache real
```
