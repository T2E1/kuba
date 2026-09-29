---
title: "Código Spaghetti (Spaghetti Code)"
category: "Anti-Patterns"
type: reference
id: "STRUCTURAL-003"
severity: "🔴 Critical"
tags: [anti-patterns]
---

# Código Spaghetti (Spaghetti Code)

## Explanation

### O que é

Spaghetti Code ocorre quando o fluxo de controle do código é complexo e entrelaçado como um prato de espaguete. Múltiplos branches, loops profundamente aninhados, `goto`s (ou equivalentes) e lógica de controle entrelaçada. É difícil seguir o fluxo de execução do início ao fim.

### Por que importa

- Impossível entender: desenvolvedores não conseguem rastrear o fluxo lógico
- Bugs ocultos: fluxo de controle complexo esconde casos extremos e condições não testadas
- Difícil testar: cobertura de branches se torna pesadelo; existem centenas de caminhos
- Difícil manter: mudanças quebram caminhos não-óbvios; efeitos colaterais desconhecidos
- Difícil refatorar: qualquer mudança pode quebrar fluxo entrelaçado
- Custo de onboarding muito alto: novos desenvolvedores levam meses para entender efetivamente o código

## How-to

### Como aplicar

- Separar responsabilidades em camadas: I/O, lógica de negócio e apresentação não podem viver na mesma função
- Extrair [008 — estado mutável compartilhado](008_estado-mutavel-compartilhado.md) para objetos passados explicitamente
- Eliminar [aninhamento](../skills/cdd/SKILL.md) com guard clauses e early returns

### Exemplo

```javascript
// ❌ Lógica, I/O e apresentação misturados sem estrutura
async function handleCheckout(req, res) {
  const user = await db.query(`SELECT * FROM users WHERE id = ${req.body.userId}`);
  if (user && user.active) {
    let total = 0;
    for (let item of req.body.items) {
      const product = await db.query(`SELECT * FROM products WHERE id = ${item.id}`);
      if (product.stock > 0) {
        total += product.price * item.qty;
        await db.query(`UPDATE products SET stock = stock - ${item.qty} WHERE id = ${item.id}`);
      }
    }
    await sendEmail(user.email, `Seu pedido de R$${total} foi confirmado`);
    globalOrderCount++;
    res.json({ ok: true, total });
  } else {
    res.status(400).json({ error: 'Usuário inativo' });
  }
}
```

```javascript
// ✅ Responsabilidades separadas em camadas
class CheckoutService {
  async process(userId, items) {
    const user = await this.userRepo.findActiveOrThrow(userId);
    const order = await this.orderRepo.create(user, items);
    await this.emailService.sendConfirmation(user, order);
    return order;
  }
}
```

Codetag sugerido:

```typescript
// FIXME: Spaghetti Code — I/O, validação, lógica e apresentação misturados
// TODO: Separar em camadas: Controller → Service → Repository
```

## Reference

### Critérios Objetivos

- [ ] Mais de 3 níveis de indentação aninhada (if dentro de if dentro de if)
- [ ] Branches que saltam arbitrariamente para partes diferentes do código (equivalentes a goto)
- [ ] Funções com mutação inesperada de estado externo (variáveis globais, estado mutável compartilhado)
- [ ] Fluxo de controle que depende de variáveis mutadas em múltiplos locais distantes
- [ ] Múltiplos pontos de entrada/saída na mesma função (returns antecipados em todo lugar, loops com break/continue misturados)
- [ ] [Complexidade ciclomática](../skills/complexity/SKILL.md) > 15 na mesma função

### Exceções Permitidas

- **Máquinas de Estado**: `switch`/`case` documentado implementando transição de estados.
- **Dispatcher de Eventos**: Fluxo orientado a eventos com dispatcher único e handlers separados.
- **Parsers de Protocolo**: Complexidade imposta por especificação externa de protocolo ou rede.
- **Código Legado**: Quando a refatoração imediata traria risco inaceitável.

### Como Detectar

#### Manual

- Ler código: se você visualiza fluxo como grafo com arestas cruzando por todo lado, é spaghetti
- Buscar variáveis mutadas em múltiplos locais sem localidade clara
- Identificar funções onde há múltiplos `if/else` encadeados com branches aninhados

#### Automático

- Biome: `complexity/noExcessiveCognitiveComplexity` (sinaliza complexidade > limite configurado)
- Sem regra nativa de Biome para uso de variável global/mutabilidade compartilhada — detecção via revisão de código

## Related to

- [Single-Level Indentation Rule](../skills/calisthenics/references/nivel-unico-indentacao.md): reinforces
- [033 — Maximum Lines per Method](033_limite-maximo-linhas-metodo.md): reinforces
- [Side-Effect Function Restrictions](../skills/clean-code/references/restricao-funcoes-efeitos-colaterais.md): reinforces
- [014 — Pyramid of Doom](014_piramide-do-destino.md): complements
- [Flag Arguments](../skills/clean-code/references/argumentos-sinalizadores.md): reinforces
- [006 — Decomposição Funcional](006_decomposicao-funcional.md): complements — outro sintoma de fluxo de controle sem estrutura orientada a objetos
- [Complexidade Ciclomática](../skills/complexity/SKILL.md): reinforces — métrica objetiva usada para detectar o spaghetti
- [Maintainability — Manutenibilidade](../skills/quality/references/maintainability.md): reinforces — atributo McCall mais afetado pelo fluxo emaranhado
