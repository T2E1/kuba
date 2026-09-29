---
title: "Cut-and-Paste Programming"
category: "Anti-Patterns"
type: reference
id: "STRUCTURAL-005"
severity: "🔴 Critical"
tags: [anti-patterns]
---

# Cut-and-Paste Programming

## Explanation

### O que é

Cut-and-Paste Programming ocorre quando a reutilização de código acontece por cópia e colagem de blocos entre arquivos ou funções, em vez de por uma abstração reutilizável. A mesma lógica passa a existir em múltiplos lugares sem uma única fonte de verdade — violação direta do [princípio DRY (Don't Repeat Yourself)](../skills/clean-code/references/duplicacao-logica.md).

### Por que importa

- Bug corrigido em uma cópia continua presente em todas as outras, sem que ninguém perceba
- Divergência silenciosa: cada cópia evolui de forma independente até deixarem de ser equivalentes
- Aumenta o custo de manutenção: qualquer mudança de regra exige localizar e editar todas as cópias
- Sinaliza ausência de abstração adequada, mesmo quando cada cópia individual parece "simples"

## How-to

### Como aplicar

- Extract Function: extrair a lógica repetida para uma única fonte de verdade e chamá-la nos pontos onde antes havia cópias

### Exemplo

```javascript
// ❌ Mesma validação copiada em três lugares
function createUser(data) {
  if (!data.email || !data.email.includes('@')) throw new Error('Email inválido');
  if (!data.name || data.name.length < 2) throw new Error('Nome inválido');
  return db.users.create(data);
}

function updateUser(id, data) {
  if (!data.email || !data.email.includes('@')) throw new Error('Email inválido');
  if (!data.name || data.name.length < 2) throw new Error('Nome inválido');
  return db.users.update(id, data);
}
```

```javascript
// ✅ Validação extraída para única fonte de verdade (Extract Function)
function validateUserData(data) {
  if (!data.email || !data.email.includes('@')) throw new Error('Email inválido');
  if (!data.name || data.name.length < 2) throw new Error('Nome inválido');
}

function createUser(data) {
  validateUserData(data);
  return db.users.create(data);
}

function updateUser(id, data) {
  validateUserData(data);
  return db.users.update(id, data);
}
```

Codetag sugerido:

```typescript
// FIXME: Cut-and-Paste Programming — validação duplicada em create/update/patch
// TODO: Extract Function — criar validateUserData() reutilizável
```

## Reference

### Critérios Objetivos

- [ ] Cópia direta de blocos de código com mais de 5 linhas entre classes ou métodos
- [ ] Lógica complexa repetida em mais de 2 locais sem extração
- [ ] Blocos de código idênticos ou quase idênticos em arquivos diferentes
- [ ] Comentário do tipo "copiado de X" no código
- [ ] Funções com nomes como `processarPedidoV2`, `processarPedidoFinal`, `processarPedidoCorrigido`

### Exceções Permitidas

- **Coincidência Estrutural Temporária**: dois trechos parecidos que ainda não convergiram em significado — extrair cedo demais pode acoplar conceitos que só parecem iguais por enquanto.
- **Protótipos e Spikes**: código exploratório descartável, fora do caminho de produção.

### Como Detectar

#### Manual

- Ler múltiplos arquivos/métodos correlatos e comparar blocos visualmente semelhantes
- Buscar comentários que mencionem origem de cópia ("copiado de", "baseado em")
- Verificar histórico de commits: correção aplicada em um arquivo sem o equivalente em arquivos com lógica parecida

#### Automático

- Sem regra nativa de Biome para detecção semântica de duplicação — usar ferramenta
  dedicada de análise de similaridade (clone detection), que aponta blocos idênticos ou
  quase idênticos entre arquivos

## Related to

- [Logic Duplication (DRY)](../skills/clean-code/references/duplicacao-logica.md): reinforces
- [004 — Lava Flow (Código Zumbi)](004_codigo-zombie-lava-flow.md): complements — cópias abandonadas viram código zumbi com o tempo
- [Boy Scout Rule (Continuous Refactoring)](../skills/clean-code/references/regra-escoteiro-refatoracao-continua.md): reinforces
- [Template Method](../skills/gof/references/template-method.md): contrasts — o padrão GoF que formaliza a abstração que o copy-paste deveria ter usado
- [Maintainability — Manutenibilidade](../skills/quality/references/maintainability.md): reinforces — atributo McCall diretamente degradado pela duplicação
- [Reusability — Reusabilidade](../skills/quality/references/reusability.md): contrasts — copiar em vez de reusar é o oposto direto desta qualidade
