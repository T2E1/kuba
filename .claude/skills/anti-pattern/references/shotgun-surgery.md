# Shotgun Surgery

**Severidade:** 🟠 Alta
**Regra Associada:** Regra 058

## O Que É

Uma única mudança lógica requer alterações em muitos lugares diferentes do código simultaneamente. Cada vez que algo muda, edições são "disparadas" por toda a base de código como perdigões de uma espingarda. Oposto do Divergent Change: aqui, uma mudança requer N arquivos alterados.

## Sintomas

- Mudança de comportamento requer alterar 3+ classes/módulos
- Mesma lógica de cálculo ou validação existe em múltiplos locais
- Adicionar novo campo/feature requer modificar N arquivos em camadas diferentes
- Correção de bug precisa ser aplicada em múltiplos arquivos com o mesmo padrão
- Code review: "por que você também mudou esse arquivo?"

## ❌ Exemplo (violação)

```javascript
// ❌ Adicionar campo "phone" requer editar todos esses arquivos:
// user.model.js      → adicionar campo
// user.validator.js  → adicionar validação
// user.dto.js        → adicionar ao DTO
// user.mapper.js     → adicionar ao mapeamento
// user.repository.js → adicionar à query
// user.test.js       → adicionar aos fixtures
```

## ✅ Refatoração

```javascript
// ✅ Feature coesa: schema centraliza tudo (Move Method + Move Field)
const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^\+\d{10,15}$/), // adicionar aqui → funciona em todo o sistema
});

// Inferência de tipos + validação + DTO + mapeamento = tudo em um lugar
type User = z.infer<typeof userSchema>;
```

## Codetag Sugerido

```typescript
// FIXME: Shotgun Surgery — adicionar campo requer N arquivos: model, validator, dto, mapper, repository
// TODO: Centralizar schema com Zod/Yup para validação + tipos + DTOs unificados
```
