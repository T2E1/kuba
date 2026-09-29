---
title: "Shotgun Surgery"
category: "Code Smells"
type: reference
id: "STRUCTURAL-038"
severity: "🟠 High"
tags: [code-smells]
---

# Shotgun Surgery

## Explanation

### O que é

Shotgun Surgery ocorre quando uma única mudança requer alterar múltiplas classes ou módulos diferentes. Oposto complementar de Mudança Divergente: aqui, cada novo requisito exige fazer mudanças em múltiplos locais do código (como disparar uma espingarda, acertando vários pontos). Indica baixa coesão e alto acoplamento.

**Sintomas:**

- Mudança de comportamento requer alterar 3+ classes/módulos
- Mesma lógica de cálculo ou validação existe em múltiplos locais
- Adicionar novo campo/feature requer modificar N arquivos em camadas diferentes
- Correção de bug precisa ser aplicada em múltiplos arquivos com o mesmo padrão
- Code review: "por que você também mudou esse arquivo?"

### Por que importa

- Mudanças custosas: cada novo requisito ou correção requer tocar em N lugares
- Alta probabilidade de regressão: é fácil esquecer um dos N locais que precisam mudar
- Dificuldade de teste: testar mudanças espalhadas requer criar mocks para múltiplos módulos
- Indicação de código replicado: lógica que deveria estar centralizada está duplicada
- Frágil: ao mudar um requisito, quebra algo nos outros N módulos anteriormente afetados

## How-to

### Exemplo

```javascript
// ❌ Adicionar campo "phone" requer editar todos esses arquivos:
// user.model.js      → adicionar campo
// user.validator.js  → adicionar validação
// user.dto.js        → adicionar ao DTO
// user.mapper.js     → adicionar ao mapeamento
// user.repository.js → adicionar à query
// user.test.js       → adicionar aos fixtures
```

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

Codetag sugerido para dívida não resolvida agora:

```typescript
// FIXME: Shotgun Surgery — adicionar campo requer N arquivos: model, validator, dto, mapper, repository
// TODO: Centralizar schema com Zod/Yup para validação + tipos + DTOs unificados
```

## Reference

### Critérios Objetivos

- [ ] Mudança de comportamento requer alterar 3+ classes/módulos
- [ ] Mesma lógica de cálculo ou validação existe em múltiplos locais
- [ ] Adicionar novo campo/feature requer modificar N arquivos em camadas diferentes
- [ ] Correção de bug precisa ser aplicada em múltiplos arquivos com mesmo padrão de correção
- [ ] Code review mostra commits modificando arquivos completamente diferentes sem relação clara

### Exceções Permitidas

- **Camadas Intencionais**: Separação em camadas adotada por decisão explícita de arquitetura.
- **Sistemas de [Plugin](../skills/poeaa/references/plugin.md)**: Onde a extensão em vários pontos é o desenho, não o acidente.
- **Código Legado**: Quando a refatoração imediata traria risco inaceitável.
- **Fronteiras de Serviço**: Serviços independentes que tratam a mesma preocupação por desenho.

### Como Detectar

#### Manual

- Analisar histórico de commits: commits de features que sempre tocam N arquivos diferentes
- Buscar comportamentos duplicados: mesma lógica em controllers, services, repositories
- Verificar adição de nova feature: requereria alterar configuração, schema, múltiplos handlers, testes em múltiplos arquivos?

#### Automático

- Análise de commits (`git log --stat`): detectar commits que sempre tocam múltiplos arquivos diferentes para a mesma feature
- Sem regra nativa de Biome para similaridade/duplicação semântica de código — usar ferramenta dedicada de análise de similaridade

## Related to

- [Logic Duplication (DRY)](../skills/clean-code/references/duplicacao-logica.md): reinforces
- [036 — Divergent Change](036_mudanca-divergente.md): complements
- [Single Responsibility Principle (SRP)](../skills/solid/SKILL.md): reinforces
- [Common Closure Principle (CCP)](../skills/package/SKILL.md): reinforces
- [Common Reuse Principle (CRP)](../skills/package/SKILL.md): reinforces
- [Boy Scout Rule (Continuous Refactoring)](../skills/clean-code/references/regra-escoteiro-refatoracao-continua.md): reinforces
